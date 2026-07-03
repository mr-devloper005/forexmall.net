import Link from 'next/link'
import {
  ArrowRight, BadgeCheck, BriefcaseBusiness, Building2, Check, Clock3, Compass,
  FileText, MapPin, Medal, MessageCircle, Search, ShieldCheck, Sparkles, Star,
  UserRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

const topicChips = [
  'Remote experts',
  'Local services',
  'Project listings',
  'Business profiles',
  'Independent talent',
  'Fast quotes',
  'Commercial support',
  'Specialist vendors',
  'Professional teams',
  'Freelance opportunities',
  'Public offers',
  'Verified details',
]

const stats: Array<[LucideIcon, string, string]> = [
  [Building2, '3000+', 'areas indexed'],
  [BriefcaseBusiness, '30+', 'active categories'],
  [MessageCircle, '19k+', 'monthly enquiries'],
  [Medal, '25+', 'service verticals'],
]

const benefits: Array<[string, string, LucideIcon]> = [
  ['Curated Details', 'Listings are arranged for easy comparison before you make contact.', FileText],
  ['Practical Discovery', 'Search across offers, profiles, and service pages from one polished interface.', Compass],
  ['Contact Ready', 'Open any post to review information and choose the best next step.', Clock3],
]

function contentOf(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
}

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function clean(value: string) {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function excerpt(post?: SitePost | null, limit = 150) {
  const content = contentOf(post)
  const raw = text(content.description) || text(content.summary) || post?.summary || text(content.body) || 'Open this listing for details, availability, and contact options.'
  const value = clean(raw)
  return value.length > limit ? `${value.slice(0, limit).trim()}...` : value
}

function category(post?: SitePost | null, fallback = 'Listing') {
  return text(contentOf(post).category) || post?.tags?.[0] || fallback
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const output: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    output.push(post)
  }
  return output
}

function postPool(posts: SitePost[], timeSections: HomeTimeSection[]) {
  return dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
}

function FeatureCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group grid min-h-[420px] overflow-hidden rounded-[8px] bg-[var(--slot4-dark-bg)] text-white shadow-[0_24px_70px_rgba(8,6,22,0.22)]">
      <div className="relative">
        <img src={getEditablePostImage(post)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,6,22,0.18),rgba(8,6,22,0.88))]" />
        <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
          <span className="w-fit rounded-[6px] bg-white/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white/85">{category(post)}</span>
          <h3 className="editable-display mt-4 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">{post.title}</h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/78">{excerpt(post, 170)}</p>
          <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-[6px] bg-white px-4 py-2.5 text-sm font-bold text-[var(--slot4-dark-bg)]">View details <ArrowRight className="h-4 w-4" /></span>
        </div>
      </div>
    </Link>
  )
}

function ServiceCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const Icon = [Sparkles, ShieldCheck, Compass, BadgeCheck][index % 4]
  return (
    <Link href={href} className="group flex min-h-[300px] flex-col rounded-[8px] border border-[var(--editable-border)] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(8,6,22,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-[8px] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
          <Icon className="h-6 w-6" />
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--slot4-muted-text)]">No. {String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="editable-display mt-5 line-clamp-2 text-2xl font-bold leading-tight text-[var(--slot4-page-text)]">{post.title}</h3>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--slot4-muted-text)]">{excerpt(post, 145)}</p>
      <div className="mt-5 flex items-center justify-between border-t border-[var(--editable-border)] pt-4">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--slot4-accent)]">{category(post)}</span>
        <ArrowRight className="h-4 w-4 text-[var(--slot4-muted-text)] transition group-hover:translate-x-1 group-hover:text-[var(--slot4-accent)]" />
      </div>
    </Link>
  )
}

function ReviewCard({ post, index }: { post: SitePost; index: number }) {
  const names = ['Aarav Mehta', 'Nisha Kapoor', 'Dev Rawat', 'Mira Sen']
  return (
    <article className="rounded-[8px] border border-[var(--editable-border)] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--slot4-accent-fill)] text-sm font-bold text-white">{names[index % names.length][0]}</span>
        <div>
          <h3 className="text-lg font-extrabold text-[var(--slot4-page-text)]">{names[index % names.length]}</h3>
          <p className="text-sm font-semibold text-[var(--slot4-muted-text)]">Verified enquiry</p>
        </div>
      </div>
      <div className="mt-5 inline-flex items-center gap-1 rounded-[6px] bg-[#fff4d5] px-2.5 py-1 text-xs font-extrabold text-[#8a5b00]">
        5 <Star className="h-3 w-3 fill-[#8a5b00]" />
      </div>
      <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{excerpt(post, 165)}</p>
    </article>
  )
}

