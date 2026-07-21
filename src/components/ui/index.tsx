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
    <div className={clsx('border border-[#d8cdae] bg-white p-6 shadow-[6px_6px_0_#d9a441]', className)}>
      {children}
    </div>
  )
}

// ─── Section Label ─────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold text-[#6a4b00] uppercase tracking-widest mb-4">
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
        'w-full border border-[#d8cdae] bg-[#fff8df] px-4 py-3 text-[#1e211e] placeholder:text-[#8f8a7b] focus:border-[#d9a441] focus:ring-1 focus:ring-[#d9a441] outline-none text-sm',
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
        'w-full border border-[#d8cdae] bg-[#fff8df] px-4 py-3 text-[#1e211e] placeholder:text-[#8f8a7b] focus:border-[#d9a441] focus:ring-1 focus:ring-[#d9a441] outline-none text-sm resize-none',
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
        'border border-[#d8cdae] bg-[#fff8df] px-4 py-2.5 text-[#1e211e] text-sm focus:border-[#d9a441] focus:ring-1 focus:ring-[#d9a441] outline-none',
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
        'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        {
          primary: 'border border-[#191919] bg-[#191919] text-[#f7d66b] hover:shadow-[4px_4px_0_#d9a441]',
          secondary: 'border border-[#d8cdae] bg-white text-[#1e211e] hover:shadow-[4px_4px_0_#d9a441]',
          danger: 'bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-800',
          ghost: 'text-muted hover:text-foreground hover:bg-surface-2',
          success: 'border border-[#d8bf62] bg-[#fff2bd] text-[#6a4b00] hover:bg-[#f6eac2]',
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
          ? 'bg-[#fff2bd] border-[#d8bf62] text-[#6a4b00]'
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
          green: 'bg-[#fff2bd] text-[#6a4b00]',
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
