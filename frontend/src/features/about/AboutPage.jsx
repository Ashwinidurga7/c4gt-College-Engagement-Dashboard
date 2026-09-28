import { ArrowLeft, ArrowRight, Award, BookOpen, Building2, ExternalLink, Eye, GraduationCap, Handshake, Landmark, MapPin, Sparkles, Target } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionCard } from '@/components/common/SectionCard'
import { Button } from '@/components/ui/button'
import { AuthFooter, AuthHeader } from '@/features/auth/AuthLayout'
import {
  ABOUT_WEBSITE,
  ACHIEVEMENTS,
  ADDRESS,
  AFFILIATION,
  COLLEGES,
  FACILITIES,
  HIGHLIGHTS,
  MISSION,
  OVERVIEW,
  PARTNERS,
  PROGRAMMES,
  VALUES,
  VISION,
} from '@/features/about/aboutContent'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { BRAND_NAME } from '@/lib/brand'
import { dashboardPath } from '@/lib/roles'

/** Signed-out visitors go back to sign in; signed-in users go back to their dashboard. */
function useReturnLink() {
  const { status, user } = useAuth()
  return status === 'authenticated' ? { to: dashboardPath(user.role), label: 'Back to dashboard' } : { to: '/login', label: 'Back to sign in' }
}

