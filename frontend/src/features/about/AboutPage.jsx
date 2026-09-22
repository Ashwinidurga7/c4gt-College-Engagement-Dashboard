import { ArrowLeft, ArrowRight, Award, BookOpen, Building2, ExternalLink, Eye, GraduationCap, Landmark, MapPin, Sparkles, Target } from 'lucide-react'
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
    <section aria-labelledby="about-title" className="relative isolate overflow-hidden rounded-2xl border">
      <img src="/about/hero.jpg" alt="" className="absolute inset-0 -z-10 size-full object-cover" />
      {/* Darkens the photo so the headline reads in both themes. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/55" />
      <div className="flex flex-col gap-5 px-6 py-14 text-white sm:px-10 sm:py-20 lg:py-24">
        <p className="text-sm font-semibold tracking-widest uppercase opacity-90">About the college</p>
        <h1 id="about-title" className="max-w-2xl text-3xl leading-tight font-bold text-white sm:text-5xl">
          {BRAND_NAME}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed opacity-95 sm:text-lg">Building future leaders in Kakinada since 2001.</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild size="lg">
            <Link to={back.to}>
              <ArrowLeft data-icon="inline-start" aria-hidden /> {back.label}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/70 bg-transparent text-white hover:bg-white/15 hover:text-white">
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
    <ul aria-label="At a glance" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {HIGHLIGHTS.map((item) => (
        <li key={item.label} className="bg-card shadow-soft rounded-xl border p-5 text-center">
          <p className="text-heading text-3xl font-bold">{item.value}</p>
          <p className="text-muted-foreground mt-1 text-sm">{item.label}</p>
        </li>
      ))}
    </ul>
  )
}

function FacilityCard({ facility }) {
  const [broken, setBroken] = useState(false)

  return (
    <li className="bg-card shadow-soft flex flex-col overflow-hidden rounded-xl border">
      {broken ? (
        <div aria-hidden className="bg-sunken text-muted-foreground flex aspect-video items-center justify-center">
          <Building2 className="size-10" strokeWidth={1.5} />
        </div>
      ) : (
        <img src={facility.image} alt="" loading="lazy" decoding="async" onError={() => setBroken(true)} style={{ objectPosition: facility.position }} className="aspect-video w-full object-cover" />
      )}
      <div className="p-5">
        <h3 className="text-heading font-semibold">{facility.title}</h3>
        <p className="text-body mt-1.5 text-sm leading-relaxed">{facility.detail}</p>
      </div>
    </li>
  )
}

/** Public overview of the college, linked from the login page and open whether or not you are signed in. */
export function AboutPage() {
  useDocumentTitle('About the college')
  const { status } = useAuth()

  return (
    <div className="bg-canvas flex min-h-dvh flex-col">
      <AuthHeader />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-10">
        <Hero />
        <Highlights />

        <SectionCard title="Who we are" icon={Landmark}>
          <div className="flex flex-col gap-3">
            {OVERVIEW.map((paragraph) => (
              <p key={paragraph} className="text-body leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          <p className="text-muted-foreground mt-4 text-sm">{AFFILIATION}</p>
        </SectionCard>

        <div className="grid gap-6 md:grid-cols-2">
          <SectionCard title="Vision" icon={Eye}>
            <p className="text-body leading-relaxed">{VISION}</p>
          </SectionCard>
          <SectionCard title="Mission" icon={Target}>
            <p className="text-body leading-relaxed">{MISSION}</p>
          </SectionCard>
        </div>

        <SectionCard title="Core values" icon={Sparkles}>
          <ul className="flex flex-wrap gap-2">
            {VALUES.map((value) => (
              <li key={value} className="bg-tone-blue text-tone-blue-fg rounded-full px-3 py-1 text-sm font-semibold">
                {value}
              </li>
            ))}
          </ul>
        </SectionCard>

        <section aria-labelledby="colleges-title" className="flex flex-col gap-4">
          <h2 id="colleges-title" className="text-heading flex items-center gap-2 text-xl font-bold">
            <Building2 className="text-brand size-5" aria-hidden /> Our colleges
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {COLLEGES.map((college) => (
              <li key={college.code} className="bg-card shadow-soft rounded-xl border p-5">
                <p className="text-brand text-sm font-bold tracking-wide">{college.code}</p>
                <h3 className="text-heading mt-1 font-semibold">{college.name}</h3>
                <p className="text-muted-foreground mt-1.5 text-sm">{college.note}</p>
              </li>
            ))}
          </ul>
        </section>

        <SectionCard title="Academic programmes" description="More than 40 courses across the group" icon={GraduationCap}>
          <ul className="grid gap-4 sm:grid-cols-2">
            {PROGRAMMES.map((programme) => (
              <li key={programme.name} className="flex gap-3">
                <span className="bg-tone-blue text-tone-blue-fg flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <BookOpen className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-heading font-semibold">
                    {programme.name} <span className="text-muted-foreground text-xs font-medium">· {programme.level}</span>
                  </p>
                  <p className="text-body mt-0.5 text-sm leading-relaxed">{programme.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <section aria-labelledby="facilities-title" className="flex flex-col gap-4">
          <h2 id="facilities-title" className="text-heading flex items-center gap-2 text-xl font-bold">
            <MapPin className="text-brand size-5" aria-hidden /> Campus and facilities
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {FACILITIES.map((facility) => (
              <FacilityCard key={facility.key} facility={facility} />
            ))}
          </ul>
        </section>

        <SectionCard title="Achievements" icon={Award}>
          <ul className="grid gap-5 md:grid-cols-3">
            {ACHIEVEMENTS.map((item) => (
              <li key={item.title}>
                <h3 className="text-heading font-semibold">{item.title}</h3>
                <p className="text-body mt-1 text-sm leading-relaxed">{item.detail}</p>
              </li>
            ))}
          </ul>
        </SectionCard>

        <section className="bg-card shadow-soft flex flex-col gap-4 rounded-xl border p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <MapPin className="text-brand mt-0.5 size-5 shrink-0" aria-hidden />
            <div>
              <h2 className="text-heading font-semibold">Visit us</h2>
              <p className="text-body text-sm">{ADDRESS}</p>
            </div>
          </div>
          {status !== 'authenticated' && (
            <Button asChild size="lg">
              <Link to="/login">
                Sign in to the portal <ArrowRight data-icon="inline-end" aria-hidden />
              </Link>
            </Button>
          )}
        </section>
      </main>

      <AuthFooter />
    </div>
  )
}
