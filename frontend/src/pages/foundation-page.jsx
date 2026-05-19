import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
  Cloud,
  Map,
  Mic,
  Paperclip,
  Play,
  Radio,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  WifiOff,
} from 'lucide-react'

import {
  accessibilityTrend,
  chatMessages,
  culturalExperiences,
  explorationProfiles,
  heritageTimeline,
  routeQuality,
  suggestedPrompts,
  tourismZones,
} from '@/features/demo/demo-data'
import { useDemoRealtime } from '@/features/demo/use-demo-realtime'
import { sendChatMessage } from '@/services/api/chat-api'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { cn } from '@/lib/utils'

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
}

const destinationAliases = [
  { key: 'Barranco', aliases: ['barranco', 'puente de los suspiros', 'suspiros'] },
  { key: 'Miraflores', aliases: ['miraflores', 'malecon', 'malecón'] },
  { key: 'Cusco', aliases: ['cusco', 'plaza de cusco'] },
  { key: 'Machu Picchu', aliases: ['machu picchu', 'machupicchu'] },
  { key: 'Centro Historico', aliases: ['centro historico', 'centro histórico'] },
]

export function FoundationPage() {
  const liveExperience = useDemoRealtime()
  const [activeDestination, setActiveDestination] = useState('Barranco')
  const [liveReport, setLiveReport] = useState(null)

  function handleExperienceSignal(message, source = 'chat') {
    const destination = detectDestination(message)

    if (!destination) {
      return
    }

    setActiveDestination(destination)
    setLiveReport({
      destination,
      id: `${Date.now()}-${destination}`,
      message,
      source,
    })
  }

  return (
    <div className="bg-background">
      <HeroSection
        activeDestination={activeDestination}
        liveStage={liveExperience.liveStage}
        tick={liveExperience.tick}
      />
      <ChatSection
        activeDestination={activeDestination}
        liveStage={liveExperience.liveStage}
        onExperienceSignal={handleExperienceSignal}
      />
      <AnalyticsSection kpis={liveExperience.kpis} liveReport={liveReport} />
      <OperationsSection
        feed={liveExperience.feed}
        liveReport={liveReport}
        liveStage={liveExperience.liveStage}
      />
    </div>
  )
}

