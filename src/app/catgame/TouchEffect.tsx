"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import "./TouchEffect.css"

interface TouchEffectProps {
  x: number
  y: number
  onComplete: () => void
}

export function TouchEffect({ x, y, onComplete }: TouchEffectProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 300)
    }, 500)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return createPortal(
    <div className="touch-effect" style={{ left: x, top: y }}>
      <span className="touch-effect__icon">🐾</span>
      <span className="touch-effect__text">+10</span>
    </div>,
    document.body
  )
}
