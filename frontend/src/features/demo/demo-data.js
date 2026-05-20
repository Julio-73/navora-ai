import {
  Accessibility,
  Activity,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock3,
  Ear,
  Eye,
  Heart,
  Map,
  ShieldCheck,
  Upload,
  UserRound,
  Users,
} from 'lucide-react'

export const tourismZones = [
  {
    name: 'Malecon accesible de Miraflores',
    city: 'Lima',
    score: 94,
    status: 'Lista para explorar',
    coordinates: [-12.1211, -77.0305],
    type: 'hotspot',
  },
  {
    name: 'Ruta amable en Barranco',
    city: 'Lima',
    score: 72,
    status: 'Barrera reportada',
    coordinates: [-12.149, -77.0219],
    type: 'incident',
  },
  {
    name: 'Paseo accesible Centro Historico',
    city: 'Lima',
    score: 88,
    status: 'Sugerida por IA',
    coordinates: [-12.0464, -77.0428],
    type: 'hotspot',
  },
  {
    name: 'Ingreso inclusivo Plaza de Cusco',
    city: 'Cusco',
    score: 81,
    status: 'En revision',
    coordinates: [-13.5169, -71.9789],
    type: 'review',
  },
  {
    name: 'Acompanamiento Machu Picchu',
    city: 'Cusco',
    score: 76,
    status: 'Alta asistencia',
    coordinates: [-13.1631, -72.545],
    type: 'hotspot',
  },
]

export const baseKpis = [
  {
    label: 'Rutas sin barreras',
    value: 2418,
    suffix: '',
    delta: '+18%',
    icon: Map,
  },
  {
    label: 'Personas orientadas',
    value: 8930,
    suffix: '',
    delta: '+31%',
    icon: Users,
  },
  {
    label: 'Tiempo de ayuda',
    value: 1.2,
    suffix: 's',
    delta: '-24%',
    icon: Clock3,
  },
  {
    label: 'Barreras atendidas',
    value: 96,
    suffix: '%',
    delta: '+12%',
    icon: ShieldCheck,
  },
]

export const accessibilityTrend = [
  { label: 'Lun', Miraflores: 34, Barranco: 22, Cusco: 18 },
  { label: 'Mar', Miraflores: 48, Barranco: 31, Cusco: 24 },
  { label: 'Mie', Miraflores: 44, Barranco: 38, Cusco: 29 },
  { label: 'Jue', Miraflores: 61, Barranco: 42, Cusco: 36 },
  { label: 'Vie', Miraflores: 76, Barranco: 54, Cusco: 44 },
  { label: 'Sab', Miraflores: 91, Barranco: 63, Cusco: 58 },
  { label: 'Dom', Miraflores: 86, Barranco: 59, Cusco: 62 },
]

export const routeQuality = [
  { label: 'Miraflores', value: 94 },
  { label: 'Barranco', value: 72 },
  { label: 'Cusco', value: 81 },
  { label: 'Machu Picchu', value: 76 },
]

export const incidentQueue = [
  {
    icon: AlertTriangle,
    title: 'Rampa bloqueada en Barranco',
    text: 'Una persona reporto una vereda bloqueada cerca del Puente de los Suspiros.',
    zone: 'Barranco',
    severity: 'Media',
  },
  {
    icon: Camera,
    title: 'Foto revisada por IA',
    text: 'La imagen sugiere falta de senalizacion tactil cerca del malecon de Miraflores.',
    zone: 'Miraflores',
    severity: 'Baja',
  },
  {
    icon: CheckCircle2,
    title: 'Ruta lista para visitar',
    text: 'El paseo del Centro Historico cuenta con ascensor cercano y rampas verificadas.',
    zone: 'Centro Historico',
    severity: 'Resuelto',
  },
  {
    icon: Upload,
    title: 'Voz convertida en ayuda',
    text: 'Una nota de audio desde la Plaza de Cusco se convirtio en una guia de accesibilidad.',
    zone: 'Cusco',
    severity: 'Revision',
  },
  {
    icon: Activity,
    title: 'Mas personas piden orientacion',
    text: 'El ingreso a Machu Picchu muestra mas solicitudes de apoyo para moverse con seguridad.',
    zone: 'Machu Picchu',
    severity: 'Alta',
  },
]

