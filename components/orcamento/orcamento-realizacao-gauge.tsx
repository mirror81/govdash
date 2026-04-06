"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

type Variant = "receita" | "despesa"

type OrcamentoRealizacaoGaugeProps = {
  variant: Variant
  titulo: string
  subtitulo: string
  realizado: number
  baseOrcamentaria: number
  metaPct?: number
  fmtMillions: (v: number) => string
}

export function OrcamentoRealizacaoGauge({
  variant,
  titulo,
  subtitulo,
  realizado,
  baseOrcamentaria,
  metaPct,
  fmtMillions,
}: OrcamentoRealizacaoGaugeProps) {
  const pct = baseOrcamentaria > 0 ? Math.min(100, (realizado / baseOrcamentaria) * 100) : 0
  const vsMeta =
    metaPct != null ? pct - metaPct : null

  const barClass =
    variant === "receita"
      ? "[&>div]:bg-emerald-500"
      : "[&>div]:bg-orange-500"

  return (
    <Card className={variant === "receita" ? "border-emerald-200/80 dark:border-emerald-900/50" : "border-orange-200/80 dark:border-orange-900/50"}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{titulo}</CardTitle>
        <CardDescription>{subtitulo}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-3xl font-bold tabular-nums">{pct.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">
              {variant === "receita" ? "Arrecadado" : "Empenhado"}: {fmtMillions(realizado)} / base:{" "}
              {fmtMillions(baseOrcamentaria)}
            </p>
          </div>
          {metaPct != null ? (
            <Badge variant="outline" className="shrink-0 text-xs">
              Meta {metaPct}%
              {vsMeta != null ? (
                <span className={vsMeta >= 0 ? " text-emerald-600" : " text-amber-600"}>
                  {" "}
                  ({vsMeta >= 0 ? "+" : ""}
                  {vsMeta.toFixed(1)} p.p.)
                </span>
              ) : null}
            </Badge>
          ) : null}
        </div>
        <div className="space-y-2">
          <Progress value={pct} className={`h-4 bg-muted ${barClass}`} />
          <p className="text-xs text-muted-foreground">
            {variant === "receita"
              ? "Realização da arrecadação frente à receita orçamentária atualizada."
              : "Comprometimento do empenho frente à despesa orçamentária atualizada."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
