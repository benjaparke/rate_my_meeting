import React from 'react'
import { useMemo, useState } from 'react'
const sampleAgendas = {
  weekly: {
    title: 'Weekly Team Update',
    data: {
      agenda: '1) Wins and blockers (10 min)\n2) Project updates (20 min)\n3) Risks and dependencies (15 min)\n4) Decisions needed (10 min)',
      purpose: 'Share progress and unblock execution',
      audienceSize: '11-25',
      seniority: 'Mixed',
      length: '60',
      meetingType: 'Status / Update',
      role: 'Some discussion',
      materials: ['Slides'],
      earlyInteraction: 'no',
      decisionRequired: 'yes',
      outcome: 'By the end of this meeting, we will confirm owners for blockers and approve next sprint priorities.'
    }
  },
  strategy: {
    title: 'Strategic Planning Session',
    data: {
      agenda: '1) Business context + data review (15 min)\n2) Prioritization exercise (20 min)\n3) Draft plan options (20 min)\n4) Decision and owner assignments (15 min)',
      purpose: 'Set direction for next quarter priorities',
      audienceSize: '6-10',
      seniority: 'Directors',
      length: '60',
      meetingType: 'Decision-making',
      role: 'Decision-making',
      materials: ['Pre-read', 'Worksheet'],
      earlyInteraction: 'yes',
      decisionRequired: 'yes',
      outcome: 'By the end of this meeting, we will select one strategic focus and assign accountable leads.'
    }
  },
  onboarding: {
    title: 'New Employee Onboarding',
    data: {
      agenda: '1) Introductions and icebreaker (10 min)\n2) Tools and workflow demo (20 min)\n3) Hands-on setup (20 min)\n4) Q&A + support channels (10 min)',
      purpose: 'Help new hires ramp up quickly',
      audienceSize: '1-5',
      seniority: 'Individual contributors',
      length: '60',
      meetingType: 'Training',
      role: 'Hands-on activity',
      materials: ['Demo', 'Worksheet'],
      earlyInteraction: 'yes',
      decisionRequired: 'no',
      outcome: 'By the end of this meeting, we will complete account setup and know where to get help.'
    }
  }
}

const defaultForm = {
  agenda: '',
  purpose: '',
  audienceSize: '1-5',
  seniority: 'Mixed',
  length: '30',
  meetingType: 'Alignment',
  role: 'Some discussion',
  materials: [],
  earlyInteraction: 'yes',
  decisionRequired: 'no',
  outcome: ''
}

const recommendationsMap = {
  'Passive audience risk': [
    'Shift from audience to participants',
    'Right now, most people are positioned as listeners, which leads to rapid disengagement.',
    'Add a structured input every 10–15 minutes (poll, round-robin, or quick decision prompt).'
  ],

  'Too much presentation time': [
    'Move information out of the meeting',
    'Live time is best used for thinking, not consuming slides.',
    'Send updates as a pre-read and use the meeting for discussion, tradeoffs, or decisions.'
  ],

  'Unclear outcome': [
    'Define what success looks like',
    'Without a clear outcome, the meeting will feel directionless and low-stakes.',
    'Rewrite as: “By the end of this meeting, we will decide X and assign Y by Z.”'
  ],

  'No early interaction': [
    'Engage people immediately',
    'The first 10 minutes sets the tone for participation.',
    'Start with a prompt: “What’s the biggest risk we need to solve today?”'
  ],

  'Status meeting inflation': [
    'Stop using meetings for status updates',
    'Status-heavy meetings create passive listening and low-value airtime.',
    'Replace updates with async summaries and reserve the meeting for blockers and decisions.'
  ],

  'Large audience, low participation': [
    'Design for participation at scale',
    'Large groups require structure to avoid most people staying silent.',
    'Use breakout groups, role assignments, or written input before group discussion.'
  ],

  'Agenda-to-purpose mismatch': [
    'Pick one job for this meeting',
    'The agenda is trying to do multiple things, which diffuses focus.',
    'Decide whether this is a decision, discussion, or alignment meeting, and remove everything else.'
  ],

  'Decision not named': [
    'Make the decision explicit',
    'If the decision is not named, it usually won’t happen.',
    'Add: “Decision: ___ | Owner: ___ | Deadline: ___” to the agenda.'
  ],

  'Could be handled asynchronously': [
    'Consider canceling this meeting',
    'There is no clear need for real-time discussion.',
    'Send a written update with clear asks instead of holding a live meeting.'
  ]
}

