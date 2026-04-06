"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import { HugeiconsIcon } from "@hugeicons/react"
import { ChartLineData02Icon } from "@hugeicons/core-free-icons"

type WaterfallRow = {
  etapa: string
  valor: number
  tipo: "positivo" | "negativo" | "subtotal" | "total"
}

function buildReceitaRows(
  prevista: number,
  deduzida: number,
  orcada: number,
  alterada: number,
  atualizada: number,
): WaterfallRow[] {
  return [
    { etapa: "Prevista", valor: prevista, tipo: "total" },
    { etapa: "(-) Deduzida", valor: -deduzida, tipo: "negativo" },
    { etapa: "Orçada (LOA)", valor: orcada, tipo: "subtotal" },
    { etapa: "(+) Alterada", valor: alterada, tipo: "positivo" },
    { etapa: "Atualizada", valor: atualizada, tipo: "total" },
  ]
}

function buildDespesaRows(
  orcada: number,
  suplementado: number,
  reduzido: number,
  atualizado: number,
): WaterfallRow[] {
  return [
    { etapa: "Orçada (LOA)", valor: orcada, tipo: "total" },
    { etapa: "(+) Suplementado", valor: suplementado, tipo: "positivo" },
    { etapa: "(-) Reduzido", valor: -reduzido, tipo: "negativo" },
    { etapa: "Atualizado", valor: atualizado, tipo: "total" },
  ]
}

type OrcamentoWaterfallLoaProps = {
  variant: "receita" | "despesa"
  fmtCurrency: (v: number) => string
  receita?: {
    prevista: number
    deduzida: number
    orcada: number
    alterada: number
    atualizada: number
  }
  despesa?: {
    orcada: number
    suplementado: number
    reduzido: number
    atualizado: number
  }
}

const chartConfig = {
  valor: { label: "Valor (R$)", color: "var(--chart-1)" },
} satisfies ChartConfig

function barColor(tipo: WaterfallRow["tipo"], variant: "receita" | "despesa") {
  if (tipo === "negativo") return "var(--chart-5)"
  if (tipo === "positivo") return variant === "receita" ? "var(--chart-2)" : "var(--chart-3)"
  if (tipo === "subtotal") return "var(--chart-4)"
  return variant === "receita" ? "var(--chart-1)" : "var(--chart-2)"
}

export function OrcamentoWaterfallLoa({ variant, fmtCurrency, receita, despesa }: OrcamentoWaterfallLoaProps) {
  const data = React.useMemo(() => {
    if (variant === "receita" && receita) {
      return buildReceitaRows(receita.prevista, receita.deduzida, receita.orcada, receita.alterada, receita.atualizada)
    }
    if (variant === "despesa" && despesa) {
      return buildDespesaRows(despesa.orcada, despesa.suplementado, despesa.reduzido, despesa.atualizado)
    }
    return []
  }, [variant, receita, despesa])

  const title =
    variant === "receita"
      ? "Cascata da receita: da previsão ao orçamento atualizado"
      : "Cascata da despesa: da LOA ao orçamento atualizado"

  const description =
    variant === "receita"
      ? "Onde a receita orçada aparece após deduções e como chega ao valor atualizado"
      : "Efeito de créditos suplementares e anulações sobre a despesa orçada"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon icon={ChartLineData02Icon} strokeWidth={2} className="size-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={data} margin={{ left: 0, right: 12 }} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="etapa" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => `${(Number(v) / 1_000_000).toFixed(0)}M`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => fmtCurrency(Number(value))}
                  labelKey="etapa"
                />
              }
            />
            <Bar dataKey="valor" radius={[6, 6, 0, 0]} name="Valor">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColor(entry.tipo, variant)} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
