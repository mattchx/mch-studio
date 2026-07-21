'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Card } from '@/components/ui'
import { Palette, Mail } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffdf7] p-4 text-[#1e211e]">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <Palette className="w-6 h-6 text-[#d9a441]" />
          <span className="text-lg font-semibold">MCH Studio</span>
        </div>

        <Card>
          {sent ? (
            <div className="text-center space-y-3">
              <Mail className="w-8 h-8 text-[#d9a441] mx-auto" />
              <p className="text-sm text-foreground">Check your email</p>
              <p className="text-xs text-muted">
                We sent a magic link to <span className="text-foreground">{email}</span>
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-xs text-muted hover:text-foreground transition-colors cursor-pointer"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <Button type="submit" disabled={loading} className="w-full justify-center">
                {loading ? 'Sending...' : 'Send magic link'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}
