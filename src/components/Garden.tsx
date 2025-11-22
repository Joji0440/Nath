import { m } from 'framer-motion'
import { useMemo, useEffect, useState } from 'react'
import './garden.css'
import { HeartClickGame, GameEnd, ChallengeResult } from './Game'

interface FlowerCfg { x: number; height: number; lean: number; scale: number; delay: number; variant?: 'yellow' | 'cyan' | 'rose' }

function Flower({ cfg }: { cfg: FlowerCfg }) {
  const petalColor = cfg.variant === 'cyan' ? 'var(--petal-cyan)' : cfg.variant === 'rose' ? 'var(--petal-rose)' : 'var(--petal-yellow)'
  const petalEdge = cfg.variant === 'cyan' ? 'var(--petal-cyan-edge)' : cfg.variant === 'rose' ? 'var(--petal-rose-edge)' : 'var(--petal-yellow-edge)'
  
  return (
    <div
      className={`flower wind-stem-slow`}
      style={{ position: 'absolute', left: `calc(50% + ${cfg.x}vmin)`, bottom: '8vmin', transform: `translateX(-50%) scale(${cfg.scale}) rotate(${cfg.lean}deg)` }}
    >
      <div className={`flower__leafs wind-petal`} style={{ animationDelay: `${0.2 + cfg.delay}s` }}>
        {[1,2,3,4].map(i => (
          <div key={i} className={`flower__leaf flower__leaf--${i}`} style={{ background: `linear-gradient(to top, ${petalColor}, ${petalEdge})` }}></div>
        ))}
        <div className="flower__white-circle" />
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className={`flower__light flower__light--${i}`} style={{ animationDelay: `${1 + i*0.15 + cfg.delay}s` }} />
        ))}
      </div>
      <div className="flower__line" style={{ height: `${cfg.height}vmin`, animationDelay: `${cfg.delay}s` }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className={`flower__line__leaf wind-leaf flower__line__leaf--${i}`} style={{ left: i%2? '90%':'-40%', transform: `scale(${0.7 + i*0.05}) rotate(${i%2? '-25deg':'25deg'})`, animationDelay: `${0.8 + i*0.2 + cfg.delay}s` }} />
        ))}
      </div>
    </div>
  )
}

