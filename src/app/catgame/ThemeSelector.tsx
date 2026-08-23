"use client"

import { useAtom } from "jotai"
import { themeAtom, type Theme } from "./atoms"
import "./ThemeSelector.css"

const themes: { id: Theme; label: string; preview: string; icon: string }[] = [
  { id: "garden", label: "花园", preview: "linear-gradient(180deg, #a8e063 0%, #56ab2f 100%)", icon: "🌷" },
  { id: "ocean", label: "海洋", preview: "linear-gradient(180deg, #2193b0 0%, #6dd5ed 100%)", icon: "🌊" },
  { id: "sunset", label: "日落", preview: "linear-gradient(180deg, #ff512f 0%, #dd2476 100%)", icon: "🌅" },
  { id: "night", label: "夜晚", preview: "linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)", icon: "🌙" },
  { id: "candy", label: "糖果", preview: "linear-gradient(180deg, #f093fb 0%, #f5576c 100%)", icon: "🍬" },
  { id: "forest", label: "森林", preview: "linear-gradient(180deg, #134e5e 0%, #71b280 100%)", icon: "🌲" },
]

export function ThemeSelector() {
  const [theme, setTheme] = useAtom(themeAtom)

  return (
    <div className="theme-selector">
      {themes.map((item) => (
        <button
          key={item.id}
          className={`theme-selector__item ${theme === item.id ? "theme-selector__item--active" : ""}`}
          title={item.label}
          onClick={() => setTheme(item.id)}
        >
          <div className="theme-selector__preview" style={{ background: item.preview }}>
            <span className="theme-selector__icon">{item.icon}</span>
          </div>
          <span className="theme-selector__label">{item.label}</span>
        </button>
      ))}
    </div>
  )
}
