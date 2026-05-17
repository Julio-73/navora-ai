import { cn } from '@/lib/utils'

export function Badge({ className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur',
        className,
      )}
      {...props}
    />
  )
}
