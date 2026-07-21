'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export function CopyVariantButton({
  label,
  text,
}: {
  label: string
  text: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
      } else {
        fallbackCopy(text)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      try {
        fallbackCopy(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      } catch {
        setCopied(false)
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex h-8 items-center justify-center gap-2 border border-[#1e211e] bg-white px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1e211e] transition hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_#191919]"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          {label}
        </>
      )}
    </button>
  )
}

function fallbackCopy(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}
