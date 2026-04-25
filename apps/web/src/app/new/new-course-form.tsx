'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type SubjectRow = { slug: string; title_he: string; title_en: string }

const DEFAULT_SUBJECTS: SubjectRow[] = [{ slug: '', title_he: '', title_en: '' }]

export default function NewCourseForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const [slug, setSlug] = useState('')
  const [titleHe, setTitleHe] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [institution, setInstitution] = useState('')
  const [professor, setProfessor] = useState('')
  const [term, setTerm] = useState('')
  const [examDate, setExamDate] = useState('')
  const [subjects, setSubjects] = useState<SubjectRow[]>(DEFAULT_SUBJECTS)

  function addSubject() {
    setSubjects((prev) => [...prev, { slug: '', title_he: '', title_en: '' }])
  }

  function updateSubject(i: number, field: keyof SubjectRow, value: string) {
    setSubjects((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)))
  }

  function removeSubject(i: number) {
    setSubjects((prev) => prev.filter((_, idx) => idx !== i))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const validSubjects = subjects
      .filter((s) => s.slug.trim() && s.title_he.trim())
      .map((s) => ({ ...s, topics: [] }))

    startTransition(async () => {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: slug.trim(),
          title_he: titleHe.trim(),
          title_en: titleEn.trim() || slug.trim(),
          institution: institution.trim(),
          professor: professor.trim(),
          term: term.trim(),
          exam_date: examDate.trim() || null,
          subjects: validSubjects,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to create course')
        return
      }
      router.push(`/${data.slug}`)
    })
  }

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg bg-[#0d0d14] border border-[#2a2a35] text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-violet-500'
  const labelClass = 'block text-xs font-medium text-neutral-400 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Identity */}
      <section className="rounded-xl border border-[#2a2a35] bg-[#0d0d14] p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wide">
          Course identity
        </h2>

        <div>
          <label className={labelClass}>
            Slug <span className="text-red-400">*</span>
            <span className="text-neutral-600 font-normal ml-1">(lowercase, hyphens only)</span>
          </label>
          <input
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
            placeholder="advanced-algorithms"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Title (Hebrew) <span className="text-red-400">*</span>
            </label>
            <input
              required
              dir="rtl"
              value={titleHe}
              onChange={(e) => setTitleHe(e.target.value)}
              placeholder="אלגוריתמים מתקדמים"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Title (English)</label>
            <input
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Advanced Algorithms"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Institution</label>
            <input
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="Open University of Israel"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Professor</label>
            <input
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              placeholder="Prof. Asaf Shapira"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Term</label>
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="2025/2026"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Exam date</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="rounded-xl border border-[#2a2a35] bg-[#0d0d14] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wide">
          Subjects{' '}
          <span className="text-neutral-500 font-normal normal-case">
            (optional — you can add later)
          </span>
        </h2>
        <div className="space-y-3">
          {subjects.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
              <div>
                {i === 0 && <p className={labelClass}>Slug</p>}
                <input
                  value={s.slug}
                  onChange={(e) =>
                    updateSubject(
                      i,
                      'slug',
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                    )
                  }
                  placeholder="data-structures"
                  className={inputClass}
                />
              </div>
              <div>
                {i === 0 && <p className={labelClass}>Hebrew name</p>}
                <input
                  dir="rtl"
                  value={s.title_he}
                  onChange={(e) => updateSubject(i, 'title_he', e.target.value)}
                  placeholder="מבני נתונים"
                  className={inputClass}
                />
              </div>
              <div>
                {i === 0 && <p className={labelClass}>English name</p>}
                <input
                  value={s.title_en}
                  onChange={(e) => updateSubject(i, 'title_en', e.target.value)}
                  placeholder="Data Structures"
                  className={inputClass}
                />
              </div>
              <button
                type="button"
                onClick={() => removeSubject(i)}
                className="mb-0 h-[42px] w-9 flex items-center justify-center rounded-lg border border-[#2a2a35] text-neutral-600 hover:text-red-400 hover:border-red-900 transition-colors"
                aria-label="Remove subject"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSubject}
          className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          + Add subject
        </button>
      </section>

      {error && <p className="text-sm text-red-400 px-1">{error}</p>}

      <button
        type="submit"
        disabled={isPending || !slug || !titleHe}
        className="w-full py-3 rounded-xl bg-violet-700 hover:bg-violet-600 disabled:opacity-50 text-white font-medium transition-colors"
      >
        {isPending ? 'Creating…' : 'Create course'}
      </button>
    </form>
  )
}
