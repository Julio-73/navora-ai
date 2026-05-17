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
    name: 'Miraflores Accessible Coast',
    city: 'Lima',
    score: 94,
    status: 'Validated',
    coordinates: [-12.1211, -77.0305],
    type: 'hotspot',
  },
  {
    name: 'Barranco Bridge Corridor',
    city: 'Lima',
    score: 72,
    status: 'Incident detected',
    coordinates: [-12.149, -77.0219],
    type: 'incident',
  },
  {
    name: 'Centro Historico Route',
    city: 'Lima',
    score: 88,
    status: 'AI recommended',
    coordinates: [-12.0464, -77.0428],
    type: 'hotspot',
  },
  {
    name: 'Cusco Plaza Access',
    city: 'Cusco',
    score: 81,
    status: 'Needs review',
    coordinates: [-13.5169, -71.9789],
    type: 'review',
  },
  {
    name: 'Machu Picchu Entry Flow',
    city: 'Cusco',
    score: 76,
    status: 'High demand',
    coordinates: [-13.1631, -72.545],
    type: 'hotspot',
  },
]

export const baseKpis = [
  {
    label: 'Accessible routes',
    value: 2418,
    suffix: '',
    delta: '+18%',
    icon: Map,
  },
  {
    label: 'Visitors assisted',
    value: 8930,
    suffix: '',
    delta: '+31%',
    icon: Users,
  },
  {
    label: 'Avg response',
    value: 1.2,
    suffix: 's',
    delta: '-24%',
    icon: Clock3,
  },
  {
    label: 'Resolved alerts',
    value: 96,
    suffix: '%',
    delta: '+12%',
    icon: ShieldCheck,
  },
]

export const accessibilityTrend = [
  { label: 'Mon', Miraflores: 34, Barranco: 22, Cusco: 18 },
  { label: 'Tue', Miraflores: 48, Barranco: 31, Cusco: 24 },
  { label: 'Wed', Miraflores: 44, Barranco: 38, Cusco: 29 },
  { label: 'Thu', Miraflores: 61, Barranco: 42, Cusco: 36 },
  { label: 'Fri', Miraflores: 76, Barranco: 54, Cusco: 44 },
  { label: 'Sat', Miraflores: 91, Barranco: 63, Cusco: 58 },
  { label: 'Sun', Miraflores: 86, Barranco: 59, Cusco: 62 },
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
    title: 'Barranco ramp obstruction',
    text: 'Citizen report: temporary sidewalk blockage near Puente de los Suspiros.',
    zone: 'Barranco',
    severity: 'Medium',
  },
  {
    icon: Camera,
    title: 'Image analysis completed',
    text: 'AI preview found missing tactile signage near Miraflores boardwalk access.',
    zone: 'Miraflores',
    severity: 'Low',
  },
  {
    icon: CheckCircle2,
    title: 'Route validated',
    text: 'Centro Historico accessible path approved with elevator and ramp coverage.',
    zone: 'Centro Historico',
    severity: 'Resolved',
  },
  {
    icon: Upload,
    title: 'Tourist report received',
    text: 'Audio note from Cusco Plaza converted into an accessibility review draft.',
    zone: 'Cusco',
    severity: 'Review',
  },
  {
    icon: Activity,
    title: 'Live demand spike',
    text: 'Machu Picchu entry flow is showing elevated assistance requests.',
    zone: 'Machu Picchu',
    severity: 'High',
  },
]

export const chatMessages = [
  {
    from: 'ai',
    text: 'Welcome to Rimay AI. I can triage accessibility reports from text, photos and voice notes across Peru tourism zones.',
    time: '09:41',
  },
  {
    from: 'user',
    text: 'There is no wheelchair access in this tourist area.',
    time: '09:42',
  },
  {
    from: 'ai',
    text: 'Accessibility incident detected in Barranco district. Severity: Medium. Suggested municipal escalation generated.',
    time: '09:42',
    meta: 'Linked to dashboard incident queue',
  },
  {
    from: 'user',
    text: 'I uploaded a photo of the entrance near Puente de los Suspiros.',
    time: '09:43',
  },
  {
    from: 'ai',
    text: 'Image analysis preview: steep curb, no visible ramp, narrow pedestrian flow. Recommended action: temporary assisted route via Bajada de Banos.',
    time: '09:43',
    meta: 'Simulated multimodal result',
  },
]

export const suggestedPrompts = [
  'Report wheelchair access issue in Barranco',
  'Find low-slope route in Centro Historico',
  'Analyze uploaded entrance photo',
]