export function EditableHomeHero({ primaryRoute }: HomeSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f8f9ff_0%,#eef2ff_55%,#ffffff_100%)]">
      <div className={`${container} grid gap-10 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-16`}>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--slot4-accent)] shadow-sm">
            <Sparkles className="h-4 w-4" /> Premium marketplace directory
          </span>
          <h1 className="editable-display mt-6 max-w-4xl text-5xl font-bold leading-[1.02] text-[var(--slot4-page-text)] sm:text-6xl lg:text-7xl">
            Discover skilled freelancers, service listings, and trusted business profiles.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)] sm:text-lg">
            A refined classified and listing experience for comparing public offers, professional profiles, and project-ready services.
          </p>
          <form action="/search" className="mt-7 flex max-w-2xl overflow-hidden rounded-[8px] border border-[var(--editable-border)] bg-white p-1.5 shadow-[0_18px_50px_rgba(8,6,22,0.10)]">
            <div className="flex min-w-0 flex-1 items-center gap-3 px-4">
              <Search className="h-5 w-5 shrink-0 text-[var(--slot4-accent)]" />
              <input name="q" placeholder="Search services, listings, or experts" className="min-w-0 flex-1 bg-transparent py-3 text-sm font-semibold outline-none placeholder:text-[var(--slot4-muted-text)]" />
            </div>
            <button className="rounded-[6px] bg-[var(--slot4-accent-fill)] px-6 text-sm font-extrabold text-white transition hover:bg-[var(--slot4-accent)]">Search</button>
          </form>
        </div>

        <div className="rounded-[8px] border border-white bg-white/72 p-4 shadow-[0_24px_70px_rgba(8,6,22,0.12)]">
          <h2 className="px-2 pb-3 text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--slot4-muted-text)]">Popular searches</h2>
          <div className="flex flex-wrap gap-2.5">
            {topicChips.map((chip) => (
              <Link key={chip} href={primaryRoute} className="rounded-full border border-[var(--editable-border)] bg-white px-4 py-2 text-sm font-bold text-[#233544] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">
                {chip}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const items = postPool(posts, timeSections)
  if (!items.length) return null
  return (
    <section className="bg-white">
      <div className={`${container} py-14`}>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <FeatureCard post={items[0]} href={postHref(primaryTask, items[0], primaryRoute)} />
          <div className="grid gap-4">
            {benefits.map(([title, body, Icon]) => (
              <div key={String(title)} className="rounded-[8px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-5">
                <Icon className="h-7 w-7 text-[var(--slot4-accent)]" />
                <h3 className="editable-display mt-4 text-2xl font-bold text-[var(--slot4-page-text)]">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const items = postPool(posts, timeSections).slice(1, 9)
  if (!items.length) return null
  return (
    <section className="bg-[var(--slot4-panel-bg)]">
      <div className={`${container} py-14`}>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--slot4-accent)]">Featured listings</p>
            <h2 className="editable-display mt-2 text-4xl font-bold text-[var(--slot4-page-text)]">Useful posts, arranged for action.</h2>
          </div>
          <Link href={primaryRoute} className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-extrabold">Browse all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((post, index) => <ServiceCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ posts, timeSections }: HomeSectionProps) {
  const items = postPool(posts, timeSections).slice(0, 4)
  if (!items.length) return null
  return (
    <>
      <section className="bg-white">
        <div className={`${container} py-14`}>
          <h2 className="editable-display text-center text-4xl font-bold text-[var(--slot4-page-text)]">Why people use {SITE_CONFIG.name}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(([Icon, value, label]) => (
              <div key={label} className="rounded-[8px] border border-[var(--editable-border)] bg-white p-6 shadow-sm">
                <Icon className="h-9 w-9 text-[var(--slot4-accent)]" />
                <p className="mt-5 text-3xl font-extrabold text-[var(--slot4-page-text)]">{value}</p>
                <p className="mt-1 text-sm font-bold uppercase tracking-[0.1em] text-[var(--slot4-muted-text)]">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-4">
            {items.map((post, index) => <ReviewCard key={post.id || post.slug} post={post} index={index} />)}
          </div>
        </div>
      </section>
    </>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[var(--slot4-dark-bg)] text-white">
      <div className={`${container} grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start`}>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/55">How it works</p>
          <h2 className="editable-display mt-3 text-4xl font-bold">A calmer way to compare public listings.</h2>
        </div>
        <div className="grid gap-4">
          {[
            ['Search with intent', 'Use keywords, categories, and task pages to narrow the field quickly.'],
            ['Review the essentials', 'Read summaries, check contact details, and compare related posts without clutter.'],
            ['Open the right lead', 'Move from discovery to enquiry once a listing fits your requirement.'],
          ].map(([title, body], index) => (
            <div key={title} className="grid gap-4 rounded-[8px] border border-white/12 bg-white/6 p-5 sm:grid-cols-[52px_1fr]">
              <span className="grid h-12 w-12 place-items-center rounded-[8px] bg-white text-lg font-extrabold text-[var(--slot4-dark-bg)]">{index + 1}</span>
              <div>
                <h3 className="text-lg font-extrabold">{title}</h3>
                <p className="mt-1 text-sm leading-7 text-white/68">{body}</p>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/search" className="rounded-[6px] bg-white px-5 py-3 text-sm font-extrabold text-[var(--slot4-dark-bg)]">Start searching</Link>
            <Link href="/contact" className="rounded-[6px] border border-white/20 px-5 py-3 text-sm font-extrabold text-white">Contact us</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
