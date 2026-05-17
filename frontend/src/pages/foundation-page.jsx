import { motion } from 'framer-motion'
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
  AlertTriangle,
  ArrowRight,
  AudioLines,
  Bot,
  Camera,
  CheckCircle2,
  Clock3,
  Map,
  Mic,
  Paperclip,
  Send,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
} from 'lucide-react'

import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { cn } from '@/lib/utils'

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
}

const accessibilityTrend = [
  { label: 'Mon', value: 32 },
  { label: 'Tue', value: 46 },
  { label: 'Wed', value: 41 },
  { label: 'Thu', value: 58 },
  { label: 'Fri', value: 71 },
  { label: 'Sat', value: 86 },
  { label: 'Sun', value: 79 },
]

const routeQuality = [
  { label: 'Museums', value: 82 },
  { label: 'Hotels', value: 68 },
  { label: 'Transit', value: 74 },
  { label: 'Tours', value: 91 },
]

const kpis = [
  { label: 'Accessible routes', value: '2,418', delta: '+18%', icon: Map },
  { label: 'Visitors assisted', value: '8.9k', delta: '+31%', icon: Users },
  { label: 'Avg response', value: '1.2s', delta: '-24%', icon: Clock3 },
  { label: 'Resolved alerts', value: '96%', delta: '+12%', icon: ShieldCheck },
]

const messages = [
  {
    from: 'ai',
    text: 'Hola, soy Rimay. Puedo analizar fotos, audio o texto para recomendar rutas turisticas accesibles.',
    time: '09:41',
  },
  {
    from: 'user',
    text: 'Necesito una ruta accesible cerca del centro historico para una persona en silla de ruedas.',
    time: '09:42',
  },
  {
    from: 'ai',
    text: 'Perfecto. Tengo 3 rutas candidatas con rampas, banos accesibles y baja pendiente. Tambien puedo priorizar lugares con menos afluencia.',
    time: '09:42',
  },
]

const activityItems = [
  {
    icon: CheckCircle2,
    title: 'Route validated',
    text: 'Centro Historico route scored 94 accessibility points.',
  },
  {
    icon: Upload,
    title: 'Image uploaded',
    text: 'Visitor submitted entrance photo for visual inspection.',
  },
  {
    icon: AlertTriangle,
    title: 'Incident flagged',
    text: 'Temporary sidewalk obstruction near Plaza Norte.',
  },
]

export function FoundationPage() {
  return (
    <div className="bg-background">
      <HeroSection />
      <ChatSection />
      <AnalyticsSection />
      <OperationsSection />
    </div>
  )
}

function HeroSection() {
  return (
    <section
      id="platform"
      className="premium-grid relative min-h-[calc(100vh-4rem)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(45,212,191,0.20),transparent_30%),radial-gradient(circle_at_86%_72%,rgba(167,139,250,0.18),transparent_30%),linear-gradient(180deg,rgba(7,10,20,0),hsl(var(--background))_92%)]" />

      <div className="container relative grid min-h-[calc(100vh-4rem)] items-center gap-12 py-16 lg:grid-cols-[1.03fr_0.97fr]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <Badge className="text-primary">
            <Sparkles className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
            Multimodal accessibility tourism OS
          </Badge>
          <h1 className="text-balance mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] text-foreground sm:text-6xl lg:text-7xl">
            AI-powered tourism access, designed for real-time inclusion.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Rimay AI turns conversations, images, audio and location signals
            into a premium operating layer for accessible tourism teams.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button>
              Explore demo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button variant="outline">View foundation</Button>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {['Inclusive', 'Realtime-ready', 'AI-ready'].map((item) => (
              <div key={item} className="glass-panel rounded-lg px-4 py-3">
                <p className="text-xs text-muted-foreground">{item}</p>
              </div>
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Live accessibility map</p>
                <p className="text-xs text-muted-foreground">
                  Lima tourism demo workspace
                </p>
              </div>
              <Badge className="border-primary/20 bg-primary/10 text-primary">
                Stable MVP
              </Badge>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_0.76fr]">
              <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(20,184,166,0.14),rgba(15,23,42,0.2)),radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.12),transparent_3%),radial-gradient(circle_at_68%_62%,rgba(45,212,191,0.36),transparent_4%),radial-gradient(circle_at_48%_78%,rgba(167,139,250,0.32),transparent_4%)]">
                <div className="absolute left-8 top-10 h-28 w-44 rounded-full border border-primary/40" />
                <div className="absolute bottom-12 right-8 h-36 w-52 rounded-full border border-accent/40" />
                <div className="absolute left-12 top-28 h-2 w-52 rotate-12 rounded-full bg-primary/35" />
                <div className="absolute bottom-24 left-24 h-2 w-56 -rotate-12 rounded-full bg-accent/35" />
                <MapPin label="94" className="left-[54%] top-[34%]" />
                <MapPin label="82" className="left-[26%] top-[62%]" />
                <MapPin label="76" className="left-[72%] top-[70%]" />
              </div>

              <div className="grid gap-3">
                <InsightCard title="Audio guidance" value="Ready" icon={AudioLines} />
                <InsightCard title="Image inspection" value="Prepared" icon={Camera} />
                <InsightCard title="Route confidence" value="94%" icon={Activity} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ChatSection() {
  return (
    <section id="ai-chat" className="relative border-t border-white/10 py-24">
      <div className="container">
        <SectionIntro
          eyebrow="WhatsApp-like AI interface"
          title="A natural conversation layer for inclusive tourism."
          description="Visual-only demo of the future assistant experience: text, image upload, audio messages and smooth typing states without AI logic yet."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.35fr_0.65fr]">
          <ConversationSidebar />
          <ChatPanel />
        </div>
      </div>
    </section>
  )
}

