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
import { HugeiconsIcon } from "@hugeicons/react"
import { Target01Icon } from "@hugeicons/core-free-icons"

type OrcamentoPonteEquilibrioProps = {
  receitaOrcada: number
  despesaOrcada: number
  receitaAtualizada: number
  despesaAtualizada: number
  fmtMillions: (v: number) => string
}

export function OrcamentoPonteEquilibrio({
  receitaOrcada,
  despesaOrcada,
  receitaAtualizada,
  despesaAtualizada,
  fmtMillions,
}: OrcamentoPonteEquilibrioProps) {
  const max = Math.max(receitaOrcada, despesaOrcada, receitaAtualizada, despesaAtualizada, 1)
  const gapLoa = receitaOrcada - despesaOrcada
  const gapAtual = receitaAtualizada - despesaAtualizada

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon icon={Target01Icon} strokeWidth={2} className="size-5" />
          Ponte Orçada: receita vs despesa (LOA e atualizado)
        </CardTitle>
        <CardDescription>
          Comparação visual do equilíbrio votado na LOA e após alterações orçamentárias
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            LOA (orçado inicial)
          </p>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-emerald-700 dark:text-emerald-400">Receita orçada</span>
                <span className="font-semibold">{fmtMillions(receitaOrcada)}</span>
              </div>
              <Progress value={(receitaOrcada / max) * 100} className="h-3 bg-muted [&>div]:bg-emerald-500" />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-red-700 dark:text-red-400">Despesa orçada</span>
                <span className="font-semibold">{fmtMillions(despesaOrcada)}</span>
              </div>
              <Progress value={(despesaOrcada / max) * 100} className="h-3 bg-muted [&>div]:bg-red-500" />
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-muted-foreground">Resultado estrutural na LOA:</span>
              <Badge variant={gapLoa >= 0 ? "default" : "destructive"} className="text-xs">
                {gapLoa >= 0 ? "+" : ""}
                {fmtMillions(gapLoa)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Atualizado (créditos e anulações)
          </p>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-green-700 dark:text-green-400">Receita atualizada</span>
                <span className="font-semibold">{fmtMillions(receitaAtualizada)}</span>
              </div>
              <Progress value={(receitaAtualizada / max) * 100} className="h-3 bg-muted [&>div]:bg-green-500" />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-orange-700 dark:text-orange-400">Despesa atualizada</span>
                <span className="font-semibold">{fmtMillions(despesaAtualizada)}</span>
              </div>
              <Progress value={(despesaAtualizada / max) * 100} className="h-3 bg-muted [&>div]:bg-orange-500" />
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-muted-foreground">Margem após atualizações:</span>
              <Badge variant={gapAtual >= 0 ? "secondary" : "destructive"} className="text-xs">
                {gapAtual >= 0 ? "+" : ""}
                {fmtMillions(gapAtual)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