function HeroSection({ activeDestination, liveStage, tick }) {
  return (
    <section
      id="platform"
      className="premium-grid relative min-h-[calc(100vh-4rem)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(45,212,191,0.22),transparent_30%),radial-gradient(circle_at_86%_72%,rgba(167,139,250,0.18),transparent_30%),linear-gradient(180deg,rgba(7,10,20,0),hsl(var(--background))_92%)]" />
      <AmbientParticles />

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
            Explora el Peru con mas confianza
          </Badge>
          <h1 className="text-balance mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] text-foreground sm:text-6xl lg:text-7xl">
            Tu companero inteligente para explorar el Peru sin barreras
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Rimay AI ayuda a personas con discapacidad, familias y viajeros a
            descubrir rutas accesibles, reportar barreras por voz o imagen y
            moverse por destinos del Peru con informacion clara, cercana y util.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <a href="#ai-chat">
                Explorar Peru sin barreras
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="#platform">Iniciar recorrido accesible</a>
            </Button>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {[ 
              ['Destinos inclusivos', '5 en exploracion'],
              ['Ayudas generadas', `${42 + tick} hoy`],
              ['Acompanamiento', 'Siempre activo'],
            ].map(([label, value]) => (
              <motion.div
                key={label}
                whileHover={{ y: -3 }}
                className="glass-panel premium-hover rounded-lg px-4 py-3"
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
          className="glass-panel premium-hover rounded-lg p-4"
        >
          <div className="rounded-md border border-white/10 bg-[#090d16] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Rutas accesibles del Peru</p>
                <p className="text-xs text-muted-foreground">
                  Lugares para explorar con mayor seguridad y autonomia
                </p>
              </div>
              <Badge className="border-primary/20 bg-primary/10 text-primary">
                <Radio className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                Guia activa
              </Badge>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_0.76fr]">
              <LeafletExperienceMap
                activeDestination={activeDestination}
                liveStage={liveStage}
              />

              <div className="grid gap-3">
                {tourismZones.slice(0, 3).map((zone, index) => (
                  <InsightCard
                    key={zone.name}
                    title={zone.name}
                    value={`${zone.score}% ${zone.status}`}
                    icon={zoneMatchesDestination(zone, activeDestination) ? Activity : Map}
                    active={zoneMatchesDestination(zone, activeDestination) || index === liveStage % 3}
                  />
                ))}
                <OfflineReadiness />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function AmbientParticles() {
  const particles = [
    ['12%', '24%', '0s'],
    ['22%', '72%', '2.8s'],
    ['42%', '18%', '5.6s'],
    ['67%', '64%', '1.4s'],
    ['82%', '28%', '4.2s'],
    ['91%', '78%', '7s'],
  ]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map(([left, top, delay]) => (
        <span
          className="ambient-particle"
          key={`${left}-${top}`}
          style={{ animationDelay: delay, left, top }}
        />
      ))}
    </div>
  )
}

function ChatSection({ activeDestination, liveStage, onExperienceSignal }) {
  const [selectedProfile, setSelectedProfile] = useState(explorationProfiles[0])

  return (
    <section id="ai-chat" className="relative border-t border-white/10 py-24">
      <div className="container">
        <SectionIntro
          eyebrow="Asistente IA de accesibilidad"
          title="Pregunta como hablas. Rimay te acompana como una guia cercana."
          description="Usa texto, voz o imagen para contar una barrera, pedir una ruta accesible o entender que opcion es mas comoda para tu viaje."
        />

        <CulturalMode
          selectedProfile={selectedProfile}
          setSelectedProfile={setSelectedProfile}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.35fr_0.65fr]">
          <ConversationSidebar
            activeDestination={activeDestination}
            liveStage={liveStage}
          />
          <ChatPanel liveStage={liveStage} onExperienceSignal={onExperienceSignal} />
        </div>
      </div>
    </section>
  )
}

function AnalyticsSection({ kpis, liveReport }) {
  return (
    <section id="analytics" className="relative border-t border-white/10 py-24">
      <div className="container">
        <SectionIntro
          eyebrow="Accesibilidad en datos"
          title="Informacion clara para mejorar la experiencia de cada visitante."
          description="El panel muestra como los reportes de personas reales ayudan a priorizar rutas, detectar barreras y hacer mas inclusivos los destinos turisticos."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi, index) => (
            <KpiCard key={kpi.label} pulse={Boolean(liveReport) && index === 0} {...kpi} />
          ))}
        </div>
        {liveReport ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary"
          >
            Nuevo reporte conectado: ruta accesible sugerida en {liveReport.destination}.
          </motion.div>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.62fr_0.38fr]">
          <ChartPanel title="Necesidades de accesibilidad" subtitle="Senal inteligente por distrito">
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

          <ChartPanel title="Rutas preparadas" subtitle="Nivel de accesibilidad por zona">
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

