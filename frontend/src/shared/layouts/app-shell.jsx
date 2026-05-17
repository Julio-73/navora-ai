import { Outlet } from 'react-router-dom'
import { Accessibility, Sparkles } from 'lucide-react'

import { mainNavigation } from '@/config/navigation'
import { Button } from '@/shared/ui/button'

export function AppShell() {
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Accessibility className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold tracking-wide">
              Rimay AI
            </span>
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            {mainNavigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <Button variant="outline" size="sm">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            MVP Ready
          </Button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
