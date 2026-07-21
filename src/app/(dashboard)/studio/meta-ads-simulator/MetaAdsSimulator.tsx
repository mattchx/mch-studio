'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  ChevronDown,
  ChevronRight,
  DollarSign,
  Edit3,
  Eye,
  LogOut,
  Megaphone,
  Plus,
  ShoppingCart,
  Trash2,
  Trophy,
  UserPlus,
  X,
} from 'lucide-react'

type Screen = 'challenges' | 'campaigns' | 'adsets' | 'ads'
type Platform = 'facebook' | 'instagram'
type Objective = 'traffic' | 'engagement' | 'sales'
type Delivery = 'Active' | 'Incomplete'
type Difficulty = 'Intermediate' | 'Advanced'

type Challenge = {
  id: string
  title: string
  client: string
  difficulty: Difficulty
  objective: Objective
  budgetOptimization: 'ABO' | 'CBO'
  budget: string
  performanceGoal: 'link_clicks' | 'conversions'
  gender?: string
  target: string
  prompt: string
  icon: ReactNode
  accent: string
  primaryText: string
  headline: string
  cta: string
  url: string
}

type Campaign = {
  id: string
  name: string
  delivery: Delivery
  objective: Objective
  budget: string
}

type AdSet = {
  id: string
  name: string
  delivery: Delivery
  goal: string
  budget: string
  targeting: string
}

type Ad = {
  id: string
  name: string
  delivery: Delivery
  headline: string
  cta: string
  creative: string
}

const challenges: Challenge[] = [
  {
    id: 'bella-vista',
    title: 'Bella Vista Restaurant - Engagement Challenge',
    client: 'Bella Vista Restaurant',
    difficulty: 'Intermediate',
    objective: 'engagement',
    budgetOptimization: 'ABO',
    budget: '$50-$75 (daily)',
    performanceGoal: 'link_clicks',
    target: "food enthusiasts in local area",
    prompt: "Maximize social engagement for a local restaurant's new menu launch.",
    icon: <UserPlus className="h-7 w-7" />,
    accent: '#e65b1a',
    primaryText:
      'A new menu is landing at Bella Vista this week.\n\nFresh seasonal dishes, a few returning favorites, and a reason to make dinner plans before the weekend fills up.',
    headline: 'New menu at Bella Vista',
    cta: 'Learn More',
    url: 'https://bellavista.example',
  },
  {
    id: 'taskflow-pro',
    title: 'TaskFlow Pro - Low Budget Challenge',
    client: 'TaskFlow Pro',
    difficulty: 'Advanced',
    objective: 'traffic',
    budgetOptimization: 'ABO',
    budget: '$5-$15 (daily)',
    performanceGoal: 'link_clicks',
    gender: 'Male only',
    target: 'productivity-focused male professionals aged 25-44',
    prompt:
      'Launch a new productivity app with minimal marketing budget using advanced targeting strategies.',
    icon: <DollarSign className="h-7 w-7" />,
    accent: '#d9480f',
    primaryText:
      'TaskFlow Pro helps busy operators turn scattered tasks into a simple daily plan.\n\nStart with the work that matters, protect your focus, and stop rebuilding your to-do list every morning.',
    headline: 'Focus your workday',
    cta: 'Sign Up',
    url: 'https://taskflow.example',
  },
  {
    id: 'skillmaster',
    title: 'SkillMaster Academy - Retargeting Challenge',
    client: 'SkillMaster Academy',
    difficulty: 'Advanced',
    objective: 'sales',
    budgetOptimization: 'CBO',
    budget: '$200-$300 (lifetime)',
    performanceGoal: 'conversions',
    target: 'segmented retargeting audiences with custom messaging',
    prompt:
      'Create a multi-audience retargeting campaign for an online course platform with sophisticated targeting.',
    icon: <ShoppingCart className="h-7 w-7" />,
    accent: '#f97316',
    primaryText:
      'Still thinking about the course?\n\nSkillMaster Academy gives you structured lessons, practical assignments, and a clear path from browsing to building the skill.',
    headline: 'Finish the skill you started',
    cta: 'Get Offer',
    url: 'https://skillmaster.example',
  },
]

