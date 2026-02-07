
import cv2
import numpy as np
import os
import sys
from pathlib import Path


def detect_watermark_with_ocr(image):
    """
    Use EasyOCR to find the watermark text bounding boxes.
    Returns list of bounding boxes [[x1,y1],[x2,y2],[x3,y3],[x4,y4]].
    """
    import easyocr
    reader = easyocr.Reader(['en'], gpu=False, verbose=False)

    # Convert BGR to RGB
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = reader.readtext(image_rgb)

    watermark_boxes = []
    watermark_keywords = ['euro', 'girl', 'escort', '.com', 'eurogirlsescort',
                          'eurogirls', 'girlsescort', 'ort.com', 'uro', 'irl',
                          'scort', 'ort', 'com']

    print(f"  OCR found {len(results)} text regions:")
    for (bbox, text, conf) in results:
        text_lower = text.lower().replace(' ', '')
        print(f"    '{text}' (conf: {conf:.2f})")
        # Check if this text is part of the watermark
        is_watermark = any(kw in text_lower for kw in watermark_keywords)
        # Also catch partial matches with low confidence (watermark is semi-transparent)
        if is_watermark or conf < 0.4:
            watermark_boxes.append(bbox)
            print(f"      -> Marked as watermark")

    return watermark_boxes


def create_ocr_mask(image, boxes, padding=10):
    """
    Create a mask from OCR-detected bounding boxes.
    Since OCR may only detect parts of the watermark (where contrast is high),
    we use detected boxes to find the text's vertical position, then extend
    the mask as a full horizontal band to cover the entire watermark line.
    """
    h, w = image.shape[:2]
    mask = np.zeros((h, w), dtype=np.uint8)

    if not boxes:
        return mask

    # Find the vertical extent of all detected text boxes
    all_y = []
    all_x = []
    for box in boxes:
        pts = np.array(box, dtype=np.int32)
        all_y.extend(pts[:, 1].tolist())
        all_x.extend(pts[:, 0].tolist())

    y_min = min(all_y) - padding
    y_max = max(all_y) + padding
    # Extend horizontally across the full image width (watermark spans wide)
    x_min = int(w * 0.04)
    x_max = int(w * 0.96)

    # Clamp
    y_min = max(0, y_min)
    y_max = min(h, y_max)

    # Create horizontal band mask
    mask[y_min:y_max, x_min:x_max] = 255

    # Small dilation for safety
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.dilate(mask, kernel, iterations=1)

    return mask


def create_fallback_mask(image):
    """
    If OCR doesn't find the watermark, use a fixed rectangular mask
    based on the known watermark position pattern.
    """
    h, w = image.shape[:2]
    mask = np.zeros((h, w), dtype=np.uint8)

    # The "EuroGirlsEscort.com" watermark typically sits in this region
    y1 = int(h * 0.40)
    y2 = int(h * 0.48)
    x1 = int(w * 0.08)
    x2 = int(w * 0.92)

    mask[y1:y2, x1:x2] = 255
    return mask


def remove_watermark_lama(input_path, output_path, debug_dir):
    """
    Remove watermark using OCR detection + LaMa inpainting.
    """
    from simple_lama_inpainting import SimpleLama
    from PIL import Image

    image_cv = cv2.imread(input_path)
    if image_cv is None:
        print(f"  Error: Could not read {input_path}")
        return False

    filename = os.path.basename(input_path)
    name, ext = os.path.splitext(filename)

    # Step 1: Detect watermark text with OCR
    print("  Running OCR detection...")
    boxes = detect_watermark_with_ocr(image_cv)

    if boxes:
        print(f"  Found {len(boxes)} watermark regions via OCR")
        mask = create_ocr_mask(image_cv, boxes, padding=12)
    else:
        print("  OCR didn't find watermark, using fallback mask")
        mask = create_fallback_mask(image_cv)

    # Save debug mask
    debug_mask_path = os.path.join(debug_dir, f"{name}_mask.png")
    cv2.imwrite(debug_mask_path, mask)
    print(f"  Debug mask saved: {debug_mask_path}")

    # Step 2: LaMa inpainting
    image_rgb = cv2.cvtColor(image_cv, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(image_rgb)
    pil_mask = Image.fromarray(mask)

    print("  Loading LaMa model...")
    lama = SimpleLama()
    print("  Running LaMa inpainting...")
    result = lama(pil_image, pil_mask)

    result.save(output_path)
    print(f"  Saved: {output_path}")
    return True


if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.abspath(__file__))
    target_dir = os.path.join(base_dir, "target")
    results_dir = os.path.join(base_dir, "results")
    debug_dir = os.path.join(base_dir, "debug")

    os.makedirs(results_dir, exist_ok=True)
    os.makedirs(debug_dir, exist_ok=True)

    extensions = ('.jpg', '.jpeg', '.png', '.webp')
    images = [f for f in os.listdir(target_dir)
              if f.lower().endswith(extensions) and os.path.isfile(os.path.join(target_dir, f))]

    if not images:
        print(f"No images found in {target_dir}")
        sys.exit(1)

    print(f"Processing {len(images)} image(s) from: {target_dir}\n")

    for filename in images:
        input_path = os.path.join(target_dir, filename)
        output_path = os.path.join(results_dir, filename)
        print(f"Processing: {filename}")
        remove_watermark_lama(input_path, output_path, debug_dir)
        print()

    print(f"Done! Results in: {results_dir}")
    print(f"Debug files in: {debug_dir}")
