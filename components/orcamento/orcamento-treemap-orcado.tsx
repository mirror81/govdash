"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { Treemap, Tooltip } from "recharts"
import { HugeiconsIcon } from "@hugeicons/react"
import { GridViewIcon } from "@hugeicons/core-free-icons"

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

type Folha = { name: string; size: number }

function buildTree(items: { nome: string; orcado: number }[]): Folha[] {
  return items.map((item) => ({ name: item.nome, size: item.orcado }))
}

type OrcamentoTreemapOrcadoProps = {
  variant: "receita" | "despesa"
  title: string
  description: string
  itens: { nome: string; orcado: number }[]
  fmtCurrency: (v: number) => string
}

const treemapConfig = {
  size: { label: "Valor orçado", color: "var(--chart-1)" },
} satisfies ChartConfig

function TreemapTooltipContent({
  active,
  payload,
  fmtCurrency,
}: {
  active?: boolean
  payload?: Array<{ payload: Folha }>
  fmtCurrency: (v: number) => string
}) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="rounded-md border bg-background px-2 py-1.5 text-xs shadow-md">
      <p className="font-medium">{p.name}</p>
      <p className="text-muted-foreground">{fmtCurrency(p.size)}</p>
    </div>
  )
}

function OrcadoTreemapCell(props: {
  x?: number
  y?: number
  width?: number
  height?: number
  name?: string
  index?: number
  depth?: number
}) {
  const { x = 0, y = 0, width = 0, height = 0, name, index, depth } = props
  if (depth === 0) return null
  const fill = COLORS[(index ?? 0) % COLORS.length]
  const showLabel = width > 48 && height > 24
  const label = name && name.length > 16 ? `${name.slice(0, 14)}…` : name
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} fillOpacity={0.88} rx={4} stroke="hsl(var(--border))" strokeWidth={1} />
      {showLabel ? (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-background"
          style={{ fontSize: 10, fontWeight: 600, pointerEvents: "none" }}
        >
          {label}
        </text>
      ) : null}
    </g>
  )
}

export function OrcamentoTreemapOrcado({ variant, title, description, itens, fmtCurrency }: OrcamentoTreemapOrcadoProps) {
  const data = React.useMemo(() => buildTree(itens), [itens])

  const root = React.useMemo(
    () => [
      {
        name: variant === "receita" ? "Receita orçada" : "Despesa orçada",
        children: data,
      },
    ],
    [variant, data],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon icon={GridViewIcon} strokeWidth={2} className="size-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={treemapConfig} className="h-[320px] w-full">
            <Treemap data={root} dataKey="size" nameKey="name" stroke="transparent" content={OrcadoTreemapCell as unknown as React.ReactElement}>
            <Tooltip content={<TreemapTooltipContent fmtCurrency={fmtCurrency} />} />
          </Treemap>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
