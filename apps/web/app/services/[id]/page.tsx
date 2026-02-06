import { API_BASE } from "../../../lib/api";
import { BuyButton } from "../../../components/BuyButton";
import { FavoriteButton } from "../../../components/FavoriteButton";

export default async function ServiceDetail({ params }: { params: { id: string } }) {
  const res = await fetch(`${API_BASE}/services/${params.id}`, { cache: "no-store" });
  const s = await res.json();
  const galleryImages = Array.isArray(s.galleryImages) ? s.galleryImages : [];
  const thumbnailImages = [
    galleryImages[0] || "/placeholders/card-2.jpg",
    galleryImages[1] || "/placeholders/card-3.jpg",
    galleryImages[2] || "/placeholders/hero-1.jpg",
    galleryImages[3] || "/placeholders/card-2.jpg",
  ];

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <div className="relative h-[420px] overflow-hidden rounded-3xl border border-brand-line">
            <img
              src={s.mainImageUrl || "/placeholders/hero-1.jpg"}
              alt={s.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {thumbnailImages.map((image, index) => (
              <div key={index} className="relative h-32 overflow-hidden rounded-2xl border border-brand-line">
                <img src={image} alt={`${s.title} ${index + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-brand-line bg-brand-surface/55 p-8 shadow-luxe">
          <div className="text-xs tracking-luxe text-brand-muted">
            {s.durationMinutes} MIN • {s.basePrice}
          </div>

          <h1 className="mt-3 font-display text-4xl leading-[1.05]">{s.title}</h1>

          <div className="mt-5 h-px w-14 bg-brand-gold/70" />

          <div className="mt-6 space-y-4 text-sm text-brand-muted">
            <div>
              <div className="text-xs tracking-[0.22em]">CREATOR</div>
              <div className="mt-2 text-base text-brand-text">
                {s.creator?.providerProfile?.displayName || s.creator?.email}
              </div>
              <div className="mt-1">
                {[s.creator?.providerProfile?.city, s.creator?.providerProfile?.country].filter(Boolean).join(", ")}
              </div>
            </div>

            <div>
              <div className="text-xs tracking-[0.22em]">CATEGORY</div>
              <div className="mt-2 text-base text-brand-text">{s.category?.name || "Uncategorized"}</div>
            </div>
          </div>

          <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-brand-muted md:text-base">
            {s.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <BuyButton serviceId={s.id} />
            <FavoriteButton serviceId={s.id} />
          </div>
        </div>
      </section>
    </div>
  );
}
