import React, { useState, useRef, useMemo, useCallback } from 'react'
import '../styles/lovePurpose.css'
import { useGlassRipple } from '../hooks/useGlassRipple'
import { useQuestionTransition } from '../hooks/useQuestionTransition'
import DodgeNoButton from './DodgeNoButton'
import AnswerBurst from './AnswerBurst'
import AnimatedFlower from './AnimatedFlower'
import AnimatedHeart from './AnimatedHeart'

/* ============================================================
   CONFIG — change these to make it yours ❤️
   ============================================================ */
const CONFIG = {
  // Curiosity-building questions before the big moment.
  // Short Hinglish, quick to read. Any button just moves forward.
  questions: [
    {
      text: "Ek sawaal poochu?",
      sub: "kya tumhe lagta hai kuch log kismat se milte hain?",
      options: ["Shayad 👀", "Ho sakta hai"],
    },
    {
      text: "Dusra sawaal.",
      sub: "in kuch mahino mein tumhe bhi kuch alag sa laga?",
      options: ["Bolo na…", "Haan, thoda"],
    },
    {
      text: "Sach batao.",
      sub: "kabhi phone dekh ke bewajah smile aayi hai?",
      options: ["Nahi 🙈", "Guilty"],
    },
    {
      text: "Ek aakhri baat, phir main asli baat kahunga…",
      sub: "ready ho?",
      options: ["Bolo"],
    },
  ],
  // The big reveal — doesn't say "I love you" directly.
  finalHeadline: "Tum wo chapter ho jiski expect nahi thi.",
  finalSub: "Aur main is story ko yahin khatam nahi karna chahta.",
  finalQuestion: "Toh bas ek hi sawaal hai —",
  bigQuestion: "Mere banoge? 💫",
  acceptLabel: "Haan, banungi 💗",
  rejectLabel: "Nahi",
  // Celebration screen
  successTitle: "Pakka ho gaya 💍",
  successMessage: "Best decision! Hamesha aise hi hasate rehne ka promise.",
}

/* ============================================================
   Small helpers
   ============================================================ */
const HEART_EMOJIS = ['❤️', '💗', '💕', '💖', '💘']
const randBetween = (min, max) => Math.random() * (max - min) + min

/* Ambient floating hearts drifting up in the background */
function FloatingHearts({ count = 16 }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: randBetween(2, 96),
        size: randBetween(14, 30),
        duration: randBetween(9, 18),
        delay: randBetween(0, 10),
        emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
        drift: randBetween(-40, 40),
      })),
    [count]
  )

  return (
    <div className="lp-hearts-bg" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="lp-float-heart"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            '--drift': `${h.drift}px`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  )
}

/* Big celebratory heart/confetti burst shown after acceptance */
function CelebrationBurst({ count = 46 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: randBetween(0, 100),
        size: randBetween(14, 34),
        duration: randBetween(3.5, 6.5),
        delay: randBetween(0, 2.5),
        emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
        rotate: randBetween(-60, 60),
      })),
    [count]
  )

  return (
    <div className="lp-celebration-burst" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="lp-confetti-heart"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--rot': `${p.rotate}deg`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  )
}

/* ============================================================
   Main component
   ============================================================ */
