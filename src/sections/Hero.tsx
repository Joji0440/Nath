import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Garden } from '../components/Garden'

export function Hero() {
  const [isVisible, setIsVisible] = useState(true)
  const [showGarden, setShowGarden] = useState(false)

  const handleDiscover = () => {
    console.log('Discover clicked!')
    // Trigger confetti
    const colors = ['#f472b6', '#fb7185', '#f59e0b', '#60a5fa', '#a78bfa']
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors,
      ticks: 250,
      scalar: 1.2,
      drift: 0.6,
    })
    setTimeout(() =>
      confetti({ particleCount: 60, spread: 100, origin: { y: 0.4 }, colors, scalar: 0.9 }),
      200
    )

    // Hide content after a short delay
    setTimeout(() => {
      console.log('Hiding hero...')
      setIsVisible(false)
    }, 600)
    setTimeout(() => {
      console.log('Showing garden!')
      setShowGarden(true)
    }, 1000)
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4">
      <AnimatePresence>
        {isVisible && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <m.h1
              className="text-glow bg-clip-text text-center text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl bg-linear-to-r from-pink-500 via-fuchsia-500 to-orange-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              Para ti, con mucho cariño
            </m.h1>

            <m.div
              className="mt-10"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <button
                onClick={handleDiscover}
                className="shine rounded-full bg-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:scale-[1.02] hover:bg-pink-600 active:scale-95"
              >
                Descubrir
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      {showGarden && <Garden />}
    </div>
  )
}
