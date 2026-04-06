"use client"

import * as React from "react"
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
  Treemap,
  ResponsiveContainer,
} from "recharts"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowUp01Icon,
  ArrowDown01Icon,
  MoneyAdd01Icon,
  MoneySend01Icon,
  Target01Icon,
  ChartLineData02Icon,
  Invoice02Icon,
  Alert02Icon,
  InformationCircleIcon,
  BulbIcon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
  PieChart02Icon,
  GridViewIcon,
} from "@hugeicons/core-free-icons"

// Formatadores
const fmtCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(v)

const fmtMillions = (v: number) => {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}K`
  return fmtCurrency(v)
}

const pctDiff = (atual: number, anterior: number) => {
  if (anterior === 0) return 0
  return (atual - anterior) / anterior * 100
}

const pctShare = (valor: number, total: number) => {
  if (total === 0) return 0
  return (valor / total) * 100
}

// =============================================
// DADOS DA RECEITA
// =============================================

const receitaPrevista = 580_000_000
const receitaDeduzida = 45_000_000
const receitaOrcada = receitaPrevista - receitaDeduzida
const receitaAlterada = 12_000_000
const receitaAtualizada = receitaOrcada + receitaAlterada

const evolucaoReceitaAnual = [
  { ano: "2020", orcada: 420_000_000, atualizada: 435_000_000 },
  { ano: "2021", orcada: 455_000_000, atualizada: 468_000_000 },
  { ano: "2022", orcada: 480_000_000, atualizada: 498_000_000 },
  { ano: "2023", orcada: 510_000_000, atualizada: 525_000_000 },
  { ano: "2024", orcada: 535_000_000, atualizada: 547_000_000 },
]

const receitaOrigemNatureza = [
  { nome: "Impostos", orcado: 125_000_000, atualizado: 132_500_000 },
  { nome: "Taxas", orcado: 18_500_000, atualizado: 19_200_000 },
  { nome: "Contribuições", orcado: 42_000_000, atualizado: 43_800_000 },
  { nome: "Receita Patrimonial", orcado: 8_500_000, atualizado: 9_100_000 },
  { nome: "Transferências Correntes", orcado: 285_000_000, atualizado: 290_500_000 },
  { nome: "Transferências de Capital", orcado: 38_000_000, atualizado: 34_200_000 },
  { nome: "Outras Receitas Correntes", orcado: 18_000_000, atualizado: 17_700_000 },
]

const receitaFonteRecursos = [
  { nome: "Recursos Ordinários (Livre)", orcado: 185_000_000, atualizado: 192_000_000 },
  { nome: "MDE - Educação", orcado: 95_000_000, atualizado: 98_500_000 },
  { nome: "ASPS - Saúde", orcado: 82_000_000, atualizado: 84_200_000 },
  { nome: "Assistência Social", orcado: 28_000_000, atualizado: 26_800_000 },
  { nome: "RPPS - Previdência", orcado: 65_000_000, atualizado: 67_500_000 },
  { nome: "Outros Vinculados", orcado: 80_000_000, atualizado: 78_000_000 },
]

const receitaEntidade = [
  { nome: "Prefeitura Municipal", orcado: 395_000_000, atualizado: 405_200_000 },
  { nome: "Câmara Municipal", orcado: 22_000_000, atualizado: 22_000_000 },
  { nome: "Prev. Municipal (RPPS)", orcado: 68_000_000, atualizado: 70_500_000 },
  { nome: "Saneamento Municipal", orcado: 50_000_000, atualizado: 49_300_000 },
]

const receitaOrigem = [
  { nome: "Receitas Próprias", orcado: 165_000_000, atualizado: 172_800_000 },
  { nome: "Transferências Estaduais", orcado: 98_000_000, atualizado: 95_500_000 },
  { nome: "Transferências Federais", orcado: 245_000_000, atualizado: 252_200_000 },
  { nome: "Outras Origens", orcado: 27_000_000, atualizado: 26_500_000 },
]

// =============================================
// DADOS DA DESPESA
// =============================================

const despesaOrcada = 535_000_000
const despesaSuplementado = 42_000_000
const despesaReduzido = 28_000_000
const despesaAtualizado = despesaOrcada + despesaSuplementado - despesaReduzido

const evolucaoDespesaAnual = [
  { ano: "2020", orcada: 418_000_000, atualizada: 430_000_000 },
  { ano: "2021", orcada: 452_000_000, atualizada: 470_000_000 },
  { ano: "2022", orcada: 478_000_000, atualizada: 502_000_000 },
  { ano: "2023", orcada: 508_000_000, atualizada: 530_000_000 },
  { ano: "2024", orcada: 535_000_000, atualizada: 549_000_000 },
]

const despesaSecretaria = [
  { nome: "Sec. de Educação", orcado: 142_000_000, atualizado: 148_500_000 },
  { nome: "Sec. de Saúde", orcado: 118_000_000, atualizado: 122_300_000 },
  { nome: "Sec. de Administração", orcado: 65_000_000, atualizado: 63_800_000 },
  { nome: "Sec. de Obras e Urbanismo", orcado: 52_000_000, atualizado: 58_200_000 },
  { nome: "Sec. de Assistência Social", orcado: 32_000_000, atualizado: 30_500_000 },
  { nome: "Sec. de Finanças", orcado: 18_000_000, atualizado: 17_200_000 },
  { nome: "Câmara Municipal", orcado: 22_000_000, atualizado: 22_000_000 },
  { nome: "Prev. Municipal (RPPS)", orcado: 52_000_000, atualizado: 53_800_000 },
  { nome: "Saneamento Municipal", orcado: 34_000_000, atualizado: 32_700_000 },
]

const despesaFuncao = [
  { nome: "Educação", orcado: 142_000_000, atualizado: 148_500_000 },
  { nome: "Saúde", orcado: 118_000_000, atualizado: 122_300_000 },
  { nome: "Administração", orcado: 68_000_000, atualizado: 66_500_000 },
  { nome: "Urbanismo", orcado: 45_000_000, atualizado: 50_200_000 },
  { nome: "Assistência Social", orcado: 32_000_000, atualizado: 30_500_000 },
  { nome: "Previdência Social", orcado: 52_000_000, atualizado: 53_800_000 },
  { nome: "Saneamento", orcado: 34_000_000, atualizado: 32_700_000 },
  { nome: "Legislativa", orcado: 22_000_000, atualizado: 22_000_000 },
  { nome: "Encargos Especiais", orcado: 22_000_000, atualizado: 22_500_000 },
]

const despesaFonteRecursos = [
  { nome: "Recursos Ordinários (Livre)", orcado: 180_000_000, atualizado: 188_500_000 },
  { nome: "MDE - Educação", orcado: 95_000_000, atualizado: 98_500_000 },
  { nome: "ASPS - Saúde", orcado: 82_000_000, atualizado: 84_200_000 },
  { nome: "Assistência Social", orcado: 28_000_000, atualizado: 26_800_000 },
  { nome: "RPPS - Previdência", orcado: 65_000_000, atualizado: 67_500_000 },
  { nome: "Outros Vinculados", orcado: 85_000_000, atualizado: 83_500_000 },
]

const despesaNatureza = [
  { nome: "Pessoal e Encargos Sociais", orcado: 265_000_000, atualizado: 272_000_000, categoria: "Corrente" },
  { nome: "Juros e Encargos da Dívida", orcado: 8_000_000, atualizado: 7_500_000, categoria: "Corrente" },
  { nome: "Outras Despesas Correntes", orcado: 165_000_000, atualizado: 170_200_000, categoria: "Corrente" },
  { nome: "Investimentos", orcado: 62_000_000, atualizado: 68_500_000, categoria: "Capital" },
  { nome: "Inversões Financeiras", orcado: 12_000_000, atualizado: 10_800_000, categoria: "Capital" },
  { nome: "Amortização da Dívida", orcado: 23_000_000, atualizado: 20_000_000, categoria: "Capital" },
]

const receitaDeltaNominal = receitaAtualizada - receitaOrcada
const receitaDeltaPercentual = pctDiff(receitaAtualizada, receitaOrcada)
const despesaDeltaNominal = despesaAtualizado - despesaOrcada
const despesaDeltaPercentual = pctDiff(despesaAtualizado, despesaOrcada)
const margemOrcamentaria = receitaAtualizada - despesaAtualizado
const coberturaReceitaDespesa = pctShare(receitaAtualizada, despesaAtualizado)

const receitaTopAltas = [...receitaOrigemNatureza]
  .map((item) => ({ ...item, diff: item.atualizado - item.orcado }))
  .sort((a, b) => b.diff - a.diff)
  .slice(0, 4)

const despesaTopAltas = [...despesaNatureza]
  .map((item) => ({ ...item, diff: item.atualizado - item.orcado }))
  .sort((a, b) => b.diff - a.diff)
  .slice(0, 4)

const resumoAnalitico = [
  {
    titulo: "Equilíbrio Orçamentário",
    valor: margemOrcamentaria,
    descricao: margemOrcamentaria >= 0 ? "Receita atualizada cobre a despesa atualizada" : "Despesa atualizada acima da receita atualizada",
  },
  {
    titulo: "Pressão de Alterações",
    valor: receitaDeltaNominal - despesaDeltaNominal,
    descricao: "Diferença entre alterações líquidas de receita e despesa",
  },
  {
    titulo: "Cobertura Receita/Despesa",
    valor: coberturaReceitaDespesa,
    descricao: "Percentual da despesa coberta pela receita atualizada",
  },
]

const analisesInteligentes = [
  {
    titulo: "Dependência de Transferências",
    status: "atenção",
    insight: "Transferências correntes e federais representam a maior parcela da receita, elevando sensibilidade a variações de repasse.",
  },
  {
    titulo: "Pressão em Investimentos",
    status: "oportunidade",
    insight: "Investimentos e urbanismo concentram suplementações, indicando oportunidade para revisão do cronograma físico-financeiro.",
  },
  {
    titulo: "Rigidez de Despesa Corrente",
    status: "monitorar",
    insight: "Pessoal e outras correntes seguem com alto peso no orçamento, exigindo controle para preservar margem de capital.",
  },
]

const alertasNotificacoes = [
  {
    tipo: "critico",
    titulo: "Risco de compressão de caixa no fechamento",
    descricao: "Se novas suplementações forem abertas sem incremento de receita, o equilíbrio global pode ficar negativo.",
  },
  {
    tipo: "info",
    titulo: "Receitas próprias em expansão",
    descricao: "Impostos e taxas vêm com variação positiva frente ao orçado, reduzindo dependência de transferências.",
  },
  {
    tipo: "sucesso",
    titulo: "Cobertura global ainda adequada",
    descricao: "A relação receita/despesa permanece em patamar de cobertura aceitável para o exercício atual.",
  },
]

// =============================================
// COMPONENTE
// =============================================

function DiffTable({
  data,
  title,
  description,
}: {
  data: { nome: string; orcado: number; atualizado: number; categoria?: string }[]
  title: string
  description: string
}) {
  const totals = data.reduce(
    (acc, r) => ({ orcado: acc.orcado + r.orcado, atualizado: acc.atualizado + r.atualizado }),
    { orcado: 0, atualizado: 0 },
  )
  const totalDiff = totals.atualizado - totals.orcado
  const totalPct = pctDiff(totals.atualizado, totals.orcado)
  const hasCategoria = data.some((d) => d.categoria)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {hasCategoria && <TableHead className="w-24">Categoria</TableHead>}
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Orçado (LOA)</TableHead>
              <TableHead className="text-right">Atualizado</TableHead>
              <TableHead className="text-right">Dif. Nominal (R$)</TableHead>
              <TableHead className="text-right">Dif. (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const diff = item.atualizado - item.orcado
              const pct = pctDiff(item.atualizado, item.orcado)
              return (
                <TableRow key={item.nome}>
                  {hasCategoria && (
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{item.categoria}</Badge>
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{item.nome}</TableCell>
                  <TableCell className="text-right">{fmtCurrency(item.orcado)}</TableCell>
                  <TableCell className="text-right">{fmtCurrency(item.atualizado)}</TableCell>
                  <TableCell className={`text-right font-medium ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {diff >= 0 ? '+' : ''}{fmtCurrency(diff)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={`text-xs ${pct >= 0 ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'}`}
                    >
                      {pct >= 0 ? '+' : ''}{pct.toFixed(1)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              {hasCategoria && <TableCell />}
              <TableCell className="font-bold">Total</TableCell>
              <TableCell className="text-right font-bold">{fmtCurrency(totals.orcado)}</TableCell>
              <TableCell className="text-right font-bold">{fmtCurrency(totals.atualizado)}</TableCell>
              <TableCell className={`text-right font-bold ${totalDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalDiff >= 0 ? '+' : ''}{fmtCurrency(totalDiff)}
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary" className="text-xs font-bold">
                  {totalPct >= 0 ? '+' : ''}{totalPct.toFixed(1)}%
                </Badge>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}

function MixBreakdownCard({
  title,
  description,
  data,
}: {
  title: string
  description: string
  data: { nome: string; orcado: number; atualizado: number }[]
}) {
  const totalAtualizado = data.reduce((acc, item) => acc + item.atualizado, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item) => {
          const share = pctShare(item.atualizado, totalAtualizado)
          const diff = item.atualizado - item.orcado

          return (
            <div key={item.nome} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{item.nome}</span>
                <div className="text-right">
                  <p className="text-sm font-semibold">{fmtMillions(item.atualizado)}</p>
                  <p className={`text-xs ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {diff >= 0 ? '+' : ''}{fmtMillions(diff)}
                  </p>
                </div>
              </div>
              <Progress value={share} className="h-2" />
              <p className="text-xs text-muted-foreground">{share.toFixed(1)}% de participação no total atualizado</p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export function OrcamentoMunicipal() {
  return (
    <div className="space-y-8">
      {/* Header do Módulo */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Orçamento (Receita e Despesa)</h2>
        <p className="text-sm text-muted-foreground">Planejamento e orçamento do município e entidades (Câmara, Saneamento e Previdência)</p>
      </div>

      {/* ======================================================= */}
      {/* BLOCO RECEITA                                            */}
      {/* ======================================================= */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
            <HugeiconsIcon icon={MoneyAdd01Icon} strokeWidth={2} className="size-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Receita Orçamentária</h3>
            <p className="text-sm text-muted-foreground">Previsão e alterações orçamentárias da receita</p>
          </div>
        </div>

        {/* KPIs Receita */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Receita Prevista</CardTitle>
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                <HugeiconsIcon icon={Target01Icon} strokeWidth={2} className="size-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fmtMillions(receitaPrevista)}</div>
              <p className="text-xs text-muted-foreground mt-1">LOA 2024</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Deduzida</CardTitle>
              <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
                <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">-{fmtMillions(receitaDeduzida)}</div>
              <p className="text-xs text-muted-foreground mt-1">Deduções legais</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Orçada</CardTitle>
              <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/30">
                <HugeiconsIcon icon={Invoice02Icon} strokeWidth={2} className="size-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fmtMillions(receitaOrcada)}</div>
              <p className="text-xs text-muted-foreground mt-1">Prevista - Deduzida</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Alterada</CardTitle>
              <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
                <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} className="size-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">+{fmtMillions(receitaAlterada)}</div>
              <p className="text-xs text-muted-foreground mt-1">Créditos adicionais</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Atualizada</CardTitle>
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                <HugeiconsIcon icon={MoneyAdd01Icon} strokeWidth={2} className="size-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{fmtMillions(receitaAtualizada)}</div>
              <p className="text-xs text-muted-foreground mt-1">Orçada + Alterada</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Variação Orçada x Atualizada</CardDescription>
              <CardTitle className={`text-2xl ${receitaDeltaNominal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {receitaDeltaNominal >= 0 ? '+' : ''}{fmtMillions(receitaDeltaNominal)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-xs">
                {receitaDeltaPercentual >= 0 ? '+' : ''}{receitaDeltaPercentual.toFixed(2)}%
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Índice de Dedução</CardDescription>
              <CardTitle className="text-2xl">{pctShare(receitaDeduzida, receitaPrevista).toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Percentual deduzido sobre a receita prevista</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Elasticidade da Receita</CardDescription>
              <CardTitle className="text-2xl">{pctShare(receitaAlterada, receitaOrcada).toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Peso dos créditos sobre a base orçada</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Entidade Líder em Receita</CardDescription>
              <CardTitle className="text-lg">Prefeitura Municipal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{pctShare(receitaEntidade[0].atualizado, receitaAtualizada).toFixed(1)}% da receita atualizada</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <MixBreakdownCard
            title="Composição Dinâmica da Receita"
            description="Distribuição das maiores variações positivas"
            data={receitaTopAltas}
          />
          <Card>
            <CardHeader>
              <CardTitle>Radar de Expansão da Receita</CardTitle>
              <CardDescription>Focos que mais ampliaram o orçamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {receitaTopAltas.map((item, index) => (
                <div key={item.nome} className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">#{index + 1}</Badge>
                    <span className="text-sm font-medium">{item.nome}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">+{fmtMillions(item.diff)}</p>
                    <p className="text-xs text-muted-foreground">{pctDiff(item.atualizado, item.orcado).toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Evolução Anual Receita */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={ChartLineData02Icon} strokeWidth={2} className="size-5" />
              Evolução Anual da Receita
            </CardTitle>
            <CardDescription>Comparativo orçado vs atualizado por exercício</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                orcada: { label: "Orçada (LOA)", color: "var(--chart-3)" },
                atualizada: { label: "Atualizada", color: "var(--chart-1)" },
              } satisfies ChartConfig}
              className="h-[280px] w-full"
            >
              <BarChart data={evolucaoReceitaAnual} margin={{ left: 0, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="ano" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
                <ChartTooltip content={<ChartTooltipContent formatter={(v) => fmtCurrency(Number(v))} />} />
                <Bar dataKey="orcada" fill="var(--color-orcada)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="atualizada" fill="var(--color-atualizada)" radius={[4, 4, 0, 0]} />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Tabelas de Receita */}
        <DiffTable
          data={receitaOrigemNatureza}
          title="Receita por Origem da Natureza"
          description="Impostos, Contribuições, Transferências e outras origens"
        />

        <DiffTable
          data={receitaFonteRecursos}
          title="Receita por Fonte de Recursos"
          description="Distribuição por vinculação dos recursos"
        />

        <DiffTable
          data={receitaEntidade}
          title="Receita por Entidade"
          description="Prefeitura, Câmara, Previdência e Saneamento"
        />

        <DiffTable
          data={receitaOrigem}
          title="Receita por Origem"
          description="Próprias, Estaduais, Federais e Outras"
        />
      </div>

      {/* ======================================================= */}
      {/* SEPARADOR VISUAL                                         */}
      {/* ======================================================= */}
      <div className="relative py-4">
        <Separator />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted px-4 dark:bg-background">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Despesa Orçamentária</span>
        </div>
      </div>

      {/* ======================================================= */}
      {/* BLOCO DESPESA                                            */}
      {/* ======================================================= */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
            <HugeiconsIcon icon={MoneySend01Icon} strokeWidth={2} className="size-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Despesa Orçamentária</h3>
            <p className="text-sm text-muted-foreground">Dotações, créditos adicionais e anulações</p>
          </div>
        </div>

        {/* KPIs Despesa */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Despesa Orçada</CardTitle>
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                <HugeiconsIcon icon={Target01Icon} strokeWidth={2} className="size-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fmtMillions(despesaOrcada)}</div>
              <p className="text-xs text-muted-foreground mt-1">LOA 2024</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Suplementado</CardTitle>
              <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
                <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} className="size-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">+{fmtMillions(despesaSuplementado)}</div>
              <p className="text-xs text-muted-foreground mt-1">Créditos suplementares</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reduzido</CardTitle>
              <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
                <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">-{fmtMillions(despesaReduzido)}</div>
              <p className="text-xs text-muted-foreground mt-1">Anulações de dotação</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Atualizado</CardTitle>
              <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30">
                <HugeiconsIcon icon={MoneySend01Icon} strokeWidth={2} className="size-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{fmtMillions(despesaAtualizado)}</div>
              <p className="text-xs text-muted-foreground mt-1">Orçada + Supl. - Reduzido</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Variação Orçada x Atualizada</CardDescription>
              <CardTitle className={`text-2xl ${despesaDeltaNominal >= 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {despesaDeltaNominal >= 0 ? '+' : ''}{fmtMillions(despesaDeltaNominal)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-xs">
                {despesaDeltaPercentual >= 0 ? '+' : ''}{despesaDeltaPercentual.toFixed(2)}%
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Índice de Suplementação</CardDescription>
              <CardTitle className="text-2xl">{pctShare(despesaSuplementado, despesaOrcada).toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Suplementações sobre dotação inicial</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Índice de Redução</CardDescription>
              <CardTitle className="text-2xl">{pctShare(despesaReduzido, despesaOrcada).toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Anulações sobre dotação inicial</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Despesa Líder por Natureza</CardDescription>
              <CardTitle className="text-lg">Pessoal e Encargos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{pctShare(despesaNatureza[0].atualizado, despesaAtualizado).toFixed(1)}% da despesa atualizada</p>
            </CardContent>
          </Card>
        </div>

        {/* Evolução Anual Despesa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={ChartLineData02Icon} strokeWidth={2} className="size-5" />
              Evolução Anual da Despesa
            </CardTitle>
            <CardDescription>Comparativo orçado vs atualizado por exercício</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                orcada: { label: "Orçada (LOA)", color: "var(--chart-5)" },
                atualizada: { label: "Atualizada", color: "var(--chart-2)" },
              } satisfies ChartConfig}
              className="h-[280px] w-full"
            >
              <BarChart data={evolucaoDespesaAnual} margin={{ left: 0, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="ano" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
                <ChartTooltip content={<ChartTooltipContent formatter={(v) => fmtCurrency(Number(v))} />} />
                <Bar dataKey="orcada" fill="var(--color-orcada)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="atualizada" fill="var(--color-atualizada)" radius={[4, 4, 0, 0]} />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <MixBreakdownCard
            title="Composição Dinâmica da Despesa"
            description="Rubricas com maior crescimento na atualização"
            data={despesaTopAltas}
          />
          <Card>
            <CardHeader>
              <CardTitle>Radar de Pressão da Despesa</CardTitle>
              <CardDescription>Grupos com maior incremento nominal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {despesaTopAltas.map((item, index) => (
                <div key={item.nome} className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">#{index + 1}</Badge>
                    <span className="text-sm font-medium">{item.nome}</span>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${item.diff >= 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      {item.diff >= 0 ? '+' : ''}{fmtMillions(item.diff)}
                    </p>
                    <p className="text-xs text-muted-foreground">{pctDiff(item.atualizado, item.orcado).toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Tabelas de Despesa */}
        <DiffTable
          data={despesaSecretaria}
          title="Despesa por Secretaria"
          description="Distribuição orçamentária por unidade gestora"
        />

        <DiffTable
          data={despesaFuncao}
          title="Despesa por Função"
          description="Classificação funcional da despesa"
        />

        <DiffTable
          data={despesaFonteRecursos}
          title="Despesa por Fonte de Recursos"
          description="Distribuição por vinculação dos recursos"
        />

        <DiffTable
          data={despesaNatureza}
          title="Despesa por Natureza"
          description="Categoria econômica, grupo e natureza da despesa"
        />
      </div>

      <div className="relative py-4">
        <Separator />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted px-4 dark:bg-background">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Análises</span>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-5" />
              Resumo Analítico
            </CardTitle>
            <CardDescription>Consolidação dos principais sinais do orçamento</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {resumoAnalitico.map((item) => (
              <div key={item.titulo} className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">{item.titulo}</p>
                <p className={`mt-2 text-2xl font-bold ${item.valor >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.titulo === "Cobertura Receita/Despesa"
                    ? `${item.valor.toFixed(1)}%`
                    : `${item.valor >= 0 ? '+' : ''}${fmtMillions(item.valor)}`}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{item.descricao}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={BulbIcon} strokeWidth={2} className="size-5" />
              Análises inteligentes do Orçamento (Receitas e despesas)
            </CardTitle>
            <CardDescription>Leituras estratégicas para decisão gerencial</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {analisesInteligentes.map((analise) => (
              <div key={analise.titulo} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-medium text-foreground">{analise.titulo}</p>
                  <Badge variant="outline" className="text-xs capitalize">
                    {analise.status}
                  </Badge>
                </div>
                <div className="flex items-start gap-2">
                  <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="mt-0.5 size-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{analise.insight}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-5" />
              Alertas e Notificações
            </CardTitle>
            <CardDescription>Eventos críticos, informativos e de conformidade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertasNotificacoes.map((alerta) => (
              <Alert key={alerta.titulo}>
                <HugeiconsIcon
                  icon={alerta.tipo === "sucesso" ? CheckmarkCircle02Icon : alerta.tipo === "info" ? InformationCircleIcon : Alert02Icon}
                  strokeWidth={2}
                  className={`size-4 ${alerta.tipo === "sucesso" ? 'text-green-600' : alerta.tipo === "info" ? 'text-blue-600' : 'text-amber-600'}`}
                />
                <AlertTitle>{alerta.titulo}</AlertTitle>
                <AlertDescription>{alerta.descricao}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