function AnalyticsSection() {
  return (
    <section id="analytics" className="relative border-t border-white/10 py-24">
      <div className="container">
        <SectionIntro
          eyebrow="Premium analytics dashboard"
          title="Operational visibility before complexity."
          description="Dashboard placeholders show the product direction while keeping the backend simple and stable for the hackathon foundation."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.62fr_0.38fr]">
          <ChartPanel title="Accessibility demand" subtitle="Weekly assisted journeys">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={accessibilityTrend}>
                <defs>
                  <linearGradient id="accessibility" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#0b1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                <Area type="monotone" dataKey="value" stroke="#2dd4bf" fill="url(#accessibility)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel title="Route quality" subtitle="Category readiness score">
            <ResponsiveContainer width="100%" height={260}>
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

function OperationsSection() {
  return (
    <section id="operations" className="relative border-t border-white/10 py-24">
      <div className="container grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
        <SectionIntro
          eyebrow="Operations layer"
          title="Built to impress judges and guide the build."
          description="A cinematic operating surface with heatmap, incidents and activity feed placeholders ready for future realtime data."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-panel rounded-lg p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Heatmap placeholder</h3>
              <Badge>Live-ready</Badge>
            </div>
            <div className="mt-5 grid grid-cols-6 gap-2">
              {Array.from({ length: 36 }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'aspect-square rounded-sm border border-white/5',
                    index % 5 === 0
                      ? 'bg-primary/60'
                      : index % 3 === 0
                        ? 'bg-accent/40'
                        : 'bg-white/[0.06]',
                  )}
                />
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-lg p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Activity feed</h3>
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_18px_rgba(45,212,191,0.9)]" />
            </div>
            <div className="mt-5 space-y-4">
              {activityItems.map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.title} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
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

function ConversationSidebar() {
  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Conversations</h3>
        <Badge>4 active</Badge>
      </div>
      <div className="mt-4 space-y-3">
        {['Museum route', 'Hotel entrance', 'Audio guide', 'Incident report'].map(
          (item, index) => (
            <button
              key={item}
              className={cn(
                'w-full rounded-md border p-3 text-left transition hover:bg-white/[0.06]',
                index === 0
                  ? 'border-primary/30 bg-primary/10'
                  : 'border-white/10 bg-white/[0.03]',
              )}
              type="button"
            >
              <p className="text-sm font-medium">{item}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Accessibility assistant preview
              </p>
            </button>
          ),
        )}
      </div>
    </div>
  )
}

function ChatPanel() {
  return (
    <div className="glass-panel overflow-hidden rounded-lg">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-semibold">Rimay Assistant</h3>
            <p className="text-xs text-primary">typing visual demo</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Mic className="h-4 w-4" aria-hidden="true" />
          Audio
        </Button>
      </div>

      <div className="max-h-[560px] space-y-4 overflow-hidden bg-[#071018]/80 p-5">
        {messages.map((message) => (
          <ChatBubble key={message.text} {...message} />
        ))}
        <AudioMessage />
        <UploadPreview />
        <TypingIndicator />
      </div>

      <div className="border-t border-white/10 bg-card/80 p-4">
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" aria-hidden="true" />
          </Button>
          <div className="flex-1 text-sm text-muted-foreground">
            Ask about accessible routes, uploads or audio notes...
          </div>
          <Button size="icon">
            <Send className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function ChatBubble({ from, text, time }) {
  const isUser = from === 'user'

  return (
    <div className={cn('flex', isUser && 'justify-end')}>
      <div
        className={cn(
          'max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6 shadow-soft',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'border border-white/10 bg-white/[0.07] text-foreground',
        )}
      >
        <p>{text}</p>
        <p className={cn('mt-1 text-right text-[11px]', isUser ? 'text-slate-900/70' : 'text-muted-foreground')}>
          {time}
        </p>
      </div>
    </div>
  )
}

function AudioMessage() {
  return (
    <div className="flex justify-end">
      <div className="flex max-w-[82%] items-center gap-3 rounded-lg bg-primary px-4 py-3 text-primary-foreground">
        <AudioLines className="h-5 w-5" aria-hidden="true" />
        <div className="flex items-end gap-1">
          {Array.from({ length: 18 }).map((_, index) => (
            <span
              key={index}
              className="w-1 rounded-full bg-slate-950/60"
              style={{ height: `${8 + (index % 5) * 4}px` }}
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
      <div className="max-w-[82%] rounded-lg border border-white/10 bg-white/[0.07] p-3">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-md bg-accent/20 text-accent">
            <Camera className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium">entrance-photo.jpg</p>
            <p className="text-xs text-muted-foreground">
              Image upload UI ready for future multimodal analysis
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function TypingIndicator() {
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
      </div>
    </div>
  )
}

function KpiCard({ label, value, delta, icon: Icon }) {
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
      <p className="mt-2 text-3xl font-semibold">{value}</p>
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
        <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_18px_rgba(45,212,191,0.9)]" />
      </div>
      {children}
    </div>
  )
}

function InsightCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white/[0.06] text-primary">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="font-semibold">{value}</p>
        </div>
      </div>
    </div>
  )
}

function MapPin({ label, className }) {
  return (
    <div
      className={cn(
        'absolute flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/20 text-sm font-semibold text-primary shadow-[0_0_32px_rgba(45,212,191,0.42)] backdrop-blur',
        className,
      )}
    >
      {label}
    </div>
  )
}
