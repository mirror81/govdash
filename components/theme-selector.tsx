"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Sun01Icon,
  Moon02Icon,
  MonitorDotIcon,
  ColorsIcon,
} from "@hugeicons/core-free-icons"
import { useColorPreset } from "@/components/color-preset-provider"
import { COLOR_PRESETS, type ColorPresetId } from "@/lib/color-presets"

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const { preset, setPreset } = useColorPreset()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9"
          aria-label="Paleta e aparência"
          aria-haspopup="menu"
        >
          <HugeiconsIcon icon={ColorsIcon} strokeWidth={2} className="size-5" />
          <span className="sr-only">Paleta e aparência</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuLabel>Paleta de cores</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={preset}
          onValueChange={(v) => setPreset(v as ColorPresetId)}
        >
          {COLOR_PRESETS.map((p) => (
            <DropdownMenuRadioItem
              key={p.id}
              value={p.id}
              className="gap-2"
              title={p.hint}
            >
              <span className="truncate">{p.label}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Modo claro / escuro</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={mounted ? (theme ?? "dark") : "dark"}
          onValueChange={setTheme}
        >
          <DropdownMenuRadioItem value="light" className="gap-2">
            <HugeiconsIcon icon={Sun01Icon} strokeWidth={2} className="size-4" />
            Claro
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="gap-2">
            <HugeiconsIcon icon={Moon02Icon} strokeWidth={2} className="size-4" />
            Escuro
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" className="gap-2">
            <HugeiconsIcon icon={MonitorDotIcon} strokeWidth={2} className="size-4" />
            Sistema
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