export const chatMessages = [
  {
    from: 'ai',
    text: 'Hola, soy NAVORA AI. Puedo ayudarte a encontrar rutas accesibles, entender barreras y reportar problemas usando texto, fotos o voz.',
    time: '09:41',
  },
  {
    from: 'user',
    text: 'No encuentro acceso para silla de ruedas en esta zona turistica.',
    time: '09:42',
  },
  {
    from: 'ai',
    text: 'Gracias por avisar. Identifique una barrera de accesibilidad en Barranco. Puedo sugerir una ruta alterna y dejar el reporte listo para seguimiento.',
    time: '09:42',
    meta: 'Conectado con la guia visual de accesibilidad',
  },
  {
    from: 'user',
    text: 'Subi una foto del ingreso cerca del Puente de los Suspiros.',
    time: '09:43',
  },
  {
    from: 'ai',
    text: 'Vista previa: el ingreso parece estrecho y el sardinel es alto. Te recomiendo una alternativa mas amable por Bajada de Banos.',
    time: '09:43',
    meta: 'Analisis visual de accesibilidad',
  },
]

export const suggestedPrompts = [
  'Muestrame el Puente de los Suspiros',
  'Quiero una ruta accesible en Barranco',
  'Buscar camino de baja pendiente en Centro Historico',
  'Revisar una foto de ingreso',
]

export const culturalExperiences = [
  {
    place: 'Barranco',
    title: 'Puente de los Suspiros',
    description:
      'Un paseo bohemio donde la musica, los balcones y la brisa del Pacifico hacen que cada paso se sienta como una historia compartida.',
    emotion: 'Romantico, artistico y sereno',
    accessibility: 'Ruta sugerida con pendientes suaves y puntos de descanso cercanos.',
    ambience: 'Atardecer con guitarra criolla y luces calidas',
    idealTime: '5:30 p.m.',
  },
  {
    place: 'Miraflores',
    title: 'Malecon y vista al mar',
    description:
      'Un borde verde sobre el oceano para respirar, mirar el horizonte y descubrir Lima desde un recorrido amplio y contemplativo.',
    emotion: 'Libre, abierto y luminoso',
    accessibility: 'Veredas amplias, cruces visibles y zonas de pausa accesibles.',
    ambience: 'Brisa marina, jardines y sonido suave del mar',
    idealTime: '9:00 a.m.',
  },
  {
    place: 'Cusco',
    title: 'Plaza y memoria andina',
    description:
      'Un lugar donde piedra, historia y comunidad se encuentran. NAVORA acompana el recorrido con contexto claro y ritmo amable.',
    emotion: 'Profundo, ancestral y vivo',
    accessibility: 'Recomendado avanzar por tramos cortos y evitar calles de alta pendiente.',
    ambience: 'Campanas, piedra antigua y energia de plaza',
    idealTime: '8:30 a.m.',
  },
  {
    place: 'Machu Picchu',
    title: 'Santuario entre montanas',
    description:
      'Una experiencia de asombro: niebla, terrazas y montanas que invitan a sentir el patrimonio con respeto y calma.',
    emotion: 'Majestuoso, silencioso e inolvidable',
    accessibility: 'Planificar asistencia, descansos y rutas autorizadas de menor esfuerzo.',
    ambience: 'Niebla ligera, viento andino y contemplacion',
    idealTime: '6:30 a.m.',
  },
]

export const explorationProfiles = [
  {
    label: 'Silla de ruedas',
    icon: Accessibility,
    recommendation: 'Prioriza rampas, pendientes suaves y descansos cercanos.',
  },
  {
    label: 'Baja vision',
    icon: Eye,
    recommendation: 'Activa referencias claras, contraste alto y puntos tactiles.',
  },
  {
    label: 'Adulto mayor',
    icon: UserRound,
    recommendation: 'Sugiere tramos cortos, sombra y bancas disponibles.',
  },
  {
    label: 'Sensibilidad auditiva',
    icon: Ear,
    recommendation: 'Recomienda horarios tranquilos y zonas de menor ruido.',
  },
  {
    label: 'Exploracion general',
    icon: Heart,
    recommendation: 'Equilibra historia, accesibilidad y ritmo de paseo.',
  },
]

export const heritageTimeline = [
  'Una turista cuenta una barrera por voz',
  'NAVORA entiende la necesidad y sugiere una alternativa',
  'El mapa resalta una ruta mas amable',
  'El panel muestra el impacto para otros visitantes',
  'La experiencia cultural se vuelve mas accesible',
]
