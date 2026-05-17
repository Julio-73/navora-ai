import {
  Activity,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock3,
  Map,
  ShieldCheck,
  Upload,
  Users,
} from 'lucide-react'

export const tourismZones = [
  {
    name: 'Costa Accesible de Miraflores',
    city: 'Lima',
    score: 94,
    status: 'Validada',
    coordinates: [-12.1211, -77.0305],
    type: 'hotspot',
  },
  {
    name: 'Corredor Barranco Puente',
    city: 'Lima',
    score: 72,
    status: 'Incidente detectado',
    coordinates: [-12.149, -77.0219],
    type: 'incident',
  },
  {
    name: 'Ruta Centro Historico',
    city: 'Lima',
    score: 88,
    status: 'Recomendada por IA',
    coordinates: [-12.0464, -77.0428],
    type: 'hotspot',
  },
  {
    name: 'Acceso Plaza de Cusco',
    city: 'Cusco',
    score: 81,
    status: 'Requiere revision',
    coordinates: [-13.5169, -71.9789],
    type: 'review',
  },
  {
    name: 'Flujo de Ingreso Machu Picchu',
    city: 'Cusco',
    score: 76,
    status: 'Alta demanda',
    coordinates: [-13.1631, -72.545],
    type: 'hotspot',
  },
]

export const baseKpis = [
  {
    label: 'Rutas accesibles',
    value: 2418,
    suffix: '',
    delta: '+18%',
    icon: Map,
  },
  {
    label: 'Visitantes asistidos',
    value: 8930,
    suffix: '',
    delta: '+31%',
    icon: Users,
  },
  {
    label: 'Respuesta promedio',
    value: 1.2,
    suffix: 's',
    delta: '-24%',
    icon: Clock3,
  },
  {
    label: 'Alertas resueltas',
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
    title: 'Obstruccion de rampa en Barranco',
    text: 'Reporte ciudadano: bloqueo temporal de vereda cerca del Puente de los Suspiros.',
    zone: 'Barranco',
    severity: 'Media',
  },
  {
    icon: Camera,
    title: 'Analisis de imagen completado',
    text: 'La vista previa de IA detecto senalizacion tactil faltante cerca del malecon de Miraflores.',
    zone: 'Miraflores',
    severity: 'Baja',
  },
  {
    icon: CheckCircle2,
    title: 'Ruta validada',
    text: 'Ruta accesible del Centro Historico aprobada con cobertura de ascensor y rampas.',
    zone: 'Centro Historico',
    severity: 'Resuelto',
  },
  {
    icon: Upload,
    title: 'Reporte turistico recibido',
    text: 'Nota de audio desde la Plaza de Cusco convertida en borrador de revision de accesibilidad.',
    zone: 'Cusco',
    severity: 'Revision',
  },
  {
    icon: Activity,
    title: 'Pico de demanda en vivo',
    text: 'El flujo de ingreso a Machu Picchu muestra un aumento de solicitudes de asistencia.',
    zone: 'Machu Picchu',
    severity: 'Alta',
  },
]

export const chatMessages = [
  {
    from: 'ai',
    text: 'Bienvenido a Rimay AI. Puedo priorizar reportes de accesibilidad desde texto, fotos y notas de voz en zonas turisticas del Peru.',
    time: '09:41',
  },
  {
    from: 'user',
    text: 'No hay acceso para silla de ruedas en esta zona turistica.',
    time: '09:42',
  },
  {
    from: 'ai',
    text: 'Incidente de accesibilidad detectado en Barranco. Severidad: Media. Se genero una sugerencia de escalamiento municipal.',
    time: '09:42',
    meta: 'Vinculado a la cola de incidentes del panel',
  },
  {
    from: 'user',
    text: 'Subi una foto del ingreso cerca del Puente de los Suspiros.',
    time: '09:43',
  },
  {
    from: 'ai',
    text: 'Vista previa de analisis de imagen: sardinel alto, rampa no visible y flujo peatonal estrecho. Accion recomendada: ruta asistida temporal por Bajada de Banos.',
    time: '09:43',
    meta: 'Resultado multimodal simulado',
  },
]

export const suggestedPrompts = [
  'Reportar problema de acceso en Barranco',
  'Buscar ruta de baja pendiente en Centro Historico',
  'Analizar foto de ingreso subida',
]
