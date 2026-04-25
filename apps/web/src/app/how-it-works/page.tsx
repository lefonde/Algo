import Link from 'next/link'
import {
  Upload,
  RefreshCw,
  PlusCircle,
  BarChart3,
  FolderOpen,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Clock,
  Cog,
  FileText,
  MessageCircle,
  Zap,
  Info,
} from 'lucide-react'
import { TopBar } from '@/components/top-bar'

export default function HowItWorksPage() {
  return (
    <>
      <TopBar />
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-10 md:py-16">
        {/* Hero */}
        <header className="mb-14">
          <p className="text-[10px] font-mono text-[var(--color-zinc-600)] uppercase tracking-widest mb-3">
            Reference
          </p>
          <h1 className="font-display text-4xl text-white mb-4">How Algo Study works</h1>
          <p className="text-[var(--color-zinc-400)] leading-relaxed max-w-xl">
            A practical guide to the three things you&apos;ll actually do: add new material, re-run
            predictions, and create a new course.
          </p>
        </header>

        {/* Quick reference cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          <QuickCard
            href="#add-material"
            icon={<Upload size={18} className="text-sky-400" />}
            title="Add material"
            desc="Drop new PDFs, lecture notes, exam scans, WhatsApp hints"
            color="border-sky-900/30 hover:border-sky-500/40"
          />
          <QuickCard
            href="#recalculate"
            icon={<RefreshCw size={18} className="text-violet-400" />}
            title="Recalculate"
            desc="AI re-scores all questions against existing evidence + new files"
            color="border-violet-900/30 hover:border-violet-500/40"
          />
          <QuickCard
            href="#new-course"
            icon={<PlusCircle size={18} className="text-emerald-400" />}
            title="New course"
            desc="Scaffold a fresh course skeleton — then fill it with material"
            color="border-emerald-900/30 hover:border-emerald-500/40"
          />
        </section>

        {/* Data flow diagram */}
        <Section id="data-flow" icon={<Cog size={16} />} title="How data flows">
          <p className="text-sm text-[var(--color-zinc-400)] leading-relaxed mb-6">
            Everything lives in the repository as plain files. There is no separate database.
            Predictions are a JSON file you own, commit, and push — not a black box.
          </p>
          <DataFlowDiagram />
          <div className="mt-6 space-y-2 text-sm text-[var(--color-zinc-400)]">
            <p>
              <span className="text-white font-medium">predictions.json</span> is the single source
              of truth. Every question, score, source reference, and rationale lives there.
            </p>
            <p>
              The AI revision flow reads that file, produces a{' '}
              <span className="text-white font-medium">diff</span>, and asks you to approve changes
              before anything is written. You stay in control.
            </p>
          </div>
        </Section>

        {/* Add material */}
        <Section
          id="add-material"
          icon={<Upload size={16} className="text-sky-400" />}
          title="Add new material"
        >
          <FlowBlock
            when="When to do this"
            whenText="A new lecture happened. Someone shared an exam scan. דימה dropped a hint in WhatsApp. New maman solutions were posted."
          />
          <HowBlock
            steps={[
              <>
                Go to <Mono>/advanced-algorithms/revise</Mono>
              </>,
              'In Step 1, click the file drop zone and select your files (PDF, JPG, PNG, DOCX — any format)',
              'Watch the upload confirmation list — each file shows a green ✓ when received',
              'Continue to Step 2 to add a note, or go straight to Step 3 to run revision',
            ]}
          />
          <BehindBlock>
            Files are sent to <Mono>/api/ingest</Mono>, classified by filename (exam-hint,
            whiteboard, lecture note, etc.), and saved to{' '}
            <Mono>content/courses/&#123;slug&#125;/ingest-inbox/</Mono> on the server. An entry is
            appended to <Mono>uploads.json</Mono> so you can see what was received. The AI reads the
            inbox when you run revision.
          </BehindBlock>
          <Caveat>
            <strong>Vercel&apos;s filesystem is ephemeral.</strong> Uploaded files disappear on the
            next deploy. For truly permanent uploads, the right fix is{' '}
            <span className="text-white">Vercel Blob</span> (not yet wired up). For now, the most
            reliable method is to{' '}
            <span className="text-white">
              add files directly to the repo under <Mono>content/courses/advanced-algorithms/</Mono>
            </span>{' '}
            and push — then they live in Git forever.
          </Caveat>
        </Section>

        {/* Recalculate */}
        <Section
          id="recalculate"
          icon={<RefreshCw size={16} className="text-violet-400" />}
          title="Recalculate predictions"
        >
          <FlowBlock
            when="When to do this"
            whenText="After adding new material. After receiving a WhatsApp hint. A month before the exam when you want a fresh ranking. Any time the landscape changes."
          />
          <HowBlock
            steps={[
              <>
                Go to <Mono>/advanced-algorithms/revise</Mono>
              </>,
              'Optionally upload new files in Step 1',
              'In Step 2, paste any new context — a WhatsApp message, an instructor comment, scope changes',
              <>
                Click <strong className="text-white">Run revision</strong> — Claude reads all
                current predictions, scoring weights, trends, insights, and your note
              </>,
              'Review the diff: score changes show old → new with reasoning. Accept or reject each.',
              <>
                <span className="text-amber-400">Manual step:</span> copy accepted changes into{' '}
                <Mono>content/courses/advanced-algorithms/predictions.json</Mono> and push
              </>,
            ]}
          />
          <BehindBlock>
            The API call goes to <Mono>/api/revise</Mono> which sends Claude{' '}
            <Mono>claude-sonnet-4-6</Mono> the full scoring methodology (lecture ×3, recent-exam ×3,
            maman ×2.5, etc.), all 30 current questions with their sources, the trends file
            (surprises and absences from 2025A), the insights file (דימה&apos;s track record, scope
            signals), and your note. Claude returns a structured JSON diff — never free-form text.
          </BehindBlock>
          <Caveat>
            <strong>Accepting a change in the UI does not write to disk yet.</strong> The Accept /
            Reject buttons are review-only — there&apos;s no &quot;Commit&quot; button yet. You need
            to manually edit <Mono>predictions.json</Mono> with the approved score changes and push.
            This is a known gap — a one-click commit is planned.
          </Caveat>
        </Section>

        {/* New course */}
        <Section
          id="new-course"
          icon={<PlusCircle size={16} className="text-emerald-400" />}
          title="Create a new course"
        >
          <FlowBlock
            when="When to do this"
            whenText="New semester, new subject, or you want to track a second course alongside Advanced Algorithms."
          />
          <HowBlock
            steps={[
              <>
                Go to{' '}
                <Link
                  href="/new"
                  className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
                >
                  /new
                </Link>
              </>,
              <>
                Fill in the <strong className="text-white">slug</strong> (lowercase, hyphens — e.g.{' '}
                <Mono>linear-algebra</Mono>) and the{' '}
                <strong className="text-white">Hebrew title</strong> (required)
              </>,
              'Optionally add institution, professor, term, exam date, and subject rows',
              "Click Create course — you're redirected to the new course page",
              'The course is empty. Go to its /revise page and upload material to populate it',
            ]}
          />
          <BehindBlock>
            <Mono>/api/courses</Mono> creates the full directory skeleton under{' '}
            <Mono>content/courses/&#123;slug&#125;/</Mono> on the server: course.json,
            predictions.json (empty), lectures/, mamans/, tests/, ingest-inbox/, and index files.
            The site&apos;s static params are regenerated at build time — so the new course page
            only shows up after a Vercel deploy.
          </BehindBlock>
          <Caveat>
            Same Vercel-ephemeral issue as uploads. For a course that persists across deploys,{' '}
            <strong className="text-white">create the course skeleton directly in the repo</strong>{' '}
            — copy the <Mono>content/courses/advanced-algorithms/</Mono> structure, replace the
            JSONs, and push. That&apos;s the durable path until Vercel Blob is wired up.
          </Caveat>
        </Section>

        {/* Scoring */}
        <Section
          id="scoring"
          icon={<BarChart3 size={16} className="text-yellow-400" />}
          title="How scores are calculated"
        >
          <p className="text-sm text-[var(--color-zinc-400)] leading-relaxed mb-5">
            Every question has a score from 1–10 representing exam probability. Scores are computed
            by summing the weights of all sources that support the question, capped at 10.
          </p>

          {/* Weights table */}
          <div className="rounded-xl border border-[var(--color-surface-border)] overflow-hidden mb-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-surface-border)] bg-[var(--color-surface-raised)]">
                  <th className="text-left px-4 py-2.5 text-[var(--color-zinc-400)] font-medium text-xs uppercase tracking-wide">
                    Source
                  </th>
                  <th className="text-left px-4 py-2.5 text-[var(--color-zinc-400)] font-medium text-xs uppercase tracking-wide">
                    Weight
                  </th>
                  <th className="text-left px-4 py-2.5 text-[var(--color-zinc-400)] font-medium text-xs uppercase tracking-wide hidden md:table-cell">
                    Why
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-surface-border-subtle)]">
                {SCORING_WEIGHTS.map((row) => (
                  <tr key={row.source} className="bg-[var(--color-surface-card)]">
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-[var(--color-zinc-300)]">
                        {row.source}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-bold text-white tabular-nums">×{row.weight}</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-[var(--color-zinc-500)] hidden md:table-cell">
                      {row.why}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Score bands */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <ScoreBand
              score="≥ 8"
              label="Critical"
              color="text-red-400 border-red-900/40 bg-red-950/20"
            />
            <ScoreBand
              score="≥ 7"
              label="High"
              color="text-orange-400 border-orange-900/40 bg-orange-950/20"
            />
            <ScoreBand
              score="< 7"
              label="Medium"
              color="text-yellow-400 border-yellow-900/40 bg-yellow-950/20"
            />
          </div>

          <p className="text-xs text-[var(--color-zinc-500)]">
            Score logic lives in <Mono>packages/shared/src/scoring.ts</Mono>. Change a weight there
            and it affects both the UI and the AI revision prompt automatically.
          </p>
        </Section>

        {/* Where things live */}
        <Section
          id="where-things-live"
          icon={<FolderOpen size={16} className="text-zinc-400" />}
          title="Where things live"
        >
          <p className="text-sm text-[var(--color-zinc-400)] mb-5 leading-relaxed">
            All course data is in the Git repo under <Mono>content/courses/</Mono>. Nothing lives in
            a database.
          </p>
          <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-5 space-y-1 font-mono text-xs">
            {FILE_PATHS.map((item) => (
              <div key={item.path} className="flex gap-4">
                <span className="text-[var(--color-zinc-300)] shrink-0 min-w-0 truncate">
                  {item.path}
                </span>
                <span className="text-[var(--color-zinc-600)] hidden md:block">{item.desc}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[var(--color-zinc-600)]">
            To make a permanent change to any question, score, or rationale — edit the JSON file
            directly, commit, and push. Vercel redeploys automatically.
          </p>
        </Section>

        {/* Known limitations */}
        <Section
          id="known-limitations"
          icon={<AlertTriangle size={16} className="text-amber-400" />}
          title="Known limitations"
        >
          <div className="space-y-3">
            {LIMITATIONS.map((item, i) => (
              <div
                key={i}
                className="flex gap-3 text-sm p-4 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)]"
              >
                <div className="shrink-0 mt-0.5">
                  {item.done ? (
                    <CheckCircle size={15} className="text-emerald-500" />
                  ) : (
                    <AlertTriangle size={15} className="text-amber-500" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium mb-0.5">{item.title}</p>
                  <p className="text-[var(--color-zinc-500)] text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </main>
    </>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({
  id,
  icon,
  title,
  children,
}: {
  id: string
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="mb-14 scroll-mt-16">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1.5 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)]">
          {icon}
        </div>
        <h2 className="font-display text-xl text-white">{title}</h2>
        <a
          href={`#${id}`}
          className="text-[var(--color-zinc-700)] hover:text-[var(--color-zinc-500)] transition-colors ml-1 text-xs font-mono"
          aria-label={`Link to ${title}`}
        >
          #
        </a>
      </div>
      {children}
    </section>
  )
}

function FlowBlock({ when, whenText }: { when: string; whenText: string }) {
  return (
    <div className="flex gap-3 mb-4 p-4 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-surface-border)]">
      <Clock size={14} className="text-[var(--color-zinc-600)] shrink-0 mt-0.5" />
      <div>
        <p className="text-[10px] font-semibold text-[var(--color-zinc-600)] uppercase tracking-wider mb-1">
          {when}
        </p>
        <p className="text-sm text-[var(--color-zinc-400)] leading-relaxed">{whenText}</p>
      </div>
    </div>
  )
}

function HowBlock({ steps }: { steps: React.ReactNode[] }) {
  return (
    <div className="mb-4">
      <p className="text-[10px] font-semibold text-[var(--color-zinc-600)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Zap size={10} />
        Steps
      </p>
      <ol className="space-y-2.5">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--color-surface-overlay)] border border-[var(--color-surface-border)] flex items-center justify-center text-[10px] font-bold text-[var(--color-zinc-400)] tabular-nums mt-0.5">
              {i + 1}
            </span>
            <span className="text-[var(--color-zinc-300)] leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function BehindBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 p-4 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-surface-border-subtle)]">
      <p className="text-[10px] font-semibold text-[var(--color-zinc-600)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <Cog size={10} />
        Behind the scenes
      </p>
      <p className="text-xs text-[var(--color-zinc-500)] leading-relaxed">{children}</p>
    </div>
  )
}

function Caveat({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 rounded-xl bg-amber-950/15 border border-amber-900/30">
      <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
      <p className="text-xs text-amber-200/70 leading-relaxed">{children}</p>
    </div>
  )
}

function QuickCard({
  href,
  icon,
  title,
  desc,
  color,
}: {
  href: string
  icon: React.ReactNode
  title: string
  desc: string
  color: string
}) {
  return (
    <a
      href={href}
      className={`group block rounded-xl border bg-[var(--color-surface-card)] p-5 transition-all duration-200 hover:-translate-y-0.5 ${color}`}
    >
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-white transition-colors">
        {title}
      </h3>
      <p className="text-xs text-[var(--color-zinc-500)] leading-relaxed">{desc}</p>
      <ArrowRight
        size={12}
        className="mt-3 text-[var(--color-zinc-700)] group-hover:text-[var(--color-zinc-400)] group-hover:translate-x-0.5 transition-all"
      />
    </a>
  )
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[var(--color-surface-overlay)] text-[var(--color-zinc-300)] border border-[var(--color-surface-border)]">
      {children}
    </code>
  )
}

function ScoreBand({ score, label, color }: { score: string; label: string; color: string }) {
  return (
    <div className={`rounded-lg border p-3 text-center ${color}`}>
      <p className="font-mono font-bold text-lg tabular-nums">{score}</p>
      <p className="text-xs font-medium mt-0.5">{label}</p>
    </div>
  )
}

function DataFlowDiagram() {
  return (
    <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-5 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-max mx-auto w-fit">
        <FlowNode
          icon={<FileText size={14} className="text-sky-400" />}
          label="Source files"
          sub="PDFs, notes, WhatsApp"
          color="border-sky-900/40 bg-sky-950/10"
        />
        <FlowArrow label="upload" />
        <FlowNode
          icon={<FolderOpen size={14} className="text-zinc-400" />}
          label="ingest-inbox/"
          sub="on server"
          color="border-[var(--color-surface-border)]"
        />
        <FlowArrow label="revise →" />
        <FlowNode
          icon={<Zap size={14} className="text-violet-400" />}
          label="Claude AI"
          sub="reads + diffs"
          color="border-violet-900/40 bg-violet-950/10"
        />
        <FlowArrow label="accept" />
        <FlowNode
          icon={<BarChart3 size={14} className="text-yellow-400" />}
          label="predictions.json"
          sub="source of truth"
          color="border-yellow-900/40 bg-yellow-950/10"
        />
        <FlowArrow label="push →" />
        <FlowNode
          icon={<CheckCircle size={14} className="text-emerald-400" />}
          label="Live site"
          sub="Vercel redeploy"
          color="border-emerald-900/40 bg-emerald-950/10"
        />
      </div>
    </div>
  )
}

function FlowNode({
  icon,
  label,
  sub,
  color,
}: {
  icon: React.ReactNode
  label: string
  sub: string
  color: string
}) {
  return (
    <div className={`rounded-lg border px-3 py-2.5 text-center w-28 shrink-0 ${color}`}>
      <div className="flex justify-center mb-1.5">{icon}</div>
      <p className="text-xs font-medium text-white leading-tight">{label}</p>
      <p className="text-[10px] text-[var(--color-zinc-600)] mt-0.5 leading-tight">{sub}</p>
    </div>
  )
}

function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 shrink-0">
      <p className="text-[9px] text-[var(--color-zinc-700)] font-mono">{label}</p>
      <ArrowRight size={14} className="text-[var(--color-zinc-700)]" />
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SCORING_WEIGHTS = [
  { source: 'lecture', weight: '3.0', why: 'Proved in lecture → exam proof' },
  { source: 'recent-exam', weight: '3.0', why: 'Most recent signal (2025A)' },
  { source: 'maman', weight: '2.5', why: 'Homework guarantees at least one exam question' },
  { source: 'past-exam', weight: '2.0', why: 'Asaf recycles topics across years' },
  { source: 'sample-exam', weight: '2.0', why: 'Direct signal from instructor' },
  { source: 'booklet', weight: '2.0', why: 'Course booklet = sample exam equivalent' },
  { source: 'whatsapp-hint', weight: '1.5', why: 'דימה has strong predictive track record' },
  { source: 'textbook', weight: '0.5', why: 'Lower unless also in maman/sample' },
]

const FILE_PATHS = [
  {
    path: 'content/courses/{slug}/predictions.json',
    desc: '← source of truth for all questions and scores',
  },
  { path: 'content/courses/{slug}/insights.json', desc: '← WhatsApp / instructor analysis' },
  { path: 'content/courses/{slug}/trends.json', desc: '← 2025A surprises, absences, confirmed' },
  { path: 'content/courses/{slug}/course.json', desc: '← metadata: title, professor, subjects' },
  { path: 'content/courses/{slug}/ingest-inbox/', desc: '← uploaded files (ephemeral on Vercel)' },
  { path: 'content/courses/{slug}/lectures/pdfs/', desc: '← lecture PDFs' },
  { path: 'content/courses/{slug}/mamans/pdfs/', desc: '← homework PDFs' },
  { path: 'content/courses/{slug}/tests/pdfs/', desc: '← past exam PDFs' },
  { path: 'packages/shared/src/scoring.ts', desc: '← weight constants + computeScore()' },
]

const LIMITATIONS = [
  {
    done: false,
    title: 'Revision accept → disk',
    desc: 'Accepting a score change in the revise UI doesn\'t write to predictions.json yet. You need to apply changes manually and push. A one-click "Commit accepted changes" button is planned.',
  },
  {
    done: false,
    title: 'Persistent file uploads (Vercel Blob)',
    desc: 'Files uploaded via the revise page land in the server filesystem, which Vercel wipes on each deploy. Until Vercel Blob is wired up, add material directly to the repo and push.',
  },
  {
    done: false,
    title: 'New courses via UI persist across deploys',
    desc: 'Creating a course via /new writes to the server filesystem — gone on next deploy. Durable path: create the folder in the repo and push.',
  },
  {
    done: true,
    title: 'Auth (single password gate)',
    desc: 'SITE_PASSWORD env var on Vercel gates the whole site. Set it in Project Settings → Environment Variables.',
  },
  {
    done: true,
    title: 'AI revision with evidence-linked diff',
    desc: 'Claude reads scoring weights, current predictions, trends, insights, and your note — returns a structured JSON diff you review question by question.',
  },
]
