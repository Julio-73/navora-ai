import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Accessibility, Menu, Sparkles, X } from 'lucide-react'

import { mainNavigation } from '@/config/navigation'
import { Button } from '@/shared/ui/button'

export function AppShell() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function handleNavigation(event, href) {
    if (!href.startsWith('#')) {
      setIsMobileMenuOpen(false)
      return
    }

    event.preventDefault()

    const target = document.querySelector(href)

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.replaceState(null, '', href)
    }

    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/72 backdrop-blur-2xl">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[0_0_36px_rgba(45,212,191,0.32)]">
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
                onClick={(event) => handleNavigation(event, item.href)}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              IA activa
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-label="Abrir o cerrar menu de navegacion"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen ? (
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="border-t border-white/10 bg-background/95 px-4 py-3 shadow-soft backdrop-blur-2xl md:hidden"
            >
              <div className="mx-auto grid max-w-md gap-2">
                {mainNavigation.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(event) => handleNavigation(event, item.href)}
                    className="rounded-md border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-white/[0.07] hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
