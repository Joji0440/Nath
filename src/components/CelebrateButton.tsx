import confetti from 'canvas-confetti'

type Props = {
  label?: string
}

export function CelebrateButton({ label = 'Celebrar' }: Props) {
  const fire = () => {
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
  }

  return (
    <button
      onClick={fire}
      className="shine rounded-full bg-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:scale-[1.02] hover:bg-pink-600 active:scale-95"
    >
      {label}
    </button>
  )
}
