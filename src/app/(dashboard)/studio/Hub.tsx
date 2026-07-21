import { Image as ImageIcon, ListChecks, Pencil, Terminal } from 'lucide-react'

const promptExample = `Generate an MCH Studio post bundle from this idea.

Idea: <one sentence describing the post idea>

Read and follow the workflow at ~/claude/personal/mch-studio/studio-runs/_skills/studio-generate.md exactly.

Draft one organic post and one hard-ad/social-ad variant, generate one image per variant, append the bundle to studio-runs/posts.json with status: draft, then print:
http://localhost:3001/studio/p/<post-id>`

export function Hub() {
  return (
    <section className="border border-[#d8cdae] bg-white p-5 shadow-[8px_8px_0_#d9a441]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 border border-[#191919] bg-[#191919] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f7d66b]">
            <ListChecks className="h-3.5 w-3.5" />
            Social workflow
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">
            Terminal does the making. Studio holds the drafts.
          </h2>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <WorkflowStep
          icon={<Terminal className="h-4 w-4" />}
          label="1"
          title="Prompt example"
          body="Paste the idea into your local agent. The agent writes the bundle to posts.json."
        />
        <WorkflowStep
          icon={<Pencil className="h-4 w-4" />}
          label="2"
          title="Review and refine text"
          body="Open the saved bundle, compare organic vs hard-ad copy, then refine in the terminal."
        />
        <WorkflowStep
          icon={<ImageIcon className="h-4 w-4" />}
          label="3"
          title="Refine visual asset"
          body="Use the image suggestion as the first pass, then regenerate or replace the asset."
        />
      </div>

      <pre className="mt-5 overflow-auto whitespace-pre-wrap border border-[#d8cdae] bg-[#fff8df] p-4 font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-[#1e211e]">
        {promptExample}
      </pre>
    </section>
  )
}

function WorkflowStep({
  body,
  icon,
  label,
  title,
}: {
  body: string
  icon: React.ReactNode
  label: string
  title: string
}) {
  return (
    <div className="border border-[#eadfbe] bg-[#fff8df] p-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="grid h-7 w-7 place-items-center border border-[#191919] bg-[#191919] text-xs font-bold text-[#f7d66b]">
          {label}
        </span>
        <span className="text-[#6a4b00]">{icon}</span>
      </div>
      <div className="font-[family-name:var(--font-display)] text-sm font-bold text-[#1e211e]">
        {title}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-[#5b6159]">{body}</p>
    </div>
  )
}