const objectiveStyles: Record<Objective, string> = {
  engagement: 'border-[#d9a441] bg-white text-[#6a4b00]',
  sales: 'border-[#d9a441] bg-[#fff2bd] text-[#1e211e]',
  traffic: 'border-[#191919] bg-[#191919] text-[#f7d66b]',
}

const difficultyStyles: Record<Difficulty, string> = {
  Advanced: 'bg-[#ffdfe2] text-[#991b1b]',
  Intermediate: 'bg-[#fff2bd] text-[#6a4b00]',
}

export function MetaAdsSimulator() {
  const [screen, setScreen] = useState<Screen>('challenges')
  const [selectedId, setSelectedId] = useState(challenges[0].id)
  const [modalOpen, setModalOpen] = useState(false)
  const [validationOpen, setValidationOpen] = useState(false)
  const [platform, setPlatform] = useState<Platform>('facebook')

  const selected = challenges.find((challenge) => challenge.id === selectedId) ?? challenges[0]
  const [adName, setAdName] = useState(`${selected.client.replaceAll(' ', '_')}_Static_Feed`)
  const [businessName, setBusinessName] = useState(selected.client)
  const [primaryText, setPrimaryText] = useState(selected.primaryText)
  const [headline, setHeadline] = useState(selected.headline)
  const [cta, setCta] = useState(selected.cta)
  const [websiteUrl, setWebsiteUrl] = useState(selected.url)
  const [utm, setUtm] = useState(`?utm_source=facebook&utm_medium=display&utm_campaign=${selected.id}`)

  const campaign: Campaign = useMemo(
    () => ({
      budget: selected.budgetOptimization === 'ABO' ? 'Using Ad Set Budget' : selected.budget,
      delivery: 'Incomplete',
      id: `${selected.id}-campaign`,
      name: selected.title,
      objective: selected.objective,
    }),
    [selected],
  )

  const adSet: AdSet = useMemo(
    () => ({
      budget: selected.budget,
      delivery: 'Active',
      goal: selected.performanceGoal,
      id: `${selected.id}-ad-set`,
      name: `${selected.client} Core ${selected.objective}`,
      targeting: selected.target,
    }),
    [selected],
  )

  const ad: Ad = useMemo(
    () => ({
      creative: primaryText.split('\n').filter(Boolean)[0] ?? selected.prompt,
      cta,
      delivery: 'Incomplete',
      headline,
      id: `${selected.id}-ad`,
      name: adName,
    }),
    [adName, cta, headline, primaryText, selected],
  )

  function loadChallenge(challenge: Challenge, nextScreen: Screen = 'campaigns') {
    setSelectedId(challenge.id)
    setAdName(`${challenge.client.replaceAll(' ', '_')}_Static_Feed`)
    setBusinessName(challenge.client)
    setPrimaryText(challenge.primaryText)
    setHeadline(challenge.headline)
    setCta(challenge.cta)
    setWebsiteUrl(challenge.url)
    setUtm(`?utm_source=facebook&utm_medium=display&utm_campaign=${challenge.id}`)
    setScreen(nextScreen)
  }

  const title = screen === 'challenges'
    ? 'Practice challenges'
    : screen === 'campaigns'
      ? 'Campaigns'
      : screen === 'adsets'
        ? `${selected.title} Ad Sets`
        : `${adSet.name} Ads`

  const description = screen === 'challenges'
    ? 'Ads practice is separate from Studio social production. Pick a sandbox brief and build it.'
    : screen === 'campaigns'
      ? 'Create the campaign structure for this practice brief.'
      : screen === 'adsets'
        ? 'Tune budget, goal, and targeting for the selected challenge.'
        : 'Edit creative and preview the practice ad.'

  return (
    <div className="-mx-6 -my-8 min-h-[calc(100vh-3.5rem)] bg-[#fffdf7] text-[#1e211e]">
      <div className="grid min-h-[calc(100vh-3.5rem)] grid-cols-1 lg:grid-cols-[292px_minmax(0,1fr)]">
        <aside className="border-r border-[#d8cdae] bg-white px-4 py-6 lg:min-h-full">
          <div className="mb-10 flex items-center gap-4 px-2">
            <div className="grid h-10 w-10 place-items-center border border-[#191919] bg-[#191919] font-[family-name:var(--font-display)] text-lg font-bold text-[#f7d66b]">
              M
            </div>
            <div>
              <div className="font-[family-name:var(--font-display)] text-xl font-bold">
                Ads Manager
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#596157]">
                Practice simulator
              </div>
            </div>
          </div>

          <nav className="space-y-3">
            <SidebarButton active={screen !== 'challenges'} icon={<Megaphone className="h-5 w-5" />} onClick={() => setScreen('campaigns')}>
              Campaigns
            </SidebarButton>
            <SidebarButton active={screen === 'challenges'} icon={<Trophy className="h-5 w-5" />} onClick={() => setScreen('challenges')}>
              Challenges
            </SidebarButton>
          </nav>

          <div className="mt-16 border border-[#eadfbe] bg-[#fff8df] p-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#596157]">
              Lane
            </div>
            <div className="mt-1 text-sm font-bold">Ads practice only</div>
            <p className="mt-2 text-xs leading-relaxed text-[#5b6159]">
              These briefs do not write to social bundles or publishing drafts.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border border-[#eadfbe] bg-white p-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center border border-[#d8cdae] bg-[#fff8df] text-lg">
                m
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold">mattcharlesh@gmail.c...</div>
                <div className="text-sm text-[#5b6159]">Student</div>
              </div>
            </div>
            <LogOut className="h-5 w-5 shrink-0" />
          </div>
        </aside>

        <main className="overflow-hidden p-5 md:p-8">
          <header className="mb-6 border border-[#d8cdae] bg-white p-6 shadow-[8px_8px_0_#d9a441]">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-lg">
              <Crumb onClick={() => setScreen('challenges')}>Challenges</Crumb>
              {screen !== 'challenges' && (
                <>
                  <ChevronRight className="h-5 w-5 text-[#9aa097]" />
                  <Crumb onClick={() => setScreen('campaigns')}>Campaigns</Crumb>
                </>
              )}
              {(screen === 'adsets' || screen === 'ads') && (
                <>
                  <ChevronRight className="h-5 w-5 text-[#9aa097]" />
                  <Crumb onClick={() => setScreen('adsets')}>{selected.title} Ad Sets</Crumb>
                </>
              )}
              {screen === 'ads' && (
                <>
                  <ChevronRight className="h-5 w-5 text-[#9aa097]" />
                  <span className="font-bold">{adSet.name} Ads</span>
                </>
              )}
            </div>
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold leading-tight md:text-4xl">
                  {title}
                </h1>
                <p className="mt-2 max-w-3xl text-lg leading-relaxed text-[#5b6159]">
                  {description}
                </p>
              </div>
              <HeaderAction
                screen={screen}
                onCreate={() => {
                  if (screen === 'challenges') loadChallenge(selected)
                  else if (screen === 'campaigns') setScreen('adsets')
                  else if (screen === 'adsets') setScreen('ads')
                  else setModalOpen(true)
                }}
              />
            </div>
          </header>

          {screen === 'challenges' ? (
            <ChallengeGrid
              selectedId={selected.id}
              onSelect={(challenge) => loadChallenge(challenge, 'campaigns')}
              onValidate={(challenge) => {
                loadChallenge(challenge, 'campaigns')
                setValidationOpen(true)
              }}
            />
          ) : (
            <section className="overflow-hidden border border-[#d8cdae] bg-white shadow-[8px_8px_0_#d9a441]">
              {screen === 'campaigns' && <CampaignTable campaign={campaign} onEdit={() => setScreen('adsets')} />}
              {screen === 'adsets' && <AdSetTable adSet={adSet} onEdit={() => setScreen('ads')} />}
              {screen === 'ads' && <AdTable ad={ad} onEdit={() => setModalOpen(true)} />}
            </section>
          )}

          {screen !== 'challenges' && (
            <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
              <InstructionsPanel challenge={selected} />
              <button
                type="button"
                onClick={() => setValidationOpen(true)}
                className="inline-flex items-center justify-center gap-3 border border-[#191919] bg-white px-5 py-4 text-lg font-bold hover:shadow-[5px_5px_0_#d9a441]"
              >
                <Trophy className="h-5 w-5" />
                Validate challenge
              </button>
            </section>
          )}
        </main>
      </div>

      {modalOpen && (
        <EditAdModal
          adName={adName}
          businessName={businessName}
          challenge={selected}
          cta={cta}
          headline={headline}
          onClose={() => setModalOpen(false)}
          platform={platform}
          primaryText={primaryText}
          setAdName={setAdName}
          setBusinessName={setBusinessName}
          setCta={setCta}
          setHeadline={setHeadline}
          setPlatform={setPlatform}
          setPrimaryText={setPrimaryText}
          setUtm={setUtm}
          setWebsiteUrl={setWebsiteUrl}
          utm={utm}
          websiteUrl={websiteUrl}
        />
      )}

      {validationOpen && (
        <ValidationModal
          challenge={selected}
          cta={cta}
          headline={headline}
          primaryText={primaryText}
          onClose={() => setValidationOpen(false)}
        />
      )}
    </div>
  )
}

function HeaderAction({ onCreate, screen }: { onCreate: () => void; screen: Screen }) {
  const label = screen === 'challenges'
    ? 'Start Selected'
    : screen === 'campaigns'
      ? 'Create Ad Set'
      : screen === 'adsets'
        ? 'Create Ad'
        : 'Edit Ad'

  return (
    <button
      type="button"
      onClick={onCreate}
      className="inline-flex h-14 w-fit items-center justify-center gap-4 border border-[#191919] bg-[#191919] px-7 text-xl font-bold text-[#f7d66b] transition hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[5px_5px_0_#d9a441]"
    >
      <Plus className="h-6 w-6" />
      {label}
    </button>
  )
}

function ChallengeGrid({
  onSelect,
  onValidate,
  selectedId,
}: {
  onSelect: (challenge: Challenge) => void
  onValidate: (challenge: Challenge) => void
  selectedId: string
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-3">
      {challenges.map((challenge) => (
        <article
          key={challenge.id}
          className={`border bg-white p-6 shadow-[6px_6px_0_#d9a441] ${
            selectedId === challenge.id ? 'border-[#191919]' : 'border-[#d8cdae]'
          }`}
        >
          <div className="mb-6 grid grid-cols-[56px_1fr] gap-4">
            <div className="grid h-14 w-14 place-items-center bg-[#fff2df] text-[#e65b1a]">
              {challenge.icon}
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold leading-tight">
                {challenge.title}
              </h2>
              <span className={`mt-2 inline-flex px-4 py-1 text-sm font-bold ${difficultyStyles[challenge.difficulty]}`}>
                {challenge.difficulty}
              </span>
            </div>
          </div>

          <p className="min-h-[68px] text-lg leading-snug text-[#5b6159]">{challenge.prompt}</p>

          <dl className="mt-6 space-y-3 text-base text-[#6b7280]">
            <Spec label="Objective" value={challenge.objective} />
            <Spec label="Budget Optimization" value={challenge.budgetOptimization} />
            <Spec label="Budget" value={challenge.budget} />
            <Spec label="Performance Goal" value={challenge.performanceGoal} />
            {challenge.gender && <Spec label="Gender" value={challenge.gender} />}
            <Spec label="Target" value={challenge.target} />
          </dl>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onSelect(challenge)}
              className="border border-[#191919] bg-[#191919] px-5 py-3 text-lg font-bold text-[#f7d66b] hover:shadow-[4px_4px_0_#d9a441]"
            >
              View Instructions
            </button>
            <button
              type="button"
              onClick={() => onValidate(challenge)}
              className="inline-flex items-center gap-3 border border-[#d8cdae] bg-white px-5 py-3 text-lg font-bold hover:shadow-[4px_4px_0_#d9a441]"
            >
              <Trophy className="h-5 w-5" />
              Validate
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="inline font-bold text-[#596157]">{label}: </dt>
      <dd className="inline">{value}</dd>
    </div>
  )
}

function InstructionsPanel({ challenge }: { challenge: Challenge }) {
  return (
    <div className="border border-[#d8cdae] bg-white p-5 shadow-[5px_5px_0_#d9a441]">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#596157]">
        Practice brief
      </div>
      <h2 className="font-[family-name:var(--font-display)] text-xl font-bold">
        {challenge.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[#5b6159]">{challenge.prompt}</p>
      <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
        <Spec label="Objective" value={challenge.objective} />
        <Spec label="Budget" value={challenge.budget} />
        <Spec label="Optimization" value={challenge.budgetOptimization} />
        <Spec label="Goal" value={challenge.performanceGoal} />
      </div>
    </div>
  )
}

function CampaignTable({ campaign, onEdit }: { campaign: Campaign; onEdit: () => void }) {
  return (
    <TableShell columns={['Off / On', 'Campaign Name', 'Delivery', 'Objective', 'Budget', 'Amount Spent', 'Frequency', 'CPM', 'Cost per Result']}>
      <tr className="border-t border-[#eadfbe]">
        <td className="px-8 py-7"><Toggle /></td>
        <td className="min-w-[390px] px-5 py-7">
          <div className="text-lg font-medium">{campaign.name}</div>
          <RowActions onEdit={onEdit} />
        </td>
        <td className="px-5 py-7"><DeliveryBadge delivery={campaign.delivery} /></td>
        <td className="px-5 py-7"><ObjectiveBadge objective={campaign.objective} /></td>
        <td className="min-w-[210px] px-5 py-7 text-lg">{campaign.budget}</td>
        <EmptyMetric />
        <EmptyMetric />
        <EmptyMetric />
        <EmptyMetric />
      </tr>
    </TableShell>
  )
}

function AdSetTable({ adSet, onEdit }: { adSet: AdSet; onEdit: () => void }) {
  return (
    <TableShell columns={['Off / On', 'Ad Set Name', 'Delivery', 'Performance Goal', 'Budget', 'Amount Spent', 'Frequency', 'CPM', 'Cost per Result', 'Results', 'Targeting']}>
      <tr className="border-t border-[#eadfbe]">
        <td className="px-8 py-7"><Toggle /></td>
        <td className="min-w-[390px] px-5 py-7">
          <div className="text-lg font-medium">{adSet.name}</div>
          <RowActions onEdit={onEdit} />
        </td>
        <td className="px-5 py-7"><DeliveryBadge delivery={adSet.delivery} /></td>
        <td className="px-5 py-7 text-lg">{adSet.goal}</td>
        <td className="min-w-[210px] px-5 py-7 text-lg">{adSet.budget}</td>
        <EmptyMetric />
        <EmptyMetric />
        <EmptyMetric />
        <EmptyMetric />
        <EmptyMetric />
        <td className="min-w-[260px] px-5 py-7 text-lg">{adSet.targeting}</td>
      </tr>
    </TableShell>
  )
}

function AdTable({ ad, onEdit }: { ad: Ad; onEdit: () => void }) {
  return (
    <TableShell columns={['Off / On', 'Ad Name', 'Delivery', 'Headline', 'CTA', 'Creative', 'Amount Spent', 'Frequency', 'CPM', 'Cost per Result', 'Results', 'Actions']}>
      <tr className="border-t border-[#eadfbe]">
        <td className="px-8 py-7"><Toggle /></td>
        <td className="min-w-[360px] px-5 py-7">
          <button
            type="button"
            onClick={onEdit}
            className="text-left text-lg font-bold text-[#6a4b00] underline decoration-[#d9a441] underline-offset-4"
          >
            {ad.name}
          </button>
          <RowActions onEdit={onEdit} />
        </td>
        <td className="px-5 py-7"><DeliveryBadge delivery={ad.delivery} /></td>
        <td className="min-w-[220px] px-5 py-7 text-lg">{ad.headline}</td>
        <td className="min-w-[140px] px-5 py-7 text-lg">{ad.cta.toLowerCase().replaceAll(' ', '_')}</td>
        <td className="min-w-[260px] px-5 py-7">
          <div className="line-clamp-2 text-base text-[#5b6159]">{ad.creative}</div>
        </td>
        <EmptyMetric />
        <EmptyMetric />
        <EmptyMetric />
        <EmptyMetric />
        <EmptyMetric />
        <td className="px-5 py-7">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 border border-[#191919] bg-white px-4 py-2 text-lg font-bold text-[#1e211e] hover:shadow-[3px_3px_0_#d9a441]"
          >
            <Eye className="h-5 w-5" />
            Preview
          </button>
        </td>
      </tr>
    </TableShell>
  )
}

function EditAdModal({
  adName,
  businessName,
  challenge,
  cta,
  headline,
  onClose,
  platform,
  primaryText,
  setAdName,
  setBusinessName,
  setCta,
  setHeadline,
  setPlatform,
  setPrimaryText,
  setUtm,
  setWebsiteUrl,
  utm,
  websiteUrl,
}: {
  adName: string
  businessName: string
  challenge: Challenge
  cta: string
  headline: string
  onClose: () => void
  platform: Platform
  primaryText: string
  setAdName: (value: string) => void
  setBusinessName: (value: string) => void
  setCta: (value: string) => void
  setHeadline: (value: string) => void
  setPlatform: (value: Platform) => void
  setPrimaryText: (value: string) => void
  setUtm: (value: string) => void
  setWebsiteUrl: (value: string) => void
  utm: string
  websiteUrl: string
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 p-4 md:p-8">
      <div className="mx-auto grid max-h-[92vh] max-w-6xl overflow-hidden border border-[#191919] bg-white shadow-[12px_12px_0_#d9a441] lg:grid-cols-[minmax(0,1fr)_460px]">
        <section className="overflow-y-auto p-6 md:p-8">
          <div className="mb-7 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Edit Practice Ad</h2>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center border border-[#191919] text-[#1e211e] hover:bg-[#fff8df]"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Ad Name">
              <TextInput value={adName} onChange={setAdName} />
            </Field>
            <Field label="Business Name">
              <TextInput value={businessName} onChange={setBusinessName} />
            </Field>
          </div>

          <div className="mt-6 max-w-xl">
            <Field label="Ad Set">
              <SelectLike>{challenge.client} Core {challenge.objective}</SelectLike>
            </Field>
          </div>

          <div className="mt-6">
            <Field label="Primary Text">
              <textarea
                value={primaryText}
                onChange={(event) => setPrimaryText(event.target.value)}
                className="min-h-44 w-full border border-[#d8cdae] bg-[#fffdf7] px-4 py-3 text-lg outline-none focus:border-[#191919] focus:ring-2 focus:ring-[#d9a441]"
              />
            </Field>
            <CharacterCount count={primaryText.length} limit={2000} />
          </div>

          <div className="mt-6">
            <Field label="Headline">
              <TextInput value={headline} onChange={setHeadline} />
            </Field>
            <CharacterCount count={headline.length} limit={40} />
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field label="Call to Action">
              <select
                value={cta}
                onChange={(event) => setCta(event.target.value)}
                className="h-14 w-full border border-[#d8cdae] bg-[#fffdf7] px-4 text-lg outline-none"
              >
                <option>Learn More</option>
                <option>Sign Up</option>
                <option>Get Offer</option>
                <option>Order Now</option>
              </select>
            </Field>
            <Field label="Website URL">
              <TextInput value={websiteUrl} onChange={setWebsiteUrl} />
            </Field>
          </div>

          <div className="mt-6">
            <Field label="UTM Parameters">
              <TextInput value={utm} onChange={setUtm} />
            </Field>
          </div>
        </section>

        <aside className="overflow-y-auto border-l border-[#d8cdae] bg-[#fff8df] p-6 md:p-8">
          <h3 className="mb-7 text-3xl font-bold">Preview</h3>
          <div className="mb-6 flex gap-3">
            <PreviewTab active={platform === 'facebook'} onClick={() => setPlatform('facebook')}>
              Facebook
            </PreviewTab>
            <PreviewTab active={platform === 'instagram'} onClick={() => setPlatform('instagram')}>
              Instagram
            </PreviewTab>
          </div>
          <AdPreview
            businessName={businessName}
            challenge={challenge}
            cta={cta}
            headline={headline}
            platform={platform}
            primaryText={primaryText}
            websiteUrl={websiteUrl}
          />
        </aside>
      </div>
    </div>
  )
}

function AdPreview({
  businessName,
  challenge,
  cta,
  headline,
  platform,
  primaryText,
  websiteUrl,
}: {
  businessName: string
  challenge: Challenge
  cta: string
  headline: string
  platform: Platform
  primaryText: string
  websiteUrl: string
}) {
  const host = websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')

  return (
    <div className="border border-[#d8cdae] bg-white p-5 shadow-[6px_6px_0_#d9a441]">
      <div className="mb-4 flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center border border-[#191919] bg-[#191919] text-xl font-bold text-[#f7d66b]">
          {businessName.charAt(0)}
        </div>
        <div>
          <div className="text-xl font-bold">{businessName}</div>
          <div className="text-lg text-[#5b6159]">Sponsored</div>
        </div>
      </div>
      <div className="mb-4 whitespace-pre-wrap text-lg leading-relaxed">{primaryText}</div>
      <CreativePanel challenge={challenge} />
      <div className="mt-4 border border-[#d8cdae] bg-white p-4">
        <div className="mb-2 text-base text-[#5b6159]">{host}</div>
        <div className="text-xl font-bold">{headline}</div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="text-base text-[#5b6159]">
            {platform === 'facebook' ? 'Feed preview' : 'Instagram preview'}
          </span>
          <button type="button" className="border border-[#191919] bg-[#191919] px-4 py-2 font-bold text-[#f7d66b]">
            {cta}
          </button>
        </div>
      </div>
    </div>
  )
}

function CreativePanel({ challenge }: { challenge: Challenge }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden border border-[#191919] bg-[#fffdf7]">
      <div className="absolute inset-0 grid grid-cols-6 gap-px opacity-80">
        {Array.from({ length: 36 }).map((_, index) => (
          <span
            key={index}
            className={index % 5 === 0 ? 'bg-[#fff2bd]' : index % 3 === 0 ? 'bg-[#fff8df]' : 'bg-white'}
          />
        ))}
      </div>
      <div className="absolute left-5 top-5 grid h-16 w-16 place-items-center bg-[#191919] text-[#f7d66b]">
        {challenge.icon}
      </div>
      <div className="absolute bottom-0 left-0 right-0 border-t border-[#191919] bg-white p-5">
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6a4b00]">
          {challenge.objective} / {challenge.performanceGoal}
        </div>
        <div className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold leading-none">
          {challenge.headline}
        </div>
      </div>
    </div>
  )
}

function ValidationModal({
  challenge,
  cta,
  headline,
  onClose,
  primaryText,
}: {
  challenge: Challenge
  cta: string
  headline: string
  onClose: () => void
  primaryText: string
}) {
  const checks = [
    { done: true, label: `Objective is ${challenge.objective}` },
    { done: true, label: `Budget optimization uses ${challenge.budgetOptimization}` },
    { done: true, label: `Performance goal is ${challenge.performanceGoal}` },
    { done: primaryText.length > 80, label: 'Primary text has enough context' },
    { done: headline.length > 0 && headline.length <= 40, label: 'Headline is present and under 40 characters' },
    { done: cta.length > 0, label: 'CTA is selected' },
  ]
  const complete = checks.filter((check) => check.done).length

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4">
      <section className="w-full max-w-2xl border border-[#191919] bg-white p-6 shadow-[10px_10px_0_#d9a441]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#596157]">
              Challenge validation
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">
              {complete}/{checks.length} checks complete
            </h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center border border-[#191919]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="space-y-3">
          {checks.map((check) => (
            <li key={check.label} className="flex items-center gap-3 border border-[#eadfbe] bg-[#fff8df] p-3">
              <span className={`h-4 w-4 ${check.done ? 'bg-[#191919]' : 'bg-[#d9a441]'}`} />
              <span className={check.done ? 'font-bold text-[#1e211e]' : 'text-[#5b6159]'}>
                {check.label}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function TableShell({ children, columns }: { children: ReactNode; columns: string[] }) {
  return (
    <div className="overflow-x-auto p-5">
      <table className="min-w-[1450px] table-auto border-collapse">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-5 pb-5 text-left text-lg font-medium leading-tight text-[#706b66]"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      <div className="mt-5 h-4 bg-[#d8cdae]" />
    </div>
  )
}

function SidebarButton({
  active,
  children,
  icon,
  onClick,
}: {
  active?: boolean
  children: ReactNode
  icon: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-5 border px-7 py-5 text-left text-xl ${
        active
          ? 'border-[#191919] bg-[#191919] text-[#f7d66b] shadow-[5px_5px_0_#d9a441]'
          : 'border-transparent text-[#1e211e] hover:border-[#d8cdae] hover:bg-[#fff8df]'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}

function Crumb({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-bold text-[#6a4b00] underline decoration-[#d9a441] underline-offset-4"
    >
      {children}
    </button>
  )
}

function Toggle() {
  return (
    <button
      type="button"
      className="relative h-10 w-20 border border-[#191919] bg-[#191919] transition"
      aria-label="Toggle delivery"
    >
      <span className="absolute right-1 top-1 h-8 w-8 bg-[#f7d66b]" />
    </button>
  )
}

function RowActions({ onEdit }: { onEdit: () => void }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex items-center gap-3 border border-[#d8cdae] bg-white px-3 py-2 text-base hover:shadow-[3px_3px_0_#d9a441]"
      >
        <Edit3 className="h-5 w-5" />
        Edit
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-3 border border-[#d8cdae] bg-white px-3 py-2 text-base text-[#b91c1c] hover:shadow-[3px_3px_0_#d9a441]"
      >
        <Trash2 className="h-5 w-5" />
        Delete
      </button>
    </div>
  )
}

function DeliveryBadge({ delivery }: { delivery: Delivery }) {
  const active = delivery === 'Active'

  return (
    <span className={`inline-flex items-center gap-2 text-lg ${active ? 'text-[#17693a]' : 'text-[#6a4b00]'}`}>
      <span className={`h-2.5 w-2.5 ${active ? 'bg-[#22c55e]' : 'bg-[#d9a441]'}`} />
      {delivery}
    </span>
  )
}

function ObjectiveBadge({ objective }: { objective: Objective }) {
  return (
    <span className={`border px-4 py-2 text-base font-bold ${objectiveStyles[objective]}`}>
      {objective}
    </span>
  )
}

function EmptyMetric() {
  return <td className="px-5 py-7 text-lg text-[#9aa097]">-</td>
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="block">
      <span className="mb-3 block text-xl font-semibold">{label}</span>
      {children}
    </label>
  )
}

function TextInput({ onChange, value }: { onChange: (value: string) => void; value: string }) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-14 w-full border border-[#d8cdae] bg-[#fffdf7] px-4 text-lg outline-none focus:border-[#191919] focus:ring-2 focus:ring-[#d9a441]"
    />
  )
}

function SelectLike({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-14 w-full items-center justify-between border border-[#d8cdae] bg-[#fffdf7] px-4 text-left text-lg"
    >
      {children}
      <ChevronDown className="h-5 w-5 text-[#596157]" />
    </button>
  )
}

function CharacterCount({ count, limit }: { count: number; limit: number }) {
  return (
    <div className="mt-2 text-base text-[#5b6159]">
      {count}/{limit} characters
    </div>
  )
}

function PreviewTab({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-5 py-3 text-xl ${
        active
          ? 'border-[#191919] bg-[#191919] text-[#f7d66b]'
          : 'border-[#d8cdae] bg-white text-[#1e211e]'
      }`}
    >
      {children}
    </button>
  )
}