const LovePurposeHindi = () => {
  // step: 0..N-1 = questions, N = final proposal, N+1 = accepted
  const totalQuestions = CONFIG.questions.length
  const [step, setStep] = useState(0)
  const [dodgeCount, setDodgeCount] = useState(0)
  const yesBtnRef = useRef(null)
  const { withRipple } = useGlassRipple()

  const isQuestionStep = step < totalQuestions
  const isProposalStep = step === totalQuestions
  const isAcceptedStep = step === totalQuestions + 1

  const goNext = useCallback(() => setStep((s) => s + 1), [])
  const { phase, burst, cardGlow, advance } = useQuestionTransition(goNext)

  const handleAnswer = withRipple((e) => advance(e))

  const handleDodge = useCallback(() => {
    setDodgeCount((c) => c + 1)
  }, [])

  const playfulNudge =
    dodgeCount === 0
      ? ''
      : dodgeCount < 3
      ? 'Nice try 😏'
      : dodgeCount < 6
      ? 'Ye click nahi hoga…'
      : dodgeCount < 10
      ? 'Ab bas bhi karo 😂'
      : 'Iska koi bharosa nahi.'

  return (
    <div className="lp-root">
      <FloatingHearts />
      <AnswerBurst point={burst} />

      <div className={`lp-card${cardGlow ? ' lp-card--glow' : ''}`}>
        {/* ---------------- Questions ---------------- */}
        {isQuestionStep && (
          <div className={`lp-question-panel ${phase}`} key={step}>
            <div className="lp-q-progress">
              <span className="lp-q-step-label">
                {String(step + 1).padStart(2, '0')} / {String(totalQuestions).padStart(2, '0')}
              </span>
              <div className="lp-q-progress-track" aria-hidden="true">
                <div
                  className="lp-q-progress-fill"
                  style={{ width: `${((step + 1) / totalQuestions) * 100}%` }}
                />
              </div>
              <div className="lp-dots" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={totalQuestions}>
                {CONFIG.questions.map((_, i) => (
                  <span
                    key={i}
                    className={`lp-dot${i < step ? ' done' : ''}${i === step ? ' active' : ''}`}
                  />
                ))}
              </div>
            </div>
            <div className="lp-question-top">
              <div className="lp-question-hearts">
                <AnimatedHeart side="left" />
                <AnimatedHeart side="right" />
              </div>
              <div className="lp-question-header">
                <AnimatedFlower side="left" />
                <div className="lp-question-header-text">
                  <div className="lp-question-text">{CONFIG.questions[step].text}</div>
                  <div className="lp-question-sub">{CONFIG.questions[step].sub}</div>
                </div>
                <AnimatedFlower side="right" />
              </div>
            </div>
            <div className="lp-q-flourish" aria-hidden="true">♡ ♡ ♡</div>
            <div className="lp-options">
              {CONFIG.questions[step].options.map((opt, i) => (
                <button key={i} className="lp-btn lp-btn-ghost" onClick={handleAnswer}>
                  <span className="lp-btn-label">{opt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- Proposal ---------------- */}
        {isProposalStep && (
          <div className={`lp-stage ${phase}`} key="proposal">
            <div className="lp-stage-inner">
              <div style={{fontWeight:"bold"}} className="lp-signature-line">Mery Liyay,</div>
              <div style={{fontWeight:"bold"}} className="lp-headline">{CONFIG.finalHeadline}</div>
              <div style={{fontWeight:"bold"}} className="lp-subline">{CONFIG.finalSub}</div>
              <div className="lp-subline" style={{ marginTop: 6, fontWeight: 'bold' }}>{CONFIG.finalQuestion}</div>
              <div style={{fontWeight:"bold"}} className="lp-big-question">{CONFIG.bigQuestion}</div>

              <div className="lp-proposal-actions">
                <div className="lp-btn-row">
                  <button
                    ref={yesBtnRef}
                    className="lp-btn lp-btn-primary lp-btn-yes"
                    onClick={handleAnswer}
                  >
                    <span className="lp-btn-label">{CONFIG.acceptLabel}</span>
                  </button>
                </div>
                {playfulNudge ? <div className="lp-nudge">{playfulNudge}</div> : null}
              </div>
              <DodgeNoButton
                yesBtnRef={yesBtnRef}
                label={CONFIG.rejectLabel}
                onDodge={handleDodge}
              />
            </div>
          </div>
        )}

        {/* ---------------- Accepted ---------------- */}
        {isAcceptedStep && (
          <div className={`lp-success-panel ${phase}`} key="success">
            <CelebrationBurst />
            <div className="lp-teddy">🧸💗</div>
            <div className="lp-success-title">{CONFIG.successTitle}</div>
            <div className="lp-success-msg">{CONFIG.successMessage}</div>
            <div className="lp-pulse-hearts">
              <span>❤️</span>
              <span>💖</span>
              <span>💕</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LovePurposeHindi