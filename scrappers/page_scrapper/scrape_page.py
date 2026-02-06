import json
import re
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
import os
import time
from collections import deque
from urllib.parse import urlparse, urljoin
from selenium_stealth import stealth

# Path to the JSON file containing the URL
PAGE_FILE = 'page.json'
# Output markdown file for the scraped content
OUTPUT_MARKDOWN_FILE = 'page_output.md' # Changed to page_output.md

def get_domain(url):
    """Extracts the domain from a URL."""
    return urlparse(url).netloc

def scrape_single_page():
    """
    Scrapes a single page specified in page.json for all its content
    (text, images, links) and saves it to a markdown file.
    """
    try:
        with open(PAGE_FILE, 'r') as f:
            page_data = json.load(f)
            url_to_scrape = page_data.get('url')
    except FileNotFoundError:
        print(f"Error: '{PAGE_FILE}' not found.")
        return
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from '{PAGE_FILE}'.")
        return

    if not url_to_scrape:
        print(f"Error: No 'url' found in '{PAGE_FILE}'.")
        return

    print(f"Starting scraping for single page: {url_to_scrape}")

    # Setup selenium webdriver
    driver = None
    try:
        # Use the manually downloaded chromedriver
        driver_path = "/Users/rogerwoolie/.gemini/tmp/942ba8aa2026708f4d8a55a6331dad0681fd0a07b97bade147f2009aefea09dc/chromedriver-mac-x64/chromedriver"
        options = uc.ChromeOptions()
        options.add_argument('--disable-blink-features=AutomationControlled')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        
        driver = uc.Chrome(driver_executable_path=driver_path, headless=True, use_subprocess=False, options=options)
        
        # Apply selenium-stealth
        stealth(driver,
                languages=["en-US", "en"],
                vendor="Google Inc.",
                platform="Win32",
                webgl_vendor="Intel Inc.",
                renderer="Intel Iris OpenGL Engine",
                fix_hairline=True,
                )

        driver.get(url_to_scrape)
        time.sleep(10) # Give some time for the page to load and JS to execute

        # Handle the age verification popup
        try:
            enter_button = driver.find_element(By.LINK_TEXT, "ENTER")
            enter_button.click()
            time.sleep(5) # Wait for the page to load after clicking enter
        except Exception as e:
            print(f"Could not find or click 'ENTER' button: {e}")

        # Click on the "SHOW PHONE" button to reveal the number
        try:
            show_phone_button = driver.find_element(By.PARTIAL_LINK_TEXT, "SHOW PHONE")
            driver.execute_script("arguments[0].click();", show_phone_button)
            time.sleep(2) # Wait for the number to load
        except Exception as e:
            print(f"Could not find or click 'SHOW PHONE' button: {e}")


        with open(OUTPUT_MARKDOWN_FILE, 'w', encoding='utf-8') as f:
            f.write(f"Scraped Content from: {url_to_scrape}  \n")
            
            # Extract ID from URL
            id_match = re.search(r'/(\d+)/', url_to_scrape)
            if id_match:
                f.write(f"ID: {id_match.group(1)}  \n")

            f.write(f"Title: {driver.title}  \n")

            # Extract all visible text
            main_content = ""
            try:
                # Get the text content of the body, excluding script and style elements
                main_content = driver.find_element(By.TAG_NAME, 'body').text
            except Exception as e:
                print(f"Could not extract visible text: {e}")

            # Extract phone numbers from the visible text
            try:
                phone_regex = r'(?:\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4,}'
                phone_numbers = re.findall(phone_regex, main_content)
                if phone_numbers:
                    for number in phone_numbers:
                        f.write(f"Phone Number: {number}  \n")
                else:
                    f.write("Phone Number: Not found  \n")
            except Exception as e:
                f.write(f"Could not extract phone numbers: {e}  \n")

            if main_content:
                try:
                    start_index = main_content.find("Last seen")
                    end_index = main_content.find("CONTACT THIS ESCORT")
                    if start_index != -1 and end_index != -1:
                        visible_text = main_content[start_index:end_index]
                        
                        # Join key-value pairs on the same line
                        formatted_text = re.sub(r':\n', r': ', visible_text)
                        
                        # Add markdown line breaks
                        lines_with_breaks = [line + "  " for line in formatted_text.split('\n')]
                        final_text = '\n'.join(lines_with_breaks)
                        f.write(final_text)
                    else:
                        f.write("Could not find the specified text range.  \n")
                except Exception as e:
                    f.write(f"Error processing visible text: {e}  \n")
            else:
                f.write("Could not extract visible text.  \n")
            f.write('\n\n')

            # Extract images
            f.write("## Images\n")
            images = driver.find_elements(By.TAG_NAME, 'img')
            if images:
                for img in images:
                    src = img.get_attribute('src')
                    if src:
                        f.write(f"- {src}\n")
            else:
                f.write("No images found.\n")
            f.write('\n')

    except Exception as e:
        print(f"An error occurred during scraping: {e}")
    finally:
        if driver:
            driver.quit()
        print(f"Scraping finished. Content saved in {OUTPUT_MARKDOWN_FILE}")

if __name__ == '__main__':
    scrape_single_page()
