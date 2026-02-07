import Link from "next/link";
import { MainAdSpaces } from "../components/AdvertisingSpaces";
import { API_BASE } from "../lib/api";

type Service = {
  id: string;
  title: string;
  description: string;
  basePrice: string;
  durationMinutes: number;
  mainImageUrl?: string | null;
};

export default async function Page() {
  const qs = new URLSearchParams({ page: "1", pageSize: "50", sort: "updated" });
  let services: Service[] = [];
  try {
    const res = await fetch(`${API_BASE}/services?${qs.toString()}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      services = (data.items ?? []) as Service[];
    }
  } catch {
    services = [];
  }
  const serviceSlots = Array.from({ length: 50 }, (_, index) => services[index] ?? null);

  return (
    <div className="space-y-20">
      {/* SECTION: ADVERTISING SPACES */}
      <section className="space-y-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-xs tracking-luxe text-brand-muted">ADVERTISING SPACES</div>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">Main homepage placements</h2>
          </div>
          <Link className="hidden text-xs tracking-[0.22em] text-brand-muted hover:text-brand-text md:block" href="/services">
            VIEW ALL →
          </Link>
        </div>

        <MainAdSpaces />

        <div className="md:hidden">
          <Link className="text-xs tracking-[0.22em] text-brand-muted hover:text-brand-text" href="/services">
            VIEW ALL →
          </Link>
        </div>
      </section>

      {/* SECTION: SERVICES PLACEHOLDERS */}
      <section className="space-y-6">
        <div>
          <div className="text-xs tracking-luxe text-brand-muted">SERVICES</div>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">Latest service updates</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <select className="rounded-full border border-brand-line bg-brand-bg/70 px-4 py-2 text-xs tracking-[0.22em] text-brand-muted">
            <option>LOCATION</option>
            <option>Ubud</option>
            <option>Canggu</option>
            <option>Seminyak</option>
          </select>
          <select className="rounded-full border border-brand-line bg-brand-bg/70 px-4 py-2 text-xs tracking-[0.22em] text-brand-muted">
            <option>PRICE</option>
            <option>Under $50</option>
            <option>$50 - $150</option>
            <option>$150+</option>
          </select>
          <select className="rounded-full border border-brand-line bg-brand-bg/70 px-4 py-2 text-xs tracking-[0.22em] text-brand-muted">
            <option>CATEGORY</option>
            <option>Wellness</option>
            <option>Experiences</option>
            <option>Hospitality</option>
          </select>
          <select className="rounded-full border border-brand-line bg-brand-bg/70 px-4 py-2 text-xs tracking-[0.22em] text-brand-muted">
            <option>AVAILABILITY</option>
            <option>Today</option>
            <option>This Week</option>
            <option>Flexible</option>
          </select>
          <select className="rounded-full border border-brand-line bg-brand-bg/70 px-4 py-2 text-xs tracking-[0.22em] text-brand-muted">
            <option>SORT</option>
            <option>Featured</option>
            <option>Top Rated</option>
            <option>Newest</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {serviceSlots.map((service, index) => {
            if (!service) {
              return (
                <div
                  key={`placeholder-${index}`}
                  className="rounded-2xl border border-brand-line bg-brand-surface/40 p-5"
                >
                  <div className="text-[10px] tracking-[0.22em] text-brand-muted">SERVICE SLOT {index + 1}</div>
                  <div className="mt-4 h-24 rounded-xl bg-black/30" />
                  <div className="mt-4 text-sm text-brand-muted">Awaiting creator submission.</div>
                </div>
              );
            }

            const cardBody = (
              <>
                <div className="relative h-40">
                  <img
                    src={service.mainImageUrl || "/placeholders/card-2.jpg"}
                    alt={service.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                </div>
                <div className="p-5">
                  <div className="text-[10px] tracking-[0.22em] text-brand-muted">
                    {service.durationMinutes} MIN • {service.basePrice}
                  </div>
                  <div className="mt-3 font-display text-lg leading-snug group-hover:text-white">{service.title}</div>
                  <div className="mt-2 line-clamp-2 text-sm text-brand-muted">{service.description}</div>
                </div>
              </>
            );

            if (index === 0) {
              return (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="group overflow-hidden rounded-2xl border border-brand-line bg-brand-surface/50"
                >
                  {cardBody}
                </Link>
              );
            }

            return (
              <div key={service.id} className="group overflow-hidden rounded-2xl border border-brand-line bg-brand-surface/50">
                {cardBody}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA BAND */}
      <section className="relative overflow-hidden rounded-3xl border border-brand-gold/60 bg-brand-surface/50 p-10 md:p-14">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/10 via-transparent to-transparent" />
        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="text-xs tracking-luxe text-brand-muted">READY TO CUSTOMIZE</div>
            <div className="mt-3 font-display text-3xl md:text-4xl">Swap imagery. Keep the mood.</div>
            <div className="mt-4 max-w-2xl text-sm leading-7 text-brand-muted">
              Drop in licensed photography and adjust brand tokens in one place. The layout system stays stable.
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              className="rounded-full bg-brand-gold px-7 py-3 text-xs font-semibold tracking-[0.22em] text-black hover:bg-brand-gold2"
              href="/provider"
            >
              PROVIDER PANEL
            </Link>
            <Link
              className="rounded-full border border-brand-line px-7 py-3 text-xs font-semibold tracking-[0.22em] text-brand-text hover:border-brand-gold/70 hover:text-white"
              href="/dashboard"
            >
              DASHBOARD
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
