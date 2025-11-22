import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Hero } from './sections/Hero'
import { AnimatedBackground } from './components/AnimatedBackground'

function App() {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play()
        } catch (err) {
          console.log('Autoplay bloqueado, esperando interacción del usuario')
          const playOnInteraction = () => {
            audioRef.current?.play()
            document.removeEventListener('click', playOnInteraction)
            document.removeEventListener('keydown', playOnInteraction)
          }
          document.addEventListener('click', playOnInteraction)
          document.addEventListener('keydown', playOnInteraction)
        }
      }
    }
    playAudio()
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen flex items-center justify-center text-neutral-100">
        <AnimatedBackground />
        <audio ref={audioRef} loop>
          <source src="/background.mp3" type="audio/mpeg" />
        </audio>
        <main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-0 sm:py-0 text-center">
          <AnimatePresence mode="wait">
            <m.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <Hero />
            </m.section>
          </AnimatePresence>
        </main>
      </div>
    </LazyMotion>
  )
}

export default App