function Foliage() {
  return (
    <div className="foliage">
      {/* Long grass groups - left side */}
      {[0, 1, 2, 3].map(gi => (
        <div key={`lg-l${gi}`} className={`long-g long-g--${gi}`}>
          {[0,1,2,3].map(li => (
            <div key={li} className="grow-ans" style={{ '--d': `${3 + li*0.2 + gi*0.1}s` } as React.CSSProperties}>
              <div className={`leaf leaf--${li}`} />
            </div>
          ))}
        </div>
      ))}

      {/* Grass cluster 1 */}
      <div className="grow-ans" style={{ '--d': '2.2s' } as React.CSSProperties}>
        <div className="flower__grass flower__grass--1">
          <div className="flower__grass--top" />
          <div className="flower__grass--bottom" />
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className={`flower__grass__leaf flower__grass__leaf--${i}`} />
          ))}
        </div>
      </div>

      {/* Grass cluster 2 */}
      <div className="grow-ans" style={{ '--d': '2.5s' } as React.CSSProperties}>
        <div className="flower__grass flower__grass--2">
          <div className="flower__grass--top" />
          <div className="flower__grass--bottom" />
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className={`flower__grass__leaf flower__grass__leaf--${i}`} />
          ))}
        </div>
      </div>

      {/* Right grass groups */}
      <div className="grow-ans" style={{ '--d': '2.4s' } as React.CSSProperties}>
        <div className="flower__g-right flower__g-right--1">
          <div className="leaf" />
        </div>
      </div>
      <div className="grow-ans" style={{ '--d': '2.8s' } as React.CSSProperties}>
        <div className="flower__g-right flower__g-right--2">
          <div className="leaf" />
        </div>
      </div>

      {/* Front grass with multiple leaves */}
      <div className="grow-ans" style={{ '--d': '2.8s' } as React.CSSProperties}>
        <div className="flower__g-front">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className={`flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--${i}`}>
              <div className="flower__g-front__leaf" />
            </div>
          ))}
          <div className="flower__g-front__line" />
        </div>
      </div>

      {/* Long grass groups - right side */}
      {[4, 5, 6, 7].map(gi => (
        <div key={`lg-r${gi}`} className={`long-g long-g--${gi}`}>
          {[0,1,2,3].map(li => (
            <div key={li} className="grow-ans" style={{ '--d': `${3.2 + li*0.2 + (gi-4)*0.15}s` } as React.CSSProperties}>
              <div className={`leaf leaf--${li}`} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// Old HeartField removed (superseded by RandomHearts)

export function Garden() {
  // Left and right groups leaving center gap (~12vmin)
  const flowers: FlowerCfg[] = [
    // Left trio farther from center
    { x: -60, height: 39, lean: -11, scale: 0.78, delay: 0.05, variant: 'yellow' },
    { x: -50, height: 47, lean: -7, scale: 0.9, delay: 0.12, variant: 'cyan' },
    { x: -40, height: 43, lean: -4, scale: 0.85, delay: 0.18, variant: 'rose' },
    // Right trio farther from center
    { x: 40, height: 45, lean: 5, scale: 0.87, delay: 0.09, variant: 'rose' },
    { x: 50, height: 49, lean: 8, scale: 0.93, delay: 0.15, variant: 'yellow' },
    { x: 60, height: 37, lean: 12, scale: 0.76, delay: 0.22, variant: 'cyan' },
  ]
  const [showPlay, setShowPlay] = useState(false)
  // stage flow extended for "Sí" branch challenge
  // none -> prompt -> challengeIntro -> challengeInstructions -> challengeCountdown -> gameChallenge -> (winMsg -> gameChallenge2) | (challengeResult lose -> retry)
  // after second win -> letterTease (envelope moves) -> letterOpen
  const [stage, setStage] = useState<
    | 'none' | 'prompt'
    | 'challengeIntro' | 'challengeInstructions' | 'challengeCountdown' | 'gameChallenge'
    | 'challengeResult' | 'challengeWinMessage'
    | 'gameChallenge2' | 'challenge2Result'
    | 'letterTease' | 'letterOpen'
    | 'yesPending' | 'game' | 'ended' | 'no'
  >('none')
  const [finalScore, setFinalScore] = useState<number|null>(null)
  const [challengeOutcome, setChallengeOutcome] = useState<{win:boolean; score:number} | null>(null)
  const [countdown, setCountdown] = useState(3)
  const [envelopeClicks, setEnvelopeClicks] = useState(0)
  const [envelopePos, setEnvelopePos] = useState<{top:number; left:number}>({ top: 50, left: 50 })
  const [teaseMsg, setTeaseMsg] = useState<string>('')

  useEffect(() => {
    // Aparece el botón después de que termina la secuencia de crecimiento (~6s)
    const t = setTimeout(() => setShowPlay(true), 6000)
    return () => clearTimeout(t)
  }, [])

  const endGame = (score:number) => {
    setStage('ended')
    setFinalScore(score)
  }
  // Countdown for challenge
  useEffect(() => {
    if (stage !== 'challengeCountdown') return
    if (countdown <= 0) {
      setStage('gameChallenge')
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [stage, countdown])

  const handleChallengeComplete = (win:boolean, score:number) => {
    if (win) {
      // If win in first round, show increased difficulty message
      setChallengeOutcome({ win, score })
      setStage('challengeWinMessage')
    } else {
      setChallengeOutcome({ win, score })
      setStage('challengeResult')
    }
  }

  const retryChallenge = () => {
    setChallengeOutcome(null)
    setCountdown(3)
    setStage('challengeInstructions')
  }

  const handleChallenge2Complete = (win:boolean, score:number) => {
    if (win) {
      setChallengeOutcome({ win, score })
      // Prep envelope stage
      setEnvelopeClicks(0)
      setTeaseMsg('Busca la carta en el jardín ✉️')
      // Inicialmente, ubica la carta en una esquina inferior-derecha para no tapar el texto
      setEnvelopePos({ top: 78, left: 82 })
      setStage('letterTease')
    } else {
      setChallengeOutcome({ win, score })
      setStage('challenge2Result')
    }
  }

  const randomEnvelopePos = () => {
    const top = 12 + Math.random() * 70 // avoid very top/bottom
    const left = 8 + Math.random() * 84 // avoid edges
    return { top, left }
  }

  const onEnvelopeClick = () => {
    setEnvelopeClicks(c => {
      const next = c + 1
      if (next === 1) {
        setEnvelopePos(randomEnvelopePos())
        setTeaseMsg('¡Uy! se movió 😝')
      } else if (next === 2) {
        setEnvelopePos(randomEnvelopePos())
        setTeaseMsg('¡Uy! de nuevo 🤣')
      } else if (next === 3) {
        setTeaseMsg('Ok ok... abre la carta...')
      } else if (next >= 4) {
        setStage('letterOpen')
      }
      return next
    })
  }


  const restart = () => {
    setFinalScore(null)
    setStage('game')
  }

  // NO option flow
  useEffect(() => {
    if (stage === 'no') {
      const to = setTimeout(() => {
        window.location.href = 'https://www.google.com/webhp?hl=es-419&sa=X&ved=0ahUKEwju5pGpp4KRAxV9SDABHUdLINoQPAgJ&zx=1763696730340&no_sw_cr=1'
      }, 1800)
      return () => clearTimeout(to)
    }
  }, [stage])

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 h-screen pointer-events-none overflow-hidden">
      <m.div
        initial={{ y: 140, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-green-900/90 via-green-700/70 to-transparent"
      />
      <Foliage />
      <div className="flowers-stage">
        {flowers.map((f, i) => <Flower key={i} cfg={f} />)}
      </div>
      <RandomHearts />
      {showPlay && stage==='none' && (
        <div className="play-overlay">
          <button className="play-button" onClick={() => setStage('prompt')}>PLAY</button>
        </div>
      )}
      {stage==='prompt' && (
        <div className="prompt-overlay">
          <div className="prompt-box">
            <h3>¿Quieres saber qué dice la carta ✉️?</h3>
            <div className="options-row">
              <button className="option-btn" onClick={() => setStage('challengeIntro')}>Sí</button>
              <button className="option-btn secondary" onClick={() => setStage('no')}>No</button>
            </div>
          </div>
        </div>
      )}
            {stage==='challengeIntro' && (
              <div className="prompt-overlay">
                <div className="prompt-box" style={{ maxWidth:'56vmin' }}>
                  <h3>Esta bien... pero antes debe ganarme en un juego 😎</h3>
                  <div style={{ display:'flex', justifyContent:'center', marginTop:'2vmin' }}>
                    <button className="option-btn" onClick={() => setStage('challengeInstructions')}>OK</button>
                  </div>
                </div>
              </div>
            )}
            {stage==='challengeInstructions' && (
              <div className="prompt-overlay">
                <div className="prompt-box" style={{ maxWidth:'60vmin' }}>
                  <h3>Debes atrapar 20 corazones 🩷 en 10 segundos</h3>
                  <p style={{ fontSize:'2.2vmin', margin:'1vmin 0 2vmin', color:'#fff' }}>¿Estas lista? 😏</p>
                  <div style={{ display:'flex', justifyContent:'center' }}>
                    <button className="option-btn" onClick={() => { setCountdown(3); setStage('challengeCountdown') }}>Estoy lista</button>
                  </div>
                </div>
              </div>
            )}
            {stage==='challengeCountdown' && (
              <div className="prompt-overlay">
                <div className="prompt-box" style={{ maxWidth:'40vmin' }}>
                  <h3 style={{ fontSize:'8vmin', margin:'2vmin 0' }}>{countdown === 0 ? '¡Go!' : countdown}</h3>
                </div>
              </div>
            )}
            {stage==='gameChallenge' && (
              <HeartClickGame durationSeconds={10} targetScore={20} onComplete={handleChallengeComplete} />
            )}
            {stage==='challengeResult' && challengeOutcome && (
              <ChallengeResult win={false} score={challengeOutcome.score} target={20} onRetry={retryChallenge} />
            )}
            {stage==='challengeWinMessage' && (
              <div className="prompt-overlay">
                <div className="prompt-box" style={{ maxWidth:'66vmin' }}>
                  <h3>Eres muy buena 😧.. pero no te lo dejaré fácil 😤</h3>
                  <p style={{ fontSize:'2.2vmin', color:'#fff', margin:'1vmin 0 2vmin' }}>Veamos si puedes con 3 segundos menos 😏</p>
                  <div style={{ display:'flex', justifyContent:'center' }}>
                    <button className="option-btn" onClick={() => setStage('gameChallenge2')}>Vamos</button>
                  </div>
                </div>
              </div>
            )}
            {stage==='gameChallenge2' && (
              <HeartClickGame durationSeconds={7} targetScore={20} onComplete={handleChallenge2Complete} />
            )}
            {stage==='challenge2Result' && challengeOutcome && (
              <ChallengeResult win={false} score={challengeOutcome.score} target={20} onRetry={() => setStage('gameChallenge2')} />
            )}
            {stage==='letterTease' && (
              <div className="prompt-overlay" style={{ pointerEvents:'auto' }}>
                <div className="prompt-box" style={{ maxWidth:'54vmin' }}>
                  <h3>Felicidades, parece que realmente quieres saber qué dice la carta...</h3>
                  <p style={{ fontSize:'2.2vmin', color:'#fff', margin:'1vmin 0 2vmin' }}>{teaseMsg}</p>
                </div>
                <div
                  onClick={onEnvelopeClick}
                  style={{
                    position:'absolute',
                    top: `${envelopePos.top}%`,
                    left: `${envelopePos.left}%`,
                    transform:'translate(-50%, -50%)',
                    width:'10vmin', height:'8vmin', cursor:'pointer',
                    transition:'top 280ms ease, left 280ms ease, transform 120ms ease'
                  }}
                  title="Carta"
                >
                  <svg viewBox="0 0 64 48" width="100%" height="100%">
                    <rect x="2" y="6" width="60" height="36" rx="6" fill="#ffe8cc" stroke="#ffb86b" strokeWidth="2"/>
                    <path d="M4 10 L32 30 L60 10" fill="none" stroke="#ffb86b" strokeWidth="2"/>
                    <path d="M4 42 L26 26" fill="none" stroke="#ffb86b" strokeWidth="2"/>
                    <path d="M60 42 L38 26" fill="none" stroke="#ffb86b" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            )}
            {stage==='letterOpen' && (
              <div className="prompt-overlay">
                <div className="prompt-box" style={{ maxWidth:'70vmin' }}>
                  <h3>✉️ Para Nathaly 🩷 </h3>
                  <p style={{ fontSize:'2.2vmin', color:'#fff', lineHeight:1.6 }}>
                    Hoy quiero desearte un cumpleaños lleno de alegría, y que esa felicidad te acompañe hoy, mañana y siempre. También quiero recordarte lo especial que eres para mí. Cada momento que hemos compartido se ha convertido en un tesoro que guardo con todo el cariño de mi corazón.<br/><br/>
                    Tu sonrisa ilumina mis días, tu presencia abraza mi alma y hace que todo cobre un brillo distinto. Eres increíble y llena de bondad, de alegría y de una energía que contagia a cualquiera que tengas cerca.<br/><br/>
                    Gracias por ser tú, por despertar emociones hermosas en mí cada vez que te miro y por volver mi mundo un lugar más vivo y más bonito simplemente con estar.<br/><br/>
                    Feliz cumpleaños.Te quiero Mucho...Realmente Mucho❤️<br/> 
                  </p>
                </div>
              </div>
            )}
      {stage==='no' && (
        <div className="sad-message">😢<div>ni modo... chao</div></div>
      )}
      {stage==='yesPending' && finalScore==null && (
        <div className="prompt-overlay">
          <div className="prompt-box" style={{ maxWidth:'50vmin' }}>
            <h3>Perfecto 💚</h3>
            <p style={{ fontSize:'2.2vmin', color:'#fff', margin:'0 0 2vmin' }}>Dime y seguimos con la sorpresa de la carta cuando me lo indiques.</p>
            <div style={{ display:'flex', justifyContent:'center' }}>
              <button className="option-btn" style={{ background:'linear-gradient(140deg,#083d1a,#0d7a35 55%,#37d977)', color:'#fff' }} onClick={() => setStage('game')}>(Usar juego ahora)</button>
            </div>
          </div>
        </div>
      )}
      {stage==='game' && finalScore == null && (
        <HeartClickGame onEnd={endGame} />
      )}
      {finalScore != null && stage==='ended' && (
        <GameEnd score={finalScore} onRestart={restart} />
      )}
    </div>
  )
}

// Hearts scattered randomly across viewport (stable after first render)
function RandomHearts() {
  const hearts = useMemo(() => {
    const arr: { top:number; left:number; size:number; delay:number; duration:number; tilt:number; scale:number }[] = []
    const max = 18
    let attempts = 0
    while (arr.length < max && attempts < max * 30) {
      attempts++
      const top = 6 + Math.random()*68 // extend higher & lower
      const left = 2 + Math.random()*96
      // Avoid central cluster horizontal band near flowers (approx middle area)
      if (top < 15 && left > 35 && left < 65) continue
      // Enforce minimal Euclidean distance between hearts (in percentage space)
      const minDist = 11
      let tooClose = false
      for (const h of arr) {
        const dx = h.left - left
        const dy = h.top - top
        if (Math.sqrt(dx*dx + dy*dy) < minDist) { tooClose = true; break }
      }
      if (tooClose) continue
      arr.push({
        top,
        left,
        size: 4.5 + Math.random()*13,
        delay: Math.random()*8, // appear slower
        duration: 5 + Math.random()*6, // slower float cycle
        tilt: -30 + Math.random()*60,
        scale: 0.6 + Math.random()*0.8,
      })
    }
    return arr
  }, [])
  return (
    <div className="bubbles" style={{ zIndex:3 }}>
      {hearts.map((h, i) => (
        <div
          key={i}
          className="bubble"
          style={{
            top: `${h.top}%`,
            left: `${h.left}%`,
            width: `${h.size}vmin`,
            height: `${h.size}vmin`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            transform: `rotate(${h.tilt}deg) scale(${h.scale})`,
          }}
        >
          <svg className="heart" viewBox="0 0 32 32" style={{ animationDuration: `${h.duration}s` }}>
            <path d="M23.6 2c-3.363 0-6.258 2.736-7.599 5.594-1.342-2.858-4.237-5.594-7.601-5.594-4.637 0-8.4 3.764-8.4 8.401 0 9.433 9.516 11.906 16.001 21.232 6.13-9.268 15.999-12.1 15.999-21.232 0-4.637-3.763-8.401-8.4-8.401z" />
          </svg>
        </div>
      ))}
    </div>
  )
}
