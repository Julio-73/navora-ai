import { motion } from 'framer-motion'
import { BarChart3, Bot, Map, ShieldCheck } from 'lucide-react'

import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'

const architecturePillars = [
  {
    icon: ShieldCheck,
    title: 'Clean foundation',
    description: 'Frontend y backend separados para crecer sin mezclar dominios.',
  },
  {
    icon: Bot,
    title: 'AI-ready',
    description: 'Gemini preparado como integración futura, sin lógica prematura.',
  },
  {
    icon: BarChart3,
    title: 'Analytics-ready',
    description: 'Base lista para métricas en tiempo real cuando el MVP lo requiera.',
  },
  {
    icon: Map,
    title: 'Tourism-ready',
    description: 'Leaflet instalado para experiencias geográficas accesibles.',
  },
]

export function FoundationPage() {
  return (
    <section className="premium-grid relative min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.14),transparent_30%)]" />

      <div className="container relative grid min-h-[calc(100vh-4rem)] items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <Badge>Accessibility tourism intelligence</Badge>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight text-foreground sm:text-6xl lg:text-7xl">
            Rimay AI foundation for an inclusive travel platform.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Arquitectura limpia para un MVP de hackathon con React, FastAPI,
            Supabase y una base visual lista para evolucionar hacia IA
            multimodal, mapas accesibles y analítica operacional.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button>Start building</Button>
            <Button variant="outline">Review architecture</Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.55, ease: 'easeOut' }}
          className="grid gap-4"
        >
          {architecturePillars.map((pillar) => {
            const Icon = pillar.icon

            return (
              <article
                key={pillar.title}
                className="rounded-lg border border-border bg-card/80 p-5 shadow-soft backdrop-blur"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-card-foreground">
                      {pillar.title}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
