import React, { useEffect, useRef } from 'react'

export default function MatrixRain() {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const columns = Math.floor(width / 14)
    const drops = new Array(columns).fill(1)
    const charset = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = '#00ff99'
      ctx.font = '14px JetBrains Mono, monospace'

      for (let i = 0; i < drops.length; i++) {
        const text = charset[Math.floor(Math.random() * charset.length)]
        const x = i * 14
        const y = drops[i] * 16
        ctx.fillText(text, x, y)

        if (y > height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    const onResize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    window.addEventListener('resize', onResize)
    draw()

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}
