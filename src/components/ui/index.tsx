import clsx from 'clsx'

// ─── Page Header ───────────────────────────────────────────
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-[25px] font-[family-name:var(--font-display)] font-bold text-foreground">{title}</h1>
        {description && <p className="text-muted text-sm mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// ─── Card ──────────────────────────────────────────────────
export function Card({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={clsx('bg-surface border border-border rounded-2xl p-6', className)}>
      {children}
    </div>
  )
}

// ─── Section Label ─────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold text-accent uppercase tracking-widest mb-4">
      {children}
    </div>
  )
}

// ─── Field ─────────────────────────────────────────────────
export function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}

// ─── Input ─────────────────────────────────────────────────
export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        'w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm',
        className
      )}
    />
  )
}

// ─── Textarea ──────────────────────────────────────────────
export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={clsx(
        'w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm resize-none',
        className
      )}
    />
  )
}

// ─── Select ────────────────────────────────────────────────
export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className={clsx(
        'bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none',
        className
      )}
    >
      {children}
    </select>
  )
}

// ─── Button ────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'

export function Button({
  variant = 'primary',
  children,
  className,
  ...props
}: {
  variant?: ButtonVariant
  children: React.ReactNode
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        {
          primary: 'bg-accent hover:bg-accent-hover text-white',
          secondary: 'bg-surface-2 hover:bg-border text-foreground border border-border',
          danger: 'bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-800',
          ghost: 'text-muted hover:text-foreground hover:bg-surface-2',
          success: 'bg-green-900/20 hover:bg-green-900/40 text-green-400 border border-green-800',
        }[variant],
        className
      )}
    >
      {children}
    </button>
  )
}

// ─── Status Message ────────────────────────────────────────
export function StatusMessage({
  type,
  message,
}: {
  type: 'success' | 'error'
  message: string
}) {
  return (
    <div
      className={clsx(
        'rounded-xl px-4 py-3 text-sm border',
        type === 'success'
          ? 'bg-green-900/20 border-green-800 text-green-400'
          : 'bg-red-900/20 border-red-800 text-red-400'
      )}
    >
      {message}
    </div>
  )
}

// ─── Badge ─────────────────────────────────────────────────
export function Badge({
  children,
  color = 'default',
  className,
}: {
  children: React.ReactNode
  color?: 'default' | 'green' | 'yellow' | 'red' | 'blue' | 'purple'
  className?: string
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          default: 'bg-surface-2 text-muted',
          green: 'bg-green-900/30 text-green-400',
          yellow: 'bg-yellow-900/30 text-yellow-400',
          red: 'bg-red-900/30 text-red-400',
          blue: 'bg-blue-900/30 text-blue-400',
          purple: 'bg-purple-900/30 text-purple-400',
        }[color],
        className
      )}
    >
      {children}
    </span>
  )
}
