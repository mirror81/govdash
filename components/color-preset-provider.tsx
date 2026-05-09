"use client"

import * as React from "react"
import {
  COLOR_PRESET_STORAGE_KEY,
  type ColorPresetId,
  isColorPresetId,
} from "@/lib/color-presets"

function applyPresetToDocument(id: ColorPresetId) {
  const el = document.documentElement
  if (id === "default") {
    el.removeAttribute("data-color-preset")
  } else {
    el.dataset.colorPreset = id
  }
}

type ColorPresetContextValue = {
  preset: ColorPresetId
  setPreset: (id: ColorPresetId) => void
}

const ColorPresetContext = React.createContext<ColorPresetContextValue | null>(
  null,
)

export function ColorPresetProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [preset, setPresetState] = React.useState<ColorPresetId>(() => {
    if (typeof window === "undefined") {
      return "default"
    }
    const raw = localStorage.getItem(COLOR_PRESET_STORAGE_KEY)
    if (raw && isColorPresetId(raw)) {
      return raw
    }
    return "default"
  })

  React.useEffect(() => {
    applyPresetToDocument(preset)
  }, [preset])

  const setPreset = React.useCallback((id: ColorPresetId) => {
    setPresetState(id)
    localStorage.setItem(COLOR_PRESET_STORAGE_KEY, id)
  }, [])

  return (
    <ColorPresetContext.Provider value={{ preset, setPreset }}>
      {children}
    </ColorPresetContext.Provider>
  )
}

export function useColorPreset() {
  const ctx = React.useContext(ColorPresetContext)
  if (!ctx) {
    throw new Error("useColorPreset deve ficar dentro de ColorPresetProvider")
  }
  return ctx
}
