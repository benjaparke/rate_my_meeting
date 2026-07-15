# 📊 Rate My Meeting

> Stress-test your agenda *before* people start checking out

A web app that helps you design engaging meetings by evaluating your agenda, identifying risks, and suggesting concrete improvements before you hit "send invite."

![React](https://img.shields.io/badge/React-18.3.1-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.13-06B6D4)
![Vite](https://img.shields.io/badge/Vite-5.4.8-purple)
![Live](https://img.shields.io/badge/Live-Vercel-000000)

## The Problem

You schedule a meeting. The agenda looks reasonable. Then:

- People stop talking 10 minutes in
- Nobody's clear what you're deciding
- It becomes another status update
- Someone says "this could've been an email"

**Solution?** Test your meeting design before you book the room.

## What It Does

1. **Enter your meeting details**: agenda, purpose, audience, duration, and materials
2. **Get a reality check**: Engagement score (0–100) based on meeting design patterns
3. **See what's likely to happen**: Specific observations about engagement risks
4. **Get actionable fixes**: Concrete suggestions to improve your meeting
5. **See an improved agenda**: Auto-generated restructured agenda with time blocks

### Scoring Criteria

The app evaluates:
- **Clarity**: Is the outcome explicitly defined?
- **Participation**: Is there structured interaction, or just listening?
- **Fit**: Does the duration match the agenda?
- **Structure**: Are there time blocks and decision points?
- **Async potential**: Could this be handled without real-time discussion?

### Example Findings

| Input | Score | Risk | Suggestion |
|-------|-------|------|-----------|
| 60-min status meeting, mostly listening, no outcome stated | 22 | "This might be an email" | Move to async + reserve meeting for blockers only |
| 30-min strategic planning, interactive breakout, clear decision | 89 | None | Ship it |
| 45-min training with slides only, large audience | 41 | "Passive audience risk" | Add hands-on practice or worksheet |

## Features

- **Instant feedback**: Get your score in ~20 seconds
- **Sample agendas**: Load templates (weekly update, strategy, onboarding) to see best practices
- **Beautiful UI**: Dark mode, color-coded scores, easy-to-read cards
- **AI-powered insights**: Deeper analysis with GPT-4o-mini (optional)
- **Improved agenda generation**: Automatically restructured agenda with suggested sections
- **Responsive design**: Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React 18.3.1
- **Build**: Vite 5.4.8
- **Styling**: Tailwind CSS 3.4.13 + PostCSS
- **AI**: OpenAI API (optional, for deeper insights)
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/benjaparke/rate_my_meeting.git
cd rate_my_meeting

# Install dependencies
npm install
```

### Development

```bash
# Start the dev server (http://localhost:5173)
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Optional: Enable AI Insights

To unlock AI-powered meeting analysis:

1. Get an OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)
2. Add to `.env.local`:
   ```
   VITE_OPENAI_API_KEY=sk-your-key-here
   ```
3. On Vercel, add the same variable to Environment Variables in project settings

Without the key, the app still works—you'll get rule-based feedback instead.

## Live Demo

**[rate-my-meeting-silk.vercel.app](https://rate-my-meeting-silk.vercel.app)**

Try it with:
- Your actual meeting agenda (no one will know)
- A sample template (Weekly Update, Strategy, Onboarding)
- A notoriously bad meeting from your calendar (for science)

## How to Use

### For Meeting Organizers

1. **Before you send invites**: Paste your agenda, purpose, and expected outcome
2. **Check your score**: Is it 75+? Great, hit send. Is it <50? Redesign it
3. **Read the risks**: Understand what will likely derail engagement
4. **Apply the fixes**: Use the suggested improvements to reshape your agenda
5. **Use the improved agenda**: Swap yours for the generated one

### For Meeting Attendees

- Use it to pressure-test meeting invites you receive
- Send feedback to organizers with specific suggestions
- Track patterns in your calendar ("Our standups are all 22s...")

### For Team Leads

- Build a culture of intentional meeting design
- Use this as part of your meeting norms
- Reference sample agendas in team guidelines

## Design Philosophy

**Good meetings are not accidental.** They're the result of:

1. **Clear outcomes**: Everyone knows what success looks like
2. **Structured participation**: People talk, not just listen
3. **Right format**: Status → async, decisions → sync, learning → interactive
4. **Tight timing**: Agenda sections have time blocks
5. **Async prerequisites**: Pre-reads, dashboards, and context *before* the meeting

This tool helps you audit meetings against these principles.

## Scoring Reference

- **75–100 ("Highly Engaging")**: Ship it. Minor tweaks optional.
- **50–74 ("Moderately Engaging")**: Solid structure, but a few friction points.
- **25–49 ("At Risk of Dragging")**: Redesign needed before inviting the team.
- **0–24 ("This might be an email")**: Consider whether this should be a meeting at all.

## Common Red Flags & Fixes

| Red Flag | Why It's Bad | Quick Fix |
|----------|-------------|-----------|
| No clear outcome | Meeting feels directionless | Add: "By end of this meeting, we will **[decide/assign/confirm]** X" |
| Mostly listening | Passive audiences disengage | Add a structured input every 10–15 min (poll, round-robin, Q&A) |
| 60+ min with no breaks | Attention drops sharply | Break into two shorter meetings or add interactive segments |
| Status-only agenda | Could be async | Move updates to Slack/doc, reserve meeting for blockers + decisions |
| Large audience, no structure | Most people stay silent | Use breakout groups, role assignments, or written input first |
| No materials | People can't prepare | Add pre-read, worksheet, or demo link |

## Customization

The app comes with built-in templates and recommendation rules. To modify:

- **Sample agendas**: Edit `sampleAgendas` object in `src/App.jsx`
- **Scoring logic**: Adjust conditions in `scoreMeeting()` function
- **Recommendations**: Update `recommendationsMap` with your team's best practices
- **Styling**: Tweak Tailwind config in `tailwind.config.js`

## Contributing

Found a bug? Have a better red flag to detect? Want to add more templates?

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Open a PR with details

## License

MIT - Use freely, remix it, share it with your team.

---

**The ultimate meeting compliment**: "That was actually productive." 🎯
