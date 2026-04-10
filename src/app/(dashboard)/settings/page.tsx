import { PageHeader, Card } from '@/components/ui'

export default function SettingsPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Settings"
        description="MCH Studio configuration"
      />
      <Card>
        <p className="text-sm text-muted">Settings coming soon — Stripe billing, notification preferences, scheduled generation.</p>
      </Card>
    </div>
  )
}
