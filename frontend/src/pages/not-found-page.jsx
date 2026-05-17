import { Link } from 'react-router-dom'

import { Button } from '@/shared/ui/button'

export function NotFoundPage() {
  return (
    <section className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-3 text-4xl font-semibold">Ruta no encontrada</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Esta ruta todavia no forma parte de la experiencia principal del MVP.
      </p>
      <Button asChild className="mt-8">
        <Link to="/">Volver a la experiencia principal</Link>
      </Button>
    </section>
  )
}