function Hero() {
  const back = useReturnLink()

  return (
    <section aria-labelledby="about-title" className="glass-panel glass-card-brand glass-sheen relative isolate overflow-hidden rounded-3xl shadow-2xl">
      <img src="/about/hero.jpg" alt="" className="absolute inset-0 -z-10 size-full object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
      
      {/* Decorative glass glow elements */}
      <div className="pointer-events-none absolute -top-20 -right-20 size-80 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="font-dareva flex flex-col gap-6 px-6 py-14 text-white sm:px-12 sm:py-20 lg:py-24">
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-white uppercase backdrop-blur-md shadow-sm">
          <Sparkles className="size-3.5 text-sky-400" aria-hidden /> About the College
        </div>
        
        <h1 id="about-title" className="font-dareva max-w-3xl text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          {BRAND_NAME}
        </h1>
        
        <p className="font-dareva max-w-2xl text-lg leading-relaxed text-slate-200/90 sm:text-xl">
          Building future leaders, empowering innovators, and pioneering excellence in Kakinada since 2001.
        </p>

        <div className="flex flex-wrap gap-4 pt-4">
          <Button asChild size="lg" className="rounded-xl shadow-lg transition-transform hover:scale-105">
            <Link to={back.to}>
              <ArrowLeft data-icon="inline-start" aria-hidden /> {back.label}
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="glass-chip rounded-xl border-white/40 bg-white/10 text-white shadow-md hover:bg-white/25 hover:text-white hover:scale-105"
          >
            <a href={ABOUT_WEBSITE} target="_blank" rel="noopener noreferrer">
              Official website <ExternalLink data-icon="inline-end" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

function Highlights() {
  return (
    <ul aria-label="At a glance" className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {HIGHLIGHTS.map((item) => (
        <li key={item.label} className="glass-card-interactive glass-glow-subtle glass-sheen flex flex-col items-center justify-center rounded-2xl p-6 text-center">
          <p className="font-dareva text-primary text-4xl font-extrabold tracking-tight sm:text-5xl">{item.value}</p>
          <p className="font-dareva text-muted-foreground mt-2 text-sm font-medium">{item.label}</p>
        </li>
      ))}
    </ul>
  )
}

function FacilityCard({ facility }) {
  const [broken, setBroken] = useState(false)

  return (
    <li className="glass-card-interactive glass-glow-subtle group flex flex-col overflow-hidden rounded-2xl">
      <div className="relative aspect-video w-full overflow-hidden">
        {broken ? (
          <div aria-hidden className="bg-sunken text-muted-foreground flex size-full items-center justify-center">
            <Building2 className="size-12" strokeWidth={1.5} />
          </div>
        ) : (
          <img
            src={facility.image}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            style={{ objectPosition: facility.position }}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-108"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-6">
        <h3 className="font-dareva text-heading text-lg font-bold">{facility.title}</h3>
        <p className="font-dareva text-body mt-2 text-sm leading-relaxed">{facility.detail}</p>
      </div>
    </li>
  )
}

function PartnerCard({ partner }) {
  const [broken, setBroken] = useState(false)

  return (
    <li>
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        className="glass-card-interactive glass-glow-subtle glass-sheen focus-visible:ring-ring flex h-full flex-col rounded-2xl p-6 focus-visible:ring-2 focus-visible:outline-none"
      >
        {/* Logos sit on a clean frosted glass chip */}
        <span className="glass-chip bg-white/90 dark:bg-slate-900/90 flex h-28 items-center justify-center rounded-xl p-3 shadow-inner">
          {broken ? (
            <span className="font-dareva text-heading text-lg font-bold">{partner.name}</span>
          ) : (
            <img src={partner.logo} alt={`${partner.name} logo`} loading="lazy" decoding="async" onError={() => setBroken(true)} className="max-h-full max-w-full object-contain" />
          )}
        </span>
        <span className="font-dareva text-brand mt-4 text-xs font-extrabold tracking-wider uppercase">{partner.role}</span>
        <span className="font-dareva text-heading mt-1.5 inline-flex items-center gap-2 font-bold">
          {partner.name} <ExternalLink className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
        <span className="font-dareva text-body mt-2 text-sm leading-relaxed">{partner.detail}</span>
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </li>
  )
}

/** Public overview of the college, linked from the login page and open whether or not you are signed in. */
export function AboutPage() {
  useDocumentTitle('About the college')
  const { status } = useAuth()

  return (
    <div className="bg-canvas font-dareva relative flex min-h-dvh flex-col overflow-x-hidden">
      {/* Ambient background glowing gradient blobs and floating specular spheres */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="animate-ambient-1 absolute -top-32 -left-20 size-[550px] rounded-full bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-sky-400/10 blur-3xl dark:from-blue-600/30 dark:via-indigo-800/25" />
        <div className="animate-ambient-2 absolute top-1/3 -right-24 size-[600px] rounded-full bg-gradient-to-br from-indigo-500/18 via-sky-500/15 to-blue-600/10 blur-3xl dark:from-indigo-700/25 dark:via-blue-600/20" />
        <div className="animate-ambient-1 absolute -bottom-32 left-1/3 size-[500px] rounded-full bg-gradient-to-tl from-sky-500/18 via-indigo-500/15 to-blue-700/10 blur-3xl dark:from-sky-600/25 dark:via-indigo-900/20" />
        
        <div className="animate-bubble-1 absolute top-24 left-1/5 size-20 rounded-full border border-white/40 bg-white/10 backdrop-blur-md shadow-lg dark:border-white/20 dark:bg-white/5" />
        <div className="animate-bubble-2 absolute top-1/2 right-16 size-28 rounded-full border border-white/40 bg-white/15 backdrop-blur-md shadow-xl dark:border-white/20 dark:bg-white/5" />
      </div>

      <AuthHeader />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-8 sm:px-10">
        <Hero />
        <Highlights />

        <SectionCard title="Who we are" icon={Landmark} className="glass-glow-subtle rounded-3xl p-2">
          <div className="flex flex-col gap-4 text-base leading-relaxed">
            {OVERVIEW.map((paragraph) => (
              <p key={paragraph} className="font-dareva text-body">
                {paragraph}
              </p>
            ))}
          </div>
          <p className="font-dareva text-muted-foreground mt-5 border-t border-border/40 pt-4 text-sm font-medium">{AFFILIATION}</p>
        </SectionCard>

        <section aria-labelledby="partners-title" className="flex flex-col gap-5">
          <h2 id="partners-title" className="font-dareva text-heading flex items-center gap-2.5 text-2xl font-bold">
            <Handshake className="text-brand size-6" aria-hidden /> Affiliations & Strategic Partners
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PARTNERS.map((partner) => (
              <PartnerCard key={partner.key} partner={partner} />
            ))}
          </ul>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <SectionCard title="Vision" icon={Eye} className="glass-glow-subtle rounded-3xl">
            <p className="font-dareva text-body text-base leading-relaxed">{VISION}</p>
          </SectionCard>
          <SectionCard title="Mission" icon={Target} className="glass-glow-subtle rounded-3xl">
            <p className="font-dareva text-body text-base leading-relaxed">{MISSION}</p>
          </SectionCard>
        </div>

        <SectionCard title="Core values" icon={Sparkles} className="glass-glow-subtle rounded-3xl">
          <ul className="flex flex-wrap gap-3">
            {VALUES.map((value) => (
              <li key={value} className="glass-chip bg-tone-blue/90 text-tone-blue-fg rounded-xl px-4 py-2 text-sm font-bold shadow-sm">
                {value}
              </li>
            ))}
          </ul>
        </SectionCard>

        <section aria-labelledby="colleges-title" className="flex flex-col gap-5">
          <h2 id="colleges-title" className="font-dareva text-heading flex items-center gap-2.5 text-2xl font-bold">
            <Building2 className="text-brand size-6" aria-hidden /> Our Constituent Colleges
          </h2>
          <ul className="grid gap-6 md:grid-cols-3">
            {COLLEGES.map((college) => (
              <li key={college.code} className="glass-card-interactive glass-glow-subtle glass-sheen flex flex-col rounded-2xl p-6">
                <span className="glass-chip bg-primary/10 text-brand inline-flex self-start rounded-lg px-3 py-1 text-xs font-extrabold tracking-wider uppercase">
                  {college.code}
                </span>
                <h3 className="font-dareva text-heading mt-3 text-lg font-bold">{college.name}</h3>
                <p className="font-dareva text-muted-foreground mt-2 text-sm leading-relaxed">{college.note}</p>
              </li>
            ))}
          </ul>
        </section>

        <SectionCard title="Academic programmes" description="More than 40 accredited courses across the group" icon={GraduationCap} className="glass-glow-subtle rounded-3xl">
          <ul className="grid gap-6 sm:grid-cols-2">
            {PROGRAMMES.map((programme) => (
              <li key={programme.name} className="glass-chip flex gap-4 rounded-2xl p-4 shadow-sm">
                <span className="glass-chip bg-primary/15 text-primary flex size-12 shrink-0 items-center justify-center rounded-xl shadow-sm">
                  <BookOpen className="size-6" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="font-dareva text-heading font-bold">
                    {programme.name} <span className="font-dareva text-muted-foreground text-xs font-semibold">· {programme.level}</span>
                  </p>
                  <p className="font-dareva text-body mt-1 text-sm leading-relaxed">{programme.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <section aria-labelledby="facilities-title" className="flex flex-col gap-5">
          <h2 id="facilities-title" className="font-dareva text-heading flex items-center gap-2.5 text-2xl font-bold">
            <MapPin className="text-brand size-6" aria-hidden /> Campus & Infrastructure Facilities
          </h2>
          <ul className="grid gap-6 md:grid-cols-3">
            {FACILITIES.map((facility) => (
              <FacilityCard key={facility.key} facility={facility} />
            ))}
          </ul>
        </section>

        <SectionCard title="Key Achievements" icon={Award} className="glass-glow-subtle rounded-3xl">
          <ul className="grid gap-6 md:grid-cols-3">
            {ACHIEVEMENTS.map((item) => (
              <li key={item.title} className="glass-chip rounded-2xl p-5">
                <h3 className="font-dareva text-heading text-base font-bold">{item.title}</h3>
                <p className="font-dareva text-body mt-2 text-sm leading-relaxed">{item.detail}</p>
              </li>
            ))}
          </ul>
        </SectionCard>

        <section className="glass-panel glass-card-brand glass-sheen flex flex-col gap-6 rounded-3xl p-8 sm:flex-row sm:items-center sm:justify-between shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="glass-chip bg-primary/15 text-primary flex size-12 shrink-0 items-center justify-center rounded-2xl">
              <MapPin className="size-6" aria-hidden />
            </div>
            <div>
              <h2 className="font-dareva text-heading text-xl font-bold">Visit Campus</h2>
              <p className="font-dareva text-body mt-1 text-sm leading-relaxed sm:text-base">{ADDRESS}</p>
            </div>
          </div>
          {status !== 'authenticated' && (
            <Button asChild size="lg" className="rounded-xl shadow-lg transition-transform hover:scale-105">
              <Link to="/login">
                Sign in to Campus Connect <ArrowRight data-icon="inline-end" aria-hidden />
              </Link>
            </Button>
          )}
        </section>
      </main>

      <AuthFooter />
    </div>
  )
}
