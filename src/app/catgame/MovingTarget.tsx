"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import type { Difficulty, Position } from "./atoms"
import "./MovingTarget.css"

interface MovingTargetProps {
  position: Position
  size: number
  difficulty: Difficulty
  containerWidth: number
  containerHeight: number
  onHit: () => void
}

interface Velocity {
  x: number
  y: number
}

const getSpeedMultiplier = (difficulty: Difficulty): number => {
  const multipliers: Record<Difficulty, number> = {
    easy: 1,
    normal: 1.5,
    hard: 2.2,
    expert: 3,
  }
  return multipliers[difficulty] || 1.5
}

const getTargetSize = (difficulty: Difficulty): number => {
  const sizes: Record<Difficulty, number> = {
    easy: 80,
    normal: 60,
    hard: 45,
    expert: 35,
  }
  return sizes[difficulty] || 60
}

const createVelocity = (difficulty: Difficulty): Velocity => {
  const speed = 3 * getSpeedMultiplier(difficulty)
  const angle = Math.random() * Math.PI * 2
  return {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed,
  }
}

export function MovingTarget({
  position,
  difficulty,
  containerWidth,
  containerHeight,
  onHit,
}: MovingTargetProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [currentPos, setCurrentPos] = useState<Position>(position)
  const [velocity, setVelocity] = useState<Velocity>(() => createVelocity(difficulty))
  const [isHit, setIsHit] = useState(false)
  const [scale, setScale] = useState(1)

  const animationFrameRef = useRef<number | null>(null)
  const directionIntervalRef = useRef<number | null>(null)

  useEffect(() => {
    setCurrentPos({ x: position.x, y: position.y })
    setVelocity(createVelocity(difficulty))
  }, [position.x, position.y, difficulty])

  useEffect(() => {
    const targetSize = getTargetSize(difficulty)
    const padding = targetSize / 2 + 10
    const maxX = containerWidth - padding
    const maxY = containerHeight - padding
    const minX = padding
    const minY = padding

    if (maxX <= minX || maxY <= minY) return

    const animate = () => {
      setCurrentPos((prevPos) => {
        let newX = prevPos.x + velocity.x
        let newY = prevPos.y + velocity.y

        let bouncedX = false
        let bouncedY = false

        if (newX <= minX) {
          newX = minX + 2
          bouncedX = true
        } else if (newX >= maxX) {
          newX = maxX - 2
          bouncedX = true
        }

        if (newY <= minY) {
          newY = minY + 2
          bouncedY = true
        } else if (newY >= maxY) {
          newY = maxY - 2
          bouncedY = true
        }

        if (bouncedX || bouncedY) {
          setVelocity({
            x: bouncedX ? -velocity.x : velocity.x,
            y: bouncedY ? -velocity.y : velocity.y,
          })
          setScale(1.2)
          setTimeout(() => setScale(1), 100)
        }

        return { x: newX, y: newY }
      })

      if (!isHit) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    if (!isHit) {
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [containerWidth, containerHeight, velocity, isHit])

  // 定期概率性改变方向
  useEffect(() => {
    directionIntervalRef.current = window.setInterval(() => {
      if (Math.random() < 0.3 && !isHit) {
        const speed = 3 * getSpeedMultiplier(difficulty)
        const currentAngle = Math.atan2(velocity.y, velocity.x)
        const newAngle = currentAngle + (Math.random() - 0.5) * Math.PI

        setVelocity({
          x: Math.cos(newAngle) * speed,
          y: Math.sin(newAngle) * speed,
        })
      }
    }, 1000)

    return () => {
      if (directionIntervalRef.current) {
        clearInterval(directionIntervalRef.current)
      }
    }
  }, [velocity, isHit, difficulty])

  const triggerHit = useCallback(() => {
    if (isHit) return

    setIsHit(true)
    setScale(1.3)

    setTimeout(() => {
      onHit()
      setIsHit(false)
      setScale(1)

      const targetSize = getTargetSize(difficulty)
      const padding = targetSize / 2 + 10
      const maxX = containerWidth - padding
      const maxY = containerHeight - padding
      const minX = padding
      const minY = padding

      const newX = minX + Math.random() * (maxX - minX)
      const newY = minY + Math.random() * (maxY - minY)

      setCurrentPos({ x: newX, y: newY })
      setVelocity(createVelocity(difficulty))
    }, 150)
  }, [isHit, onHit, difficulty, containerWidth, containerHeight])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      triggerHit()
    },
    [triggerHit]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      triggerHit()
    },
    [triggerHit]
  )

  const currentSize = getTargetSize(difficulty)
  const targetStyle: React.CSSProperties = {
    left: `${currentPos.x}px`,
    top: `${currentPos.y}px`,
    width: `${currentSize}px`,
    height: `${currentSize}px`,
    transform: `translate(-50%, -50%) scale(${scale})`,
  }

  return (
    <div
      ref={elementRef}
      className={`moving-target ${isHit ? "moving-target--hit" : ""}`}
      style={targetStyle}
      onTouchStart={handleTouchStart}
      onMouseDown={handleMouseDown}
    >
      <div className="moving-target__inner">
        <span className="moving-target__icon">🐟</span>
        <span className="moving-target__shadow" />
      </div>
      <div className="moving-target__glow" />
    </div>
  )
}
