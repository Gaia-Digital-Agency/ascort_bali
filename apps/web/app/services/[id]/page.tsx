import { API_BASE } from "../../../lib/api";
import { BuyButton } from "../../../components/BuyButton";
import { FavoriteButton } from "../../../components/FavoriteButton";

export default async function ServiceDetail({ params }: { params: { id: string } }) {
  const res = await fetch(`${API_BASE}/services/${params.id}`, { cache: "no-store" });
  const s = await res.json();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-brand-line bg-brand-surface/55 p-8 shadow-luxe">
        <div className="text-xs tracking-luxe text-brand-muted">
          {s.durationMinutes} MIN • {s.basePrice}
        </div>

        <h1 className="mt-3 font-display text-4xl leading-[1.05]">{s.title}</h1>

        <div className="mt-5 h-px w-14 bg-brand-gold/70" />

        <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-brand-muted md:text-base">
          {s.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <BuyButton serviceId={s.id} />
          <FavoriteButton serviceId={s.id} />
        </div>
      </section>
    </div>
  );
}
