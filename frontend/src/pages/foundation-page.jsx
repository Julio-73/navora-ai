import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'
import {
  Activity,
  ArrowRight,
  AudioLines,
  Bot,
  Camera,
  Map,
  Mic,
  Paperclip,
  Radio,
  Send,
} from 'lucide-react'

import {
  accessibilityTrend,
  chatMessages,
  routeQuality,
  suggestedPrompts,
  tourismZones,
} from '@/features/demo/demo-data'
import { useDemoRealtime } from '@/features/demo/use-demo-realtime'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { cn } from '@/lib/utils'

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
}

export function FoundationPage() {
  const demo = useDemoRealtime()

  return (
    <div className="bg-background">
      <HeroSection liveStage={demo.liveStage} tick={demo.tick} />
      <ChatSection liveStage={demo.liveStage} />
      <AnalyticsSection kpis={demo.kpis} />
      <OperationsSection feed={demo.feed} liveStage={demo.liveStage} />
    </div>
  )
}

function HeroSection({ liveStage, tick }) {
  return (
    <section
      id="platform"
      className="premium-grid relative min-h-[calc(100vh-4rem)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(45,212,191,0.22),transparent_30%),radial-gradient(circle_at_86%_72%,rgba(167,139,250,0.18),transparent_30%),linear-gradient(180deg,rgba(7,10,20,0),hsl(var(--background))_92%)]" />

      <div className="container relative grid min-h-[calc(100vh-4rem)] items-center gap-12 py-16 lg:grid-cols-[1.03fr_0.97fr]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <Badge className="text-primary">
            <span className="mr-2 h-2 w-2 rounded-full bg-primary live-pulse" />
            Live demo mode active
          </Badge>
          <h1 className="text-balance mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] text-foreground sm:text-6xl lg:text-7xl">
            Accessibility intelligence for Peru tourism operations.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Rimay AI simulates how a tourist report becomes an AI incident,
            a map hotspot, a dashboard signal and an operational response.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <a href="#ai-chat">
                Watch demo flow
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="#analytics">Open analytics</a>
            </Button>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {[
              ['Tourism zones', '5 monitored'],
              ['AI reports', `${42 + tick} today`],
              ['Live status', 'Simulated'],
            ].map(([label, value]) => (
              <motion.div
                key={label}
                whileHover={{ y: -3 }}
                className="glass-panel rounded-lg px-4 py-3"
              >
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 text-sm font-semibold">{value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.7, ease: 'easeOut' }}
          className="glass-panel rounded-lg p-4"
        >
          <div className="rounded-md border border-white/10 bg-[#090d16] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Peru accessibility map</p>
                <p className="text-xs text-muted-foreground">
                  Miraflores, Barranco, Cusco and Machu Picchu
                </p>
              </div>
              <Badge className="border-primary/20 bg-primary/10 text-primary">
                <Radio className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                Live pulse
              </Badge>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_0.76fr]">
              <LeafletDemoMap liveStage={liveStage} />

              <div className="grid gap-3">
                {tourismZones.slice(0, 3).map((zone, index) => (
                  <InsightCard
                    key={zone.name}
                    title={zone.name}
                    value={`${zone.score}% ${zone.status}`}
                    icon={index === liveStage % 3 ? Activity : Map}
                    active={index === liveStage % 3}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ChatSection({ liveStage }) {
  return (
    <section id="ai-chat" className="relative border-t border-white/10 py-24">
      <div className="container">
        <SectionIntro
          eyebrow="AI accessibility assistant"
          title="A convincing WhatsApp-style command center."
          description="Text, voice and image previews simulate the future multimodal workflow without connecting a real AI model yet."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.35fr_0.65fr]">
          <ConversationSidebar liveStage={liveStage} />
          <ChatPanel liveStage={liveStage} />
        </div>
      </div>
    </section>
  )
}

function AnalyticsSection({ kpis }) {
  return (
    <section id="analytics" className="relative border-t border-white/10 py-24">
      <div className="container">
        <SectionIntro
          eyebrow="Operational analytics"
          title="KPIs that feel alive during the pitch."
          description="The dashboard simulates live movement from reports, incidents and assisted routes across Peru tourism areas."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.62fr_0.38fr]">
          <ChartPanel title="Accessibility reports" subtitle="Simulated weekly signal by district">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={accessibilityTrend}>
                <defs>
                  <linearGradient id="miraflores" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="barranco" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#0b1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                <Area type="monotone" dataKey="Miraflores" stroke="#2dd4bf" fill="url(#miraflores)" strokeWidth={2} />
                <Area type="monotone" dataKey="Barranco" stroke="#a78bfa" fill="url(#barranco)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel title="Route readiness" subtitle="Accessibility score by zone">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={routeQuality}>
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#0b1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                <Bar dataKey="value" fill="#a78bfa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>
      </div>
    </section>
  )
}

function OperationsSection({ feed, liveStage }) {
  return (
    <section id="operations" className="relative border-t border-white/10 py-24">
      <div className="container grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
        <SectionIntro
          eyebrow="Storytelling layer"
          title="From citizen report to operational decision."
          description="The demo links a tourist complaint, AI classification, map hotspot, dashboard change and municipal escalation in one visual narrative."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-panel rounded-lg p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Incident heatmap</h3>
              <Badge className="text-primary">Updating</Badge>
            </div>
            <div className="mt-5 grid grid-cols-6 gap-2">
              {Array.from({ length: 36 }).map((_, index) => (
                <motion.div
                  key={index}
                  animate={{
                    opacity: index % 7 === liveStage ? [0.45, 1, 0.45] : 1,
                  }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className={cn(
                    'aspect-square rounded-sm border border-white/5',
                    index % 7 === liveStage
                      ? 'bg-primary/70 shadow-[0_0_22px_rgba(45,212,191,0.38)]'
                      : index % 5 === 0
                        ? 'bg-primary/45'
                        : index % 3 === 0
                          ? 'bg-accent/35'
                          : 'bg-white/[0.055]',
                  )}
                />
              ))}
            </div>

            <div className="mt-5 rounded-md border border-white/10 bg-white/[0.035] p-4">
              <p className="text-sm font-medium">Current story</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Barranco tourist report creates a medium severity incident,
                highlights the map and raises analytics demand.
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-lg p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Live activity feed</h3>
              <span className="h-2 w-2 rounded-full bg-primary live-pulse" />
            </div>
            <div className="mt-5 space-y-4">
              {feed.map((item) => (
                <ActivityItem key={`${item.title}-${item.zone}`} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LeafletDemoMap({ liveStage }) {
  const mapNodeRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) {
      return
    }

    mapRef.current = L.map(mapNodeRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
    }).setView([-12.11, -77.03], 11)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(mapRef.current)

    markersRef.current = tourismZones.map((zone, index) => {
      const marker = L.marker(zone.coordinates, {
        icon: createDemoIcon(zone, index === liveStage % tourismZones.length),
      }).addTo(mapRef.current)

      marker.bindTooltip(
        `${zone.name}<br/>${zone.score}% - ${zone.status}`,
        { direction: 'top', offset: [0, -12], opacity: 0.95 },
      )

      return marker
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
      markersRef.current = []
    }
  }, [liveStage])

  useEffect(() => {
    markersRef.current.forEach((marker, index) => {
      marker.setIcon(
        createDemoIcon(
          tourismZones[index],
          index === liveStage % tourismZones.length,
        ),
      )
    })
  }, [liveStage])

  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-white/10 bg-[#071018]">
      <div ref={mapNodeRef} className="h-[360px] w-full" />
      <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-white/10 bg-background/75 px-3 py-2 backdrop-blur-xl">
        <p className="text-xs font-medium">Live tourism zones</p>
        <p className="text-[11px] text-muted-foreground">
          Simulated Leaflet layer
        </p>
      </div>
    </div>
  )
}

function createDemoIcon(zone, active) {
  const tone =
    zone.type === 'incident'
      ? 'incident'
      : zone.type === 'review'
        ? 'review'
        : 'safe'

  return L.divIcon({
    className: '',
    html: `<div class="demo-marker ${tone} ${active ? 'active' : ''}"><span>${zone.score}</span></div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  })
}

function SectionIntro({ eyebrow, title, description }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="max-w-3xl"
    >
      <Badge>{eyebrow}</Badge>
      <h2 className="text-balance mt-5 text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
    </motion.div>
  )
}

function ConversationSidebar({ liveStage }) {
  const conversations = [
    ['Barranco incident', 'Medium severity escalation'],
    ['Miraflores image scan', 'Photo analysis preview'],
    ['Cusco voice note', 'Transcript generated'],
    ['Machu Picchu demand', 'Visitor flow spike'],
  ]

  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Conversations</h3>
        <Badge>4 active</Badge>
      </div>
      <div className="mt-4 space-y-3">
        {conversations.map(([title, text], index) => (
          <button
            key={title}
            className={cn(
              'w-full rounded-md border p-3 text-left transition hover:-translate-y-0.5 hover:bg-white/[0.06]',
              index === liveStage % conversations.length
                ? 'border-primary/30 bg-primary/10'
                : 'border-white/10 bg-white/[0.03]',
            )}
            type="button"
          >
            <p className="text-sm font-medium">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{text}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function ChatPanel({ liveStage }) {
  return (
    <div className="glass-panel overflow-hidden rounded-lg">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-semibold">Rimay Assistant</h3>
            <p className="text-xs text-primary">accessibility triage online</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Mic className="h-4 w-4" aria-hidden="true" />
          Voice
        </Button>
      </div>

      <div className="max-h-[620px] space-y-4 overflow-hidden bg-[#071018]/80 p-5">
        {chatMessages.map((message, index) => (
          <ChatBubble key={message.text} index={index} {...message} />
        ))}
        <AudioMessage />
        <UploadPreview />
        <TypingIndicator liveStage={liveStage} />
      </div>

      <div className="border-t border-white/10 bg-card/80 p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt) => (
            <span
              key={prompt}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted-foreground"
            >
              {prompt}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" aria-hidden="true" />
          </Button>
          <div className="flex-1 text-sm text-muted-foreground">
            Report a tourism accessibility issue...
          </div>
          <Button size="icon">
            <Send className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function ChatBubble({ from, text, time, meta, index }) {
  const isUser = from === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.28 }}
      className={cn('flex', isUser && 'justify-end')}
    >
      <div
        className={cn(
          'max-w-[86%] rounded-lg px-4 py-3 text-sm leading-6 shadow-soft',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'border border-white/10 bg-white/[0.07] text-foreground',
        )}
      >
        <p>{text}</p>
        {meta ? (
          <p className="mt-2 rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-xs text-primary">
            {meta}
          </p>
        ) : null}
        <p className={cn('mt-1 text-right text-[11px]', isUser ? 'text-slate-900/70' : 'text-muted-foreground')}>
          {time}
        </p>
      </div>
    </motion.div>
  )
}

function AudioMessage() {
  return (
    <div className="flex justify-end">
      <div className="flex max-w-[86%] items-center gap-3 rounded-lg bg-primary px-4 py-3 text-primary-foreground">
        <AudioLines className="h-5 w-5" aria-hidden="true" />
        <div className="flex items-end gap-1">
          {Array.from({ length: 18 }).map((_, index) => (
            <motion.span
              key={index}
              animate={{ height: [8, 18 + (index % 5) * 3, 8] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: index * 0.03 }}
              className="w-1 rounded-full bg-slate-950/60"
            />
          ))}
        </div>
        <span className="text-xs">0:18</span>
      </div>
    </div>
  )
}

function UploadPreview() {
  return (
    <div className="flex">
      <div className="max-w-[86%] rounded-lg border border-white/10 bg-white/[0.07] p-3">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-md bg-accent/20 text-accent">
            <Camera className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium">barranco-entrance.jpg</p>
            <p className="text-xs text-muted-foreground">
              Simulated result: curb too high, alternate route suggested.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function TypingIndicator({ liveStage }) {
  const labels = [
    'Classifying severity',
    'Generating municipal escalation',
    'Updating dashboard signal',
    'Preparing accessible route',
    'Syncing map hotspot',
  ]

  return (
    <div className="flex">
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.07] px-4 py-3">
        <AudioLines className="h-4 w-4 text-primary" aria-hidden="true" />
        {[0, 1, 2].map((item) => (
          <motion.span
            key={item}
            animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: item * 0.16 }}
            className="h-2 w-2 rounded-full bg-primary"
          />
        ))}
        <span className="ml-2 text-xs text-muted-foreground">
          {labels[liveStage % labels.length]}
        </span>
      </div>
    </div>
  )
}

function KpiCard({ label, value, suffix, delta, icon: Icon }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-panel rounded-lg p-5"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white/[0.06] text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <Badge className="text-primary">{delta}</Badge>
      </div>
      <p className="mt-5 text-sm text-muted-foreground">{label}</p>
      <motion.p
        key={`${label}-${value}`}
        initial={{ opacity: 0.65, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 text-3xl font-semibold"
      >
        {formatKpiValue(value, suffix)}
      </motion.p>
    </motion.article>
  )
}

function ChartPanel({ title, subtitle, children }) {
  return (
    <div className="glass-panel rounded-lg p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="h-2 w-2 rounded-full bg-primary live-pulse" />
      </div>
      {children}
    </div>
  )
}

function InsightCard({ title, value, icon: Icon, active }) {
  return (
    <motion.div
      animate={{ borderColor: active ? 'rgba(45,212,191,0.42)' : 'rgba(255,255,255,0.1)' }}
      className="rounded-lg border bg-white/[0.045] p-4"
    >
      <div className="flex items-center gap-3">
        <span className={cn('flex h-9 w-9 items-center justify-center rounded-md bg-white/[0.06]', active ? 'text-primary live-pulse' : 'text-muted-foreground')}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="font-semibold">{value}</p>
        </div>
      </div>
    </motion.div>
  )
}

function ActivityItem({ item }) {
  const Icon = item.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-3"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">{item.title}</p>
          <Badge>{item.severity}</Badge>
        </div>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {item.text}
        </p>
      </div>
    </motion.div>
  )
}

function formatKpiValue(value, suffix) {
  if (suffix === 's') {
    return `${value.toFixed(1)}s`
  }

  if (suffix === '%') {
    return `${Math.round(value)}%`
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`
  }

  return String(value)
}