function App() {
  const [form, setForm] = useState(defaultForm)
  const [result, setResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleMaterialToggle = (item) => {
    setForm((prev) => ({
      ...prev,
      materials: prev.materials.includes(item) ? prev.materials.filter((m) => m !== item) : [...prev.materials, item]
    }))
  }

  const evaluate = async () => {
    setIsAnalyzing(true)
    const analysis = scoreMeeting(form)

    try {
      const insights = await generateInsights({ score: analysis.score, flags: analysis.flags, form })
      setResult({
        ...analysis,
        summary: insights.summary,
        observations: insights.observations,
        recommendations: insights.recommendations
      })
    } catch (error) {
      console.error('Failed to generate AI insights, using fallback:', error)
      setResult(analysis)
    } finally {
      setIsAnalyzing(false)
    }
  }

const riskColor = useMemo(() => {
  if (!result || typeof result.score !== 'number') return 'text-slate-100'

  if (result.score > 75) return 'text-emerald-400'
  if (result.score > 50) return 'text-yellow-300'
  if (result.score > 25) return 'text-orange-400'
  return 'text-red-400'
}, [result])

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy via-[#0a1f3f] to-[#08152d] px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-3xl border border-teal/30 bg-white/5 p-8 shadow-2xl backdrop-blur">
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">Meeting Reality Check</h1>
          <p className="mt-2 text-lg text-teal">Stress-test your agenda before people start checking out.</p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white/95 p-6 text-slate-900 shadow-xl">
            <h2 className="text-xl font-bold">Sample agendas</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {Object.entries(sampleAgendas).map(([key, sample]) => (
                <button key={key} onClick={() => setForm(sample.data)} className="rounded-xl bg-teal px-4 py-2 font-semibold text-navy transition hover:scale-[1.02] hover:bg-cyan-300">
                  {sample.title}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <Field label="Agenda*"><textarea value={form.agenda} onChange={(e) => setForm({ ...form, agenda: e.target.value })} placeholder="List agenda sections, ideally with time blocks." className="h-28 w-full rounded-xl border p-3" /></Field>
              <DoubleRow>
                <Field label="Meeting purpose"><input value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="w-full rounded-xl border p-3" /></Field>
                <Field label="Desired outcome"><input value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} placeholder="By the end of this meeting, we will…" className="w-full rounded-xl border p-3" /></Field>
              </DoubleRow>
              <FormSelects form={form} setForm={setForm} />

              <Field label="Materials">
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {['Slides', 'Pre-read', 'Worksheet', 'Demo', 'None', 'Other'].map((item) => (
                    <label key={item} className="flex items-center gap-2 rounded-lg bg-slate-100 p-2 text-sm"><input type="checkbox" checked={form.materials.includes(item)} onChange={() => handleMaterialToggle(item)} />{item}</label>
                  ))}
                </div>
              </Field>
              <DoubleRow>
                <Toggle label="Early interaction in first 10 min?" value={form.earlyInteraction} onChange={(val) => setForm({ ...form, earlyInteraction: val })} />
                <Toggle label="Decision expected?" value={form.decisionRequired} onChange={(val) => setForm({ ...form, decisionRequired: val })} />
              </DoubleRow>

              <button onClick={evaluate} disabled={isAnalyzing} className="w-full rounded-xl bg-orange py-3 text-lg font-bold text-white shadow-lg transition hover:translate-y-[-1px] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70">{isAnalyzing ? 'Analyzing...' : 'Run Reality Check'}</button>
              <p className="text-center text-sm text-slate-600">Takes ~20 seconds. No one will know you checked.</p>
            </div>
          </div>

          <div className={`rounded-3xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur transition-all duration-500 ${result ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-2'}`}>
          {!result ? (
  <p className="mt-20 text-center text-slate-200">
    Run a reality check to reveal score, risks, and fast fixes.
  </p>
) : (
  <div className="space-y-5">
    <h3 className="text-xl font-bold text-white">Engagement Score</h3>
    <div className={`text-7xl font-black ${riskColor}`}>{result.score}</div>
    <p className="text-lg font-semibold text-white">{result.label}</p>

    <p className="text-sm text-slate-300">
      Based on structure, participation design, and clarity of outcome
    </p>

    <p className="text-slate-200 mt-2">{result.summary}</p>

    <Card title="What's likely to happen" items={result.observations} />

    <div className="space-y-3">
      <h4 className="text-lg font-bold text-white">Best fixes</h4>
      {result.recommendations.map((rec) => (
        <div key={rec.title} className="rounded-xl bg-white/95 p-4 text-slate-900">
          <p className="font-bold">{rec.title}</p>
          <p className="text-sm">{rec.why}</p>
          <p className="mt-1 text-sm text-orange-700">Example: {rec.example}</p>
        </div>
      ))}
    </div>

    <div className="rounded-xl bg-[#041229] p-4 text-slate-100">
      <h4 className="font-bold text-teal">Optional improved agenda</h4>
      <pre className="mt-2 whitespace-pre-wrap text-sm">
        {result.improvedAgenda}
    </pre>
</div>
  </div>
)}
          </div>
        </section>
      </div>
    </div>
  )
}

function scoreMeeting(form) {
  let score = 40
  const flags = []
  const agenda = form.agenda.toLowerCase()
  const outcome = form.outcome.toLowerCase().trim()
  const purpose = form.purpose.toLowerCase()
  const len = Number(form.length)
  const sectionCount = form.agenda.split('\n').filter(Boolean).length
  const hasInteractiveAgenda = /(workshop|discussion|activity|q&a|exercise|breakout|poll|hands-on|brainstorm)/i.test(form.agenda)
  const hasTimeBlocks = /\b\d+\s?min\b|\d{1,2}:\d{2}/i.test(form.agenda)
  const vagueOutcome = /(discuss|review|align|talk about|sync)/i.test(outcome)
  const measurableOutcome = /(decide|select|assign|approve|owner|deadline|by\s+\w+day|complete)/i.test(outcome)
  const decisionNamed = /(decision|approve|select|choose)/i.test(form.agenda + ' ' + form.outcome)

  if (len > 60) { score += 10; flags.push('Too much presentation time') }
  if (len > 90) score += 15
  if (!outcome) { score += 15; flags.push('Unclear outcome') }
  if (vagueOutcome) { score += 10; flags.push('Unclear outcome') }
  if (form.meetingType === 'Status / Update') { score += 15; flags.push('Status meeting inflation') }
  if (form.role === 'Mostly listening') { score += 20; flags.push('Passive audience risk') }
  if (form.audienceSize === '11-25' && form.earlyInteraction === 'no') { score += 10; flags.push('Large audience, low participation') }
  if (['26-50', '50+'].includes(form.audienceSize) && ['Mostly listening', 'Some discussion'].includes(form.role)) { score += 15; flags.push('Large audience, low participation') }
  if (form.materials.includes('Slides') && !form.materials.some((m) => ['Worksheet', 'Demo', 'Pre-read'].includes(m))) { score += 10; flags.push('Too much presentation time') }
  if (sectionCount > 4 && !decisionNamed) score += 10
  if (form.earlyInteraction === 'no') { score += 15; flags.push('No early interaction') }
  if (isMismatch(purpose, form.meetingType)) { score += 15; flags.push('Agenda-to-purpose mismatch') }

  if (measurableOutcome) score -= 15
  if (hasInteractiveAgenda) score -= 15
  if (['Some discussion', 'Active discussion', 'Decision-making', 'Hands-on activity', 'Mixed'].includes(form.role)) score -= 10
  if (len <= 30 && outcome) score -= 10
  if (form.materials.includes('Pre-read')) score -= 10
  if (form.decisionRequired === 'yes' && decisionNamed) score -= 15
  if (form.earlyInteraction === 'yes') score -= 10
  if (hasTimeBlocks) score -= 10

  if (form.decisionRequired === 'yes' && !decisionNamed) flags.push('Decision not named')
  if (form.meetingType === 'Status / Update' && form.decisionRequired === 'no' && !hasInteractiveAgenda) flags.push('Could be handled asynchronously')

 score = Math.max(0, Math.min(100, score))

const engagementScore = 100 - score

const label = engagementScore > 75
  ? 'Highly Engaging'
  : engagementScore > 50
    ? 'Moderately Engaging'
    : engagementScore > 25
      ? 'At Risk of Dragging'
      : 'This might be an email'

const uniqueFlags = [...new Set(flags)].slice(0, 5)

const observations = uniqueFlags.map((f) => observationText(f, form))

if (observations.length < 3) {
  observations.push(
    'The agenda includes clear structure and sequencing.',
    'Participants have defined roles beyond passive listening.',
    'The meeting design supports its intended outcome.'
  )
}

  const recommendations = uniqueFlags.slice(0, 3).map((flag) => {
    const [title, why, example] = recommendationsMap[flag] || recommendationsMap['Unclear outcome']
    return { title, why, example }
  })

  return {
    score: engagementScore,
    label,
    summary: buildSummary(engagementScore, uniqueFlags),
    observations: observations.slice(0, 5),
    recommendations,
    improvedAgenda: buildAgenda(form),
    flags: uniqueFlags,
  }
}


async function generateInsights({ score, flags, form }) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('Missing VITE_OPENAI_API_KEY')
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: 'You are a meeting coach. Return valid JSON only with keys: summary, observations, recommendations. observations must be an array of exactly 3 strings. recommendations must be an array of objects with title, why, example.'
            }
          ]
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: JSON.stringify({
                engagementScore: score,
                flags,
                purpose: form.purpose,
                agenda: form.agenda,
                outcome: form.outcome
              })
            }
          ]
        }
      ]
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status}`)
  }

  const data = await response.json()
  const content = data.output_text || data.output?.[0]?.content?.[0]?.text

  if (!content) {
    throw new Error('No model output')
  }

  const parsed = JSON.parse(content)

  if (!parsed.summary || !Array.isArray(parsed.observations) || !Array.isArray(parsed.recommendations)) {
    throw new Error('Invalid response shape')
  }

  return {
    summary: parsed.summary,
    observations: parsed.observations,
    recommendations: parsed.recommendations
  }
}

const buildSummary = (score, flags) => {
  if (score < 25) return 'Well-structured meeting with strong engagement design.'
  if (flags.includes('Agenda-to-purpose mismatch')) return 'The structure is solid, but the meeting lacks a clear throughline.'
  if (flags.includes('Passive audience risk')) return 'This meeting leans too heavily on passive listening.'
  if (flags.includes('Unclear outcome')) return 'The meeting lacks a clear, concrete outcome.'
  return 'This meeting will work, but a few design tweaks will improve engagement.'
}

const isMismatch = (purpose, type) => {
  if (!purpose) return false
  const map = {
    'Status / Update': ['update', 'status', 'inform'],
    'Decision-making': ['decide', 'decision', 'choose'],
    Brainstorm: ['ideas', 'brainstorm', 'create'],
    Training: ['learn', 'train', 'onboard'],
    Alignment: ['align', 'sync'],
    Retrospective: ['retro', 'reflect']
  }
  return map[type] ? !map[type].some((w) => purpose.includes(w)) : false
}

const observationText = (flag, form) => ({
  'Passive audience risk': 'Participants will mostly listen, which will likely lead to attention dropping off quickly.',
  'Too much presentation time': 'The meeting will feel presentation-heavy, which will limit discussion and engagement.',
  'Unclear outcome': 'The meeting will likely feel directionless because the outcome is not clearly defined.',
  'No early interaction': 'The meeting will start passively, which makes it harder to engage people later.',
  'Status meeting inflation': 'The meeting will likely drift into routine updates rather than meaningful discussion.',
  'Large audience, low participation': `Most of the ${form.audienceSize} participants will remain passive unless interaction is structured.`,
  'Agenda-to-purpose mismatch': 'The meeting will feel unfocused because the agenda does not clearly support the purpose.',
  'Decision not named': 'The meeting may end without a clear decision because it is not explicitly defined.',
  'Could be handled asynchronously': 'This will likely feel unnecessary as a live meeting and could have been handled asynchronously.'
}[flag] || 'The meeting will work, but there are opportunities to improve engagement.')

const buildAgenda = (form) => `1) Quick opener + interaction (5 min)\n2) Context tied to purpose: ${form.purpose || 'Define meeting purpose'} (10 min)\n3) Collaborative segment (${form.role.toLowerCase()}) (15 min)\n4) Decision / outcome checkpoint (10 min)\n5) Confirm owners, timeline, and next steps (5 min)`

const Field = ({ label, children }) => <label className="block"><p className="mb-1 text-sm font-semibold text-slate-700">{label}</p>{children}</label>
const DoubleRow = ({ children }) => <div className="grid gap-4 md:grid-cols-2">{children}</div>
const Card = ({ title, items }) => <div><h4 className="mb-2 text-lg font-bold text-white">{title}</h4><ul className="list-disc space-y-1 pl-5 text-slate-200">{items.map((item, idx) => <li key={idx}>{item}</li>)}</ul></div>

function Toggle({ label, value, onChange }) {
  return <div><p className="mb-1 text-sm font-semibold text-slate-700">{label}</p><div className="flex gap-2">{['yes', 'no'].map((opt) => <button key={opt} type="button" onClick={() => onChange(opt)} className={`rounded-lg px-4 py-2 font-semibold ${value === opt ? 'bg-teal text-navy' : 'bg-slate-200 text-slate-700'}`}>{opt.toUpperCase()}</button>)}</div></div>
}

function FormSelects({ form, setForm }) {
  const options = {
    audienceSize: ['1-5', '6-10', '11-25', '26-50', '50+'],
    seniority: ['Individual contributors', 'Managers', 'Directors', 'Executives', 'Mixed'],
    length: [['15', '15 minutes'], ['30', '30 minutes'], ['45', '45 minutes'], ['60', '60 minutes'], ['90', '90 minutes'], ['120', '120+ minutes']],
    meetingType: ['Status / Update', 'Decision-making', 'Brainstorm', 'Training', 'Kickoff', 'Alignment', 'Retrospective', 'Other'],
    role: ['Mostly listening', 'Some discussion', 'Active discussion', 'Decision-making', 'Hands-on activity', 'Mixed']
  }
  return <div className="grid gap-4 md:grid-cols-2">{Object.entries(options).map(([key, opts]) => <Field key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}><select value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full rounded-xl border p-3">{opts.map((opt) => Array.isArray(opt) ? <option key={opt[0]} value={opt[0]}>{opt[1]}</option> : <option key={opt}>{opt}</option>)}</select></Field>)}</div>
}

export default App