function OperationsSection({ feed, liveReport, liveStage }) {
  const enrichedFeed = liveReport
    ? [
        {
          icon: Mic,
          severity: 'Nuevo',
          text: `Reporte por ${liveReport.source === 'voz' ? 'voz' : 'chat'} conectado con el mapa y la guia de ${liveReport.destination}.`,
          title: `Nueva solicitud en ${liveReport.destination}`,
          zone: liveReport.destination,
        },
        ...feed,
      ].slice(0, 4)
    : feed

  return (
    <section id="operations" className="relative border-t border-white/10 py-24">
      <div className="container grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
        <SectionIntro
          eyebrow="Historias que ayudan"
          title="Una voz puede mejorar el camino de muchas personas."
          description="Rimay muestra como un reporte simple se convierte en orientacion util, una ruta alterna y una senal visible para mejorar la experiencia inclusiva."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <HeritageTimeline liveReport={liveReport} liveStage={liveStage} />
          <div className="glass-panel premium-hover rounded-lg p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Zonas que necesitan atencion</h3>
              <Badge className="text-primary">Aprendiendo</Badge>
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
              <p className="text-sm font-medium">Historia de ayuda</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Una persona reporta una barrera en Barranco. Rimay sugiere una
                ruta alterna, marca la zona y ayuda a que otros visitantes viajen
                con mas tranquilidad.
              </p>
            </div>
          </div>

          <div className="glass-panel premium-hover rounded-lg p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Historias en tiempo real</h3>
              <span className="h-2 w-2 rounded-full bg-primary live-pulse" />
            </div>
            <div className="mt-5 space-y-4">
              {enrichedFeed.map((item) => (
                <ActivityItem key={`${item.title}-${item.zone}`} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LeafletExperienceMap({ activeDestination, liveStage }) {
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

    markersRef.current = tourismZones.map((zone) => {
      const marker = L.marker(zone.coordinates, {
        icon: createMapMarkerIcon(zone, false),
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
  }, [])

  useEffect(() => {
    markersRef.current.forEach((marker, index) => {
      const zone = tourismZones[index]
      const isActive =
        zoneMatchesDestination(zone, activeDestination) ||
        index === liveStage % tourismZones.length

      marker.setIcon(
        createMapMarkerIcon(
          zone,
          isActive,
        ),
      )

      if (zoneMatchesDestination(zone, activeDestination)) {
        mapRef.current?.flyTo(zone.coordinates, 13, {
          duration: 1.1,
          easeLinearity: 0.2,
        })
        marker.openTooltip()
      }
    })
  }, [activeDestination, liveStage])

  return (
    <div
      aria-label="Mapa interactivo con rutas accesibles y lugares inclusivos del Peru"
      className="relative min-h-[360px] overflow-hidden rounded-lg border border-white/10 bg-[#071018]"
      role="region"
    >
      <div ref={mapNodeRef} className="h-[360px] w-full" />
      <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-white/10 bg-background/75 px-3 py-2 backdrop-blur-xl">
        <p className="text-xs font-medium">Lugares inclusivos cercanos</p>
        <p className="text-[11px] text-muted-foreground">
          Guia visual de accesibilidad
        </p>
      </div>
    </div>
  )
}

function CulturalMode({ selectedProfile, setSelectedProfile }) {
  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        className="glass-panel premium-hover rounded-lg p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">Como deseas explorar el Peru?</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Rimay adapta el tono visual de la guia segun la forma en que
              cada persona necesita moverse, escuchar o sentir el lugar.
            </p>
          </div>
          <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>

        <div className="mt-5 grid gap-2">
          {explorationProfiles.map((profile) => {
            const Icon = profile.icon
            const isSelected = profile.label === selectedProfile.label

            return (
              <button
                aria-pressed={isSelected}
                className={cn(
                  'premium-hover rounded-md border px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isSelected
                    ? 'border-primary/40 bg-primary/10 text-foreground'
                    : 'border-white/10 bg-white/[0.035] text-muted-foreground hover:bg-white/[0.07] hover:text-foreground',
                )}
                key={profile.label}
                onClick={() => setSelectedProfile(profile)}
                type="button"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium">{profile.label}</span>
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-5 rounded-md border border-primary/20 bg-primary/10 p-4">
          <p className="text-xs font-medium text-primary">Recomendacion activa</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {selectedProfile.recommendation}
          </p>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        {culturalExperiences.map((experience) => (
          <CulturalPlaceCard key={experience.title} experience={experience} />
        ))}
      </div>
    </div>
  )
}

function CulturalPlaceCard({ experience }) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.22 }}
      className="glass-panel premium-hover rounded-lg p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge>{experience.place}</Badge>
          <h3 className="mt-4 text-lg font-semibold">{experience.title}</h3>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Map className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {experience.description}
      </p>
      <div className="mt-5 grid gap-3 text-sm">
        <InfoLine label="Sensacion" value={experience.emotion} />
        <InfoLine label="Accesibilidad" value={experience.accessibility} />
        <InfoLine label="Ambiente" value={experience.ambience} />
        <InfoLine label="Horario ideal" value={experience.idealTime} />
      </div>
    </motion.article>
  )
}

function InfoLine({ label, value }) {
  return (
    <div className="premium-hover rounded-md border border-white/10 bg-white/[0.035] p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 leading-6">{value}</p>
    </div>
  )
}

function OfflineReadiness() {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Disponible sin conexion</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Guarda la ruta para zonas con poca senal.
          </p>
        </div>
        <WifiOff className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>
      <Button
        aria-label="Guardar ruta accesible para usar sin conexion"
        className="mt-4 w-full"
        size="sm"
        type="button"
        variant="outline"
      >
        <Cloud className="h-4 w-4" aria-hidden="true" />
        Guardar ruta offline
      </Button>
    </div>
  )
}

function HeritageTimeline({ liveReport, liveStage }) {
  return (
    <div className="glass-panel premium-hover rounded-lg p-5 md:col-span-2">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">Camino de una experiencia mas inclusiva</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Una historia conectada desde la voz de una persona hasta una ruta
            mas amable para todos.
          </p>
        </div>
        <Badge className="text-primary">
          {liveReport ? `Nuevo: ${liveReport.destination}` : 'Flujo vivo'}
        </Badge>
      </div>
      <div className="mt-6 grid gap-3 lg:grid-cols-5">
        {heritageTimeline.map((step, index) => (
          <motion.div
            animate={{
              opacity: index <= liveStage % heritageTimeline.length ? 1 : 0.55,
              y: index === liveStage % heritageTimeline.length ? -4 : 0,
            }}
            className="premium-hover rounded-md border border-white/10 bg-white/[0.035] p-3"
            key={step}
            transition={{ duration: 0.3 }}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {index + 1}
            </span>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{step}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function createMapMarkerIcon(zone, active) {
  const tone =
    zone.type === 'incident'
      ? 'incident'
      : zone.type === 'review'
        ? 'review'
        : 'safe'

  return L.divIcon({
    className: '',
    html: `<div class="map-marker ${tone} ${active ? 'active' : ''}"><span>${zone.score}</span></div>`,
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

function ConversationSidebar({ activeDestination, liveStage }) {
  const conversations = [
    ['Ruta en Barranco', 'Alternativa mas accesible'],
    ['Foto en Miraflores', 'Ingreso revisado por IA'],
    ['Voz desde Cusco', 'Mensaje convertido en guia'],
    ['Machu Picchu', 'Apoyo para flujo de visitantes'],
  ]

  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Conversaciones</h3>
        <Badge>4 activas</Badge>
      </div>
      <div className="mt-4 space-y-3">
        {conversations.map(([title, text], index) => (
          <button
            key={title}
            className={cn(
              'w-full rounded-md border p-3 text-left transition hover:-translate-y-0.5 hover:bg-white/[0.06]',
              title.toLowerCase().includes(activeDestination.toLowerCase()) ||
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

function ChatPanel({ liveStage, onExperienceSignal }) {
  const [messages, setMessages] = useState(chatMessages)
  const [inputValue, setInputValue] = useState('')
  const [isResponding, setIsResponding] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const [speechStatus, setSpeechStatus] = useState('')
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)
  const voiceTranscriptRef = useRef('')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isResponding])

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  async function handleSendMessage(message = inputValue, source = 'chat') {
    const trimmedMessage = message.trim()

    if (!trimmedMessage || isResponding) {
      return
    }

    const detectedDestination = detectDestination(trimmedMessage)

    const userMessage = {
      from: 'user',
      text: trimmedMessage,
      time: getCurrentTime(),
    }

    setMessages((currentMessages) => [...currentMessages, userMessage])
    setInputValue('')
    setIsResponding(true)
    setSpeechStatus(detectedDestination ? 'Analizando ruta...' : 'Procesando...')
    onExperienceSignal(trimmedMessage, source)
    playSoftTone('send', isSoundEnabled)

    try {
      const data = await sendChatMessage(
        trimmedMessage,
        buildChatHistory(messages),
      )
      playSoftTone('receive', isSoundEnabled)

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          from: 'ai',
          text: data.response,
          time: getCurrentTime(),
          meta: detectedDestination
            ? `Mapa actualizado: ${detectedDestination}`
            : 'Rimay AI esta analizando tu experiencia',
        },
      ])
    } catch {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          from: 'ai',
          text: 'Estoy reorganizando la mejor ruta accesible para ti. Intenta nuevamente en un momento y mantendre el contexto de tu experiencia.',
          time: getCurrentTime(),
          meta: 'Rimay AI mantiene la experiencia activa',
        },
      ])
    } finally {
      setIsResponding(false)
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  function handleSuggestedPrompt(prompt) {
    setInputValue(prompt)
    handleSendMessage(prompt)
  }

  function handleVoiceInput() {
    const SpeechRecognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setSpeechStatus('Voz no disponible en este navegador')
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      setSpeechStatus('')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'es-PE'
    recognition.interimResults = true
    recognition.continuous = false
    voiceTranscriptRef.current = ''

    recognition.onstart = () => {
      setIsListening(true)
      setSpeechStatus('Escuchando...')
      playSoftTone('voice', isSoundEnabled)
    }

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? '')
        .join('')

      setInputValue(transcript)
      voiceTranscriptRef.current = transcript
      setSpeechStatus('Transcripcion lista')
    }

    recognition.onerror = () => {
      setIsListening(false)
      setSpeechStatus('No se pudo capturar la voz')
    }

    recognition.onend = () => {
      setIsListening(false)
      const finalTranscript = voiceTranscriptRef.current.trim()

      if (finalTranscript) {
        setSpeechStatus('Procesando...')
        handleSendMessage(finalTranscript, 'voz')
        voiceTranscriptRef.current = ''
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  return (
    <motion.div
      animate={{
        boxShadow: isResponding
          ? '0 0 0 1px rgba(45,212,191,0.18), 0 0 70px rgba(45,212,191,0.13)'
          : '0 24px 80px rgba(0,0,0,0.22)',
      }}
      transition={{ duration: 0.28 }}
      className="glass-panel premium-hover overflow-hidden rounded-lg"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className={cn(
            'flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground',
            isResponding && 'live-pulse',
          )}>
            <Bot className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-semibold">Asistente Rimay</h3>
            <p className="flex items-center gap-1.5 text-xs text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary live-pulse" />
              IA activa
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            aria-label={isSoundEnabled ? 'Desactivar sonidos sutiles' : 'Activar sonidos sutiles'}
            variant="ghost"
            size="icon"
            onClick={() => setIsSoundEnabled((current) => !current)}
            type="button"
          >
            {isSoundEnabled ? (
              <Volume2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <VolumeX className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
          <Button
            variant={isListening ? 'default' : 'outline'}
            size="sm"
            onClick={handleVoiceInput}
            type="button"
          >
            <Mic className="h-4 w-4" aria-hidden="true" />
            {isListening ? 'Escuchando' : 'Voz'}
          </Button>
        </div>
      </div>

      <div className="max-h-[620px] space-y-4 overflow-y-auto bg-[#071018]/80 p-5">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <ChatBubble key={`${message.text}-${index}`} index={index} {...message} />
          ))}
        </AnimatePresence>
        <AudioMessage />
        <UploadPreview />
        <CinematicAudioGuide />
        <AnimatePresence>
          {(isResponding || isListening) ? (
            <TypingIndicator
              liveStage={liveStage}
              label={isListening ? 'Escuchando reporte de voz' : undefined}
            />
          ) : null}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-white/10 bg-card/80 p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-left text-xs text-muted-foreground transition hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white/[0.08] hover:text-foreground disabled:opacity-50"
              disabled={isResponding}
              onClick={() => handleSuggestedPrompt(prompt)}
              type="button"
            >
              {prompt}
            </button>
          ))}
        </div>
        {speechStatus ? (
          <p className="mb-3 text-xs text-primary">{speechStatus}</p>
        ) : null}
        <form
          className="premium-focus flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-2"
          onSubmit={(event) => {
            event.preventDefault()
            handleSendMessage()
          }}
        >
          <Button variant="ghost" size="icon" type="button">
            <Paperclip className="h-5 w-5" aria-hidden="true" />
          </Button>
          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            disabled={isResponding}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cuenta que necesitas para viajar con menos barreras..."
            value={inputValue}
          />
          <Button disabled={!inputValue.trim() || isResponding} size="icon" type="submit">
            <Send className="h-4 w-4" aria-hidden="true" />
          </Button>
        </form>
      </div>
    </motion.div>
  )
}

function ChatBubble({ from, text, time, meta, index }) {
  const isUser = from === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.985, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: 8, scale: 0.985 }}
      transition={{ delay: Math.min(index * 0.025, 0.16), duration: 0.32, ease: 'easeOut' }}
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
      <div className="premium-hover max-w-[86%] rounded-lg border border-white/10 bg-white/[0.07] p-3">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-md bg-accent/20 text-accent">
            <Camera className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium">ingreso-barranco.jpg</p>
            <p className="text-xs text-muted-foreground">
              Analisis visual: ingreso dificil, alternativa mas amable sugerida.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CinematicAudioGuide() {
  return (
    <div className="flex">
      <div className="max-w-[86%] rounded-lg border border-primary/20 bg-primary/10 p-4 shadow-[0_0_36px_rgba(45,212,191,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Escuchar historia del lugar</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Narracion activa: Puente de los Suspiros
            </p>
          </div>
          <Button
            aria-label="Reproducir audioguia cinematografica"
            size="sm"
            type="button"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            2:18
          </Button>
        </div>
        <div className="mt-4 flex items-end gap-1" aria-hidden="true">
          {Array.from({ length: 28 }).map((_, index) => (
            <motion.span
              animate={{ height: [8, 24 + (index % 6) * 4, 10] }}
              className="w-1 rounded-full bg-primary/80"
              key={index}
              transition={{ duration: 1.4, repeat: Infinity, delay: index * 0.035 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function TypingIndicator({ liveStage, label }) {
  const labels = [
    'Entendiendo tu necesidad',
    'Buscando una alternativa accesible',
    'Actualizando la guia visual',
    'Preparando una ruta mas amable',
    'Conectando el reporte con el mapa',
  ]

  return (
    <motion.div
      className="flex"
      initial={{ opacity: 0, y: 12, filter: 'blur(5px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <div className="max-w-[86%] rounded-lg border border-primary/20 bg-white/[0.07] px-4 py-3 shadow-[0_0_44px_rgba(45,212,191,0.1)]">
        <div className="flex items-center gap-2">
          <AudioLines className="h-4 w-4 text-primary" aria-hidden="true" />
          {[0, 1, 2].map((item) => (
            <motion.span
              key={item}
              animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0], scale: [1, 1.18, 1] }}
              transition={{ duration: 1.08, repeat: Infinity, delay: item * 0.18 }}
              className="h-2 w-2 rounded-full bg-primary"
            />
          ))}
          <span className="ml-2 text-xs text-muted-foreground">
            {label ?? labels[liveStage % labels.length]}
          </span>
        </div>
        <div className="mt-3 grid gap-2" aria-hidden="true">
          <span className="premium-shimmer h-2 w-56 max-w-full rounded-full" />
          <span className="premium-shimmer h-2 w-36 rounded-full" />
        </div>
      </div>
    </motion.div>
  )
}

function playSoftTone(type, enabled) {
  if (!enabled || typeof window === 'undefined') {
    return
  }

  const AudioContext = window.AudioContext ?? window.webkitAudioContext

  if (!AudioContext) {
    return
  }

  try {
    const context = new AudioContext()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const tones = {
      send: [520, 0.045],
      receive: [720, 0.06],
      voice: [420, 0.07],
    }
    const [frequency, duration] = tones[type] ?? tones.receive

    oscillator.frequency.value = frequency
    oscillator.type = 'sine'
    gain.gain.setValueAtTime(0.0001, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + duration)
    oscillator.onended = () => context.close()
  } catch {
    // Sound feedback is decorative; never block the interaction.
  }
}

function KpiCard({ label, value, suffix, delta, icon: Icon, pulse = false }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'glass-panel premium-hover rounded-lg p-5',
        pulse && 'ring-1 ring-primary/30 shadow-[0_0_40px_rgba(45,212,191,0.16)]',
      )}
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
    <div className="glass-panel premium-hover rounded-lg p-5">
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
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'premium-hover rounded-lg border bg-white/[0.045] p-4',
        active && 'shadow-[0_0_34px_rgba(45,212,191,0.12)]',
      )}
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
      whileHover={{ x: 3 }}
      transition={{ duration: 0.2 }}
      className="premium-hover rounded-md border border-transparent p-2 -m-2 flex gap-3"
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

function detectDestination(message) {
  const normalizedMessage = message
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  const match = destinationAliases.find((destination) =>
    destination.aliases.some((alias) =>
      normalizedMessage.includes(
        alias
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase(),
      ),
    ),
  )

  return match?.key ?? null
}

function zoneMatchesDestination(zone, destination) {
  if (!destination) {
    return false
  }

  const normalizedZone = `${zone.name} ${zone.city}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
  const normalizedDestination = destination
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  if (normalizedDestination === 'centro historico') {
    return normalizedZone.includes('centro historico')
  }

  return normalizedZone.includes(normalizedDestination)
}

function buildChatHistory(messages) {
  return messages.slice(-10).map((message) => ({
    role: message.from === 'user' ? 'user' : 'assistant',
    content: message.text,
  }))
}

function getCurrentTime() {
  return new Intl.DateTimeFormat('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}
