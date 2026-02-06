import Link from "next/link";
import { HeroAdCards, MainAdSpaces } from "../components/AdvertisingSpaces";

export default function Page() {
  const servicePlaceholders = Array.from({ length: 50 }, (_, index) => index + 1);

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

      {/* SECTION: HERO AD SPACES */}
      <section className="rounded-3xl border border-brand-line bg-brand-surface/50 p-8 md:p-12">
        <HeroAdCards />
      </section>

      {/* SECTION: SERVICES PLACEHOLDERS */}
      <section className="space-y-6">
        <div>
          <div className="text-xs tracking-luxe text-brand-muted">SERVICES</div>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">50 service cards (placeholder)</h2>
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
          {servicePlaceholders.map((index) => (
            <div key={index} className="rounded-2xl border border-brand-line bg-brand-surface/50 p-6">
              <div className="text-[10px] tracking-[0.22em] text-brand-muted">SERVICE {index}</div>
              <div className="mt-4 h-24 rounded-xl bg-black/30" />
              <div className="mt-4 text-sm text-brand-muted">Creator details will appear here.</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: TESTIMONIALS */}
      <section className="grid gap-5 md:grid-cols-3">
        <Testimonial
          quote="Everything feels premium without being heavy. The structure is exactly what we needed."
          author="Operations Lead"
        />
        <Testimonial
          quote="The dark editorial tokens are consistent across pages — easy to extend and brand."
          author="Product Designer"
        />
        <Testimonial
          quote="JWT sessions + RBAC + analytics built-in saved days of setup."
          author="Developer"
        />
      </section>

      {/* CTA BAND */}
      <section className="relative overflow-hidden rounded-3xl border border-brand-line bg-brand-surface/50 p-10 md:p-14">
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

function Testimonial({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="rounded-3xl border border-brand-line bg-brand-surface/50 p-7">
      <div className="font-display text-3xl text-brand-gold/80">“</div>
      <div className="mt-2 text-sm leading-7 text-brand-text">{quote}</div>
      <div className="mt-6 text-xs tracking-[0.22em] text-brand-muted">{author}</div>
    </div>
  );
}
