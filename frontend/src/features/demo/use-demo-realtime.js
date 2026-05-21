import { useEffect, useMemo, useState } from 'react'

import { baseKpis, incidentQueue } from '@/features/demo/demo-data'

export function useDemoRealtime() {
  const [tick, setTick] = useState(0)
  const [feed, setFeed] = useState(() => incidentQueue.slice(0, 3))

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTick((current) => current + 1)
      setFeed((current) => {
        const nextIncident = incidentQueue[(tick + 3) % incidentQueue.length]
        return [nextIncident, ...current].slice(0, 4)
      })
    }, 4200)

    return () => window.clearInterval(intervalId)
  }, [tick])

  const kpis = useMemo(
    () =>
      baseKpis.map((kpi, index) => ({
        ...kpi,
        value:
          kpi.label === 'Barreras atendidas'
            ? 104
            : kpi.suffix === 's'
              ? Math.max(0.9, kpi.value - (tick % 4) * 0.04)
              : kpi.value + (tick % 8) * (index + 1),
      })),
    [tick],
  )

  const liveStage = tick % incidentQueue.length

  return { feed, kpis, liveStage, tick }
}
