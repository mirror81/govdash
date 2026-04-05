"use client"

import * as React from "react"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Cell,
} from "recharts"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowUp01Icon,
  ArrowDown01Icon,
  Wallet01Icon,
  MoneyReceiveSquareIcon,
  Invoice01Icon,
  Calendar01Icon,
  Building06Icon,
  FilterIcon,
  Download01Icon,
  RefreshIcon,
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  BulbIcon,
  Target01Icon,
  ChartLineData02Icon,
  PieChart02Icon,
  Clock01Icon,
  Flag01Icon,
  StarIcon,
  Alert02Icon,
  MoneyAdd01Icon,
  MoneySend01Icon,
  Bank02Icon,
  CityIcon,
  Home01Icon,
  Store01Icon,
  TaxIcon,
} from "@hugeicons/core-free-icons"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Formatadores
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
}

const formatMillions = (value: number) => {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(0)}K`
  }
  return formatCurrency(value)
}

const calcPercent = (value: number, total: number) => {
  if (total === 0) return 0
  return ((value / total) * 100).toFixed(1)
}

// Dados de receitas proprias
const receitasProprias = [
  { codigo: "1.1.1", nome: "IPTU", prevista: 18500000, arrecadada: 16800000, aArrecadar: 1700000 },
  { codigo: "1.1.2", nome: "ISS", prevista: 24200000, arrecadada: 26500000, aArrecadar: -2300000 },
  { codigo: "1.1.3", nome: "ITBI", prevista: 8900000, arrecadada: 7200000, aArrecadar: 1700000 },
  { codigo: "1.1.4", nome: "Taxas Diversas", prevista: 5600000, arrecadada: 4800000, aArrecadar: 800000 },
  { codigo: "1.1.5", nome: "Contribuicao de Melhoria", prevista: 1200000, arrecadada: 890000, aArrecadar: 310000 },
  { codigo: "1.1.6", nome: "COSIP", prevista: 3800000, arrecadada: 3650000, aArrecadar: 150000 },
]

// Dados de transferencias estaduais
const receitasEstaduais = [
  { codigo: "2.1.1", nome: "ICMS", prevista: 32500000, arrecadada: 30800000, aArrecadar: 1700000 },
  { codigo: "2.1.2", nome: "IPVA", prevista: 12400000, arrecadada: 11200000, aArrecadar: 1200000 },
  { codigo: "2.1.3", nome: "IPI Exportacao", prevista: 2100000, arrecadada: 1850000, aArrecadar: 250000 },
  { codigo: "2.1.4", nome: "Outras Transferencias Estaduais", prevista: 4500000, arrecadada: 4100000, aArrecadar: 400000 },
]

// Dados de transferencias federais
const receitasFederais = [
  { codigo: "3.1.1", nome: "FPM", prevista: 28500000, arrecadada: 27200000, aArrecadar: 1300000 },
  { codigo: "3.1.2", nome: "FUNDEB", prevista: 35600000, arrecadada: 34800000, aArrecadar: 800000 },
  { codigo: "3.1.3", nome: "SUS - Transferencias", prevista: 18900000, arrecadada: 17500000, aArrecadar: 1400000 },
  { codigo: "3.1.4", nome: "FNAS - Assistencia Social", prevista: 4200000, arrecadada: 3900000, aArrecadar: 300000 },
  { codigo: "3.1.5", nome: "Convenios Federais", prevista: 8500000, arrecadada: 5200000, aArrecadar: 3300000 },
  { codigo: "3.1.6", nome: "Outras Transferencias Federais", prevista: 3200000, arrecadada: 2800000, aArrecadar: 400000 },
]

// Outras receitas
const outrasReceitas = [
  { codigo: "4.1.1", nome: "Receitas Patrimoniais", prevista: 2800000, arrecadada: 3100000, aArrecadar: -300000 },
  { codigo: "4.1.2", nome: "Receitas de Servicos", prevista: 1500000, arrecadada: 1350000, aArrecadar: 150000 },
  { codigo: "4.1.3", nome: "Multas e Juros", prevista: 1800000, arrecadada: 2100000, aArrecadar: -300000 },
  { codigo: "4.1.4", nome: "Divida Ativa", prevista: 3500000, arrecadada: 2800000, aArrecadar: 700000 },
  { codigo: "4.1.5", nome: "Outras Receitas Correntes", prevista: 1200000, arrecadada: 980000, aArrecadar: 220000 },
]

// Evolucao mensal
const evolucaoMensal = [
  { mes: "Jan", prevista: 18500000, arrecadada: 17200000 },
  { mes: "Fev", prevista: 17800000, arrecadada: 16500000 },
  { mes: "Mar", prevista: 19200000, arrecadada: 20100000 },
  { mes: "Abr", prevista: 18600000, arrecadada: 17800000 },
  { mes: "Mai", prevista: 20100000, arrecadada: 19500000 },
  { mes: "Jun", prevista: 19500000, arrecadada: 18900000 },
  { mes: "Jul", prevista: 21200000, arrecadada: 20800000 },
  { mes: "Ago", prevista: 20800000, arrecadada: 21500000 },
  { mes: "Set", prevista: 22100000, arrecadada: 21200000 },
  { mes: "Out", prevista: 21500000, arrecadada: 20900000 },
  { mes: "Nov", prevista: 23000000, arrecadada: 22100000 },
]

// Comparativo anual
const comparativoAnual = [
  { ano: "2020", prevista: 185000000, arrecadada: 172500000, percentual: 93.2 },
  { ano: "2021", prevista: 198500000, arrecadada: 189200000, percentual: 95.3 },
  { ano: "2022", prevista: 215600000, arrecadada: 208900000, percentual: 96.9 },
  { ano: "2023", prevista: 232400000, arrecadada: 224100000, percentual: 96.4 },
  { ano: "2024", prevista: 243900000, arrecadada: 228680000, percentual: 93.8 },
]

// Totais
const calcularTotais = (dados: { prevista: number; arrecadada: number; aArrecadar: number }[]) => {
  return dados.reduce(
    (acc, item) => ({
      prevista: acc.prevista + item.prevista,
      arrecadada: acc.arrecadada + item.arrecadada,
      aArrecadar: acc.aArrecadar + item.aArrecadar,
    }),
    { prevista: 0, arrecadada: 0, aArrecadar: 0 }
  )
}

const totaisProprias = calcularTotais(receitasProprias)
const totaisEstaduais = calcularTotais(receitasEstaduais)
const totaisFederais = calcularTotais(receitasFederais)
const totaisOutras = calcularTotais(outrasReceitas)

const totaisGerais = {
  prevista: totaisProprias.prevista + totaisEstaduais.prevista + totaisFederais.prevista + totaisOutras.prevista,
  arrecadada: totaisProprias.arrecadada + totaisEstaduais.arrecadada + totaisFederais.arrecadada + totaisOutras.arrecadada,
  aArrecadar: totaisProprias.aArrecadar + totaisEstaduais.aArrecadar + totaisFederais.aArrecadar + totaisOutras.aArrecadar,
}

// Distribuicao por origem
const distribuicaoOrigem = [
  { nome: "Receitas Proprias", valor: totaisProprias.arrecadada, fill: "var(--chart-1)" },
  { nome: "Transferencias Estaduais", valor: totaisEstaduais.arrecadada, fill: "var(--chart-2)" },
  { nome: "Transferencias Federais", valor: totaisFederais.arrecadada, fill: "var(--chart-3)" },
  { nome: "Outras Receitas", valor: totaisOutras.arrecadada, fill: "var(--chart-4)" },
]

// Top contribuintes (ficticios)
const topContribuintes = [
  { nome: "Comercio Varejista Municipal Ltda", cnpj: "12.345.678/0001-90", valor: 2850000, tipo: "ISS" },
  { nome: "Construtora Regional SA", cnpj: "23.456.789/0001-01", valor: 1950000, tipo: "ISS/ITBI" },
  { nome: "Shopping Center Municipal", cnpj: "34.567.890/0001-12", valor: 1680000, tipo: "ISS/IPTU" },
  { nome: "Hospital e Maternidade Ltda", cnpj: "45.678.901/0001-23", valor: 1420000, tipo: "ISS" },
  { nome: "Industria Metalurgica Regional", cnpj: "56.789.012/0001-34", valor: 1180000, tipo: "ISS/IPTU" },
]

// Alertas
const alertasReceita = [
  { tipo: "warning", titulo: "ITBI abaixo da previsao", descricao: "A arrecadacao de ITBI esta 19% abaixo da previsao orcamentaria, indicando possivel desaceleracao do mercado imobiliario.", tributo: "ITBI" },
  { tipo: "success", titulo: "ISS supera a meta", descricao: "A arrecadacao de ISS superou a previsao em 9.5%, refletindo aumento na atividade economica de servicos.", tributo: "ISS" },
  { tipo: "info", titulo: "Convenios federais pendentes", descricao: "R$ 3.3M em convenios federais aguardam liberacao. Recomenda-se acompanhamento junto aos ministerios.", tributo: "CONVENIOS" },
]

// Timeline de eventos
const eventosReceita = [
  { data: "29/11/2024", evento: "Repasse FPM de R$ 2.8M creditado", tipo: "credito", origem: "Federal" },
  { data: "27/11/2024", evento: "Vencimento IPTU 10a parcela - R$ 1.2M arrecadado", tipo: "arrecadacao", origem: "Propria" },
  { data: "25/11/2024", evento: "Transferencia ICMS de R$ 3.1M", tipo: "credito", origem: "Estadual" },
  { data: "22/11/2024", evento: "Liberacao parcela FUNDEB R$ 2.9M", tipo: "credito", origem: "Federal" },
  { data: "20/11/2024", evento: "Arrecadacao ISS competencia outubro R$ 2.1M", tipo: "arrecadacao", origem: "Propria" },
]

export function ReceitaMunicipal() {
  const [periodoSelecionado, setPeriodoSelecionado] = React.useState("2024")

  return (
    <div className="space-y-6">
      {/* Header com Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Receita Orcamentaria</h2>
          <p className="text-sm text-muted-foreground">Acompanhamento da arrecadacao municipal</p>
        </div>
        <div className="flex gap-2">
          <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <HugeiconsIcon icon={FilterIcon} strokeWidth={2} className="mr-2 size-4" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <HugeiconsIcon icon={Download01Icon} strokeWidth={2} className="mr-2 size-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className="size-4" />
          </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Prevista</CardTitle>
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
              <HugeiconsIcon icon={Target01Icon} strokeWidth={2} className="size-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMillions(totaisGerais.prevista)}</div>
            <p className="text-xs text-muted-foreground mt-1">Orcamento atualizado {periodoSelecionado}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Arrecadada</CardTitle>
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
              <HugeiconsIcon icon={MoneyAdd01Icon} strokeWidth={2} className="size-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMillions(totaisGerais.arrecadada)}</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="secondary" className="text-xs">
                {calcPercent(totaisGerais.arrecadada, totaisGerais.prevista)}%
              </Badge>
              <span className="text-xs text-muted-foreground">da previsao</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">A Arrecadar</CardTitle>
            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
              <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} className="size-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMillions(Math.max(0, totaisGerais.aArrecadar))}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {calcPercent(Math.max(0, totaisGerais.aArrecadar), totaisGerais.prevista)}% pendente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Superavit/Deficit</CardTitle>
            <div className={`rounded-full p-2 ${totaisGerais.aArrecadar <= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              <HugeiconsIcon 
                icon={totaisGerais.aArrecadar <= 0 ? ArrowUp01Icon : ArrowDown01Icon} 
                strokeWidth={2} 
                className={`size-4 ${totaisGerais.aArrecadar <= 0 ? 'text-green-600' : 'text-red-600'}`} 
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totaisGerais.aArrecadar <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totaisGerais.aArrecadar <= 0 ? '+' : '-'}{formatMillions(Math.abs(totaisGerais.aArrecadar))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totaisGerais.aArrecadar <= 0 ? 'Acima da previsao' : 'Abaixo da previsao'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graficos Principais */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Evolucao Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={ChartLineData02Icon} strokeWidth={2} className="size-5" />
              Evolucao Mensal
            </CardTitle>
            <CardDescription>Comparativo previsto vs arrecadado por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                prevista: { label: "Prevista", color: "var(--chart-3)" },
                arrecadada: { label: "Arrecadada", color: "var(--chart-1)" },
              } satisfies ChartConfig}
              className="h-[280px] w-full"
            >
              <AreaChart data={evolucaoMensal} margin={{ left: 0, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
                <Area
                  dataKey="prevista"
                  type="monotone"
                  fill="var(--color-prevista)"
                  fillOpacity={0.2}
                  stroke="var(--color-prevista)"
                  strokeDasharray="5 5"
                />
                <Area
                  dataKey="arrecadada"
                  type="monotone"
                  fill="var(--color-arrecadada)"
                  fillOpacity={0.4}
                  stroke="var(--color-arrecadada)"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Distribuicao por Origem */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={PieChart02Icon} strokeWidth={2} className="size-5" />
              Composicao da Receita
            </CardTitle>
            <CardDescription>Distribuicao por origem dos recursos</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                proprias: { label: "Receitas Proprias", color: "var(--chart-1)" },
                estaduais: { label: "Transferencias Estaduais", color: "var(--chart-2)" },
                federais: { label: "Transferencias Federais", color: "var(--chart-3)" },
                outras: { label: "Outras Receitas", color: "var(--chart-4)" },
              } satisfies ChartConfig}
              className="mx-auto aspect-square h-[280px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} hideLabel />} />
                <Pie
                  data={distribuicaoOrigem}
                  dataKey="valor"
                  nameKey="nome"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                />
                <ChartLegend content={<ChartLegendContent nameKey="nome" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Resumo por Origem */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-[var(--chart-1)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <HugeiconsIcon icon={Home01Icon} strokeWidth={2} className="size-4" />
              Receitas Proprias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatMillions(totaisProprias.arrecadada)}</div>
            <Progress value={Number(calcPercent(totaisProprias.arrecadada, totaisProprias.prevista))} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {calcPercent(totaisProprias.arrecadada, totaisProprias.prevista)}% de {formatMillions(totaisProprias.prevista)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[var(--chart-2)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <HugeiconsIcon icon={Building06Icon} strokeWidth={2} className="size-4" />
              Transf. Estaduais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatMillions(totaisEstaduais.arrecadada)}</div>
            <Progress value={Number(calcPercent(totaisEstaduais.arrecadada, totaisEstaduais.prevista))} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {calcPercent(totaisEstaduais.arrecadada, totaisEstaduais.prevista)}% de {formatMillions(totaisEstaduais.prevista)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[var(--chart-3)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <HugeiconsIcon icon={Bank02Icon} strokeWidth={2} className="size-4" />
              Transf. Federais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatMillions(totaisFederais.arrecadada)}</div>
            <Progress value={Number(calcPercent(totaisFederais.arrecadada, totaisFederais.prevista))} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {calcPercent(totaisFederais.arrecadada, totaisFederais.prevista)}% de {formatMillions(totaisFederais.prevista)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[var(--chart-4)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <HugeiconsIcon icon={Wallet01Icon} strokeWidth={2} className="size-4" />
              Outras Receitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatMillions(totaisOutras.arrecadada)}</div>
            <Progress value={Number(calcPercent(totaisOutras.arrecadada, totaisOutras.prevista))} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {calcPercent(totaisOutras.arrecadada, totaisOutras.prevista)}% de {formatMillions(totaisOutras.prevista)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabelas Detalhadas por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Categoria</CardTitle>
          <CardDescription>Receitas agrupadas por origem e tipo</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="proprias" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="proprias">Proprias</TabsTrigger>
              <TabsTrigger value="estaduais">Estaduais</TabsTrigger>
              <TabsTrigger value="federais">Federais</TabsTrigger>
              <TabsTrigger value="outras">Outras</TabsTrigger>
            </TabsList>

            <TabsContent value="proprias" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Codigo</TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead className="text-right">Prevista</TableHead>
                    <TableHead className="text-right">Arrecadada</TableHead>
                    <TableHead className="text-right">%</TableHead>
                    <TableHead className="text-right">Diferenca</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receitasProprias.map((item) => (
                    <TableRow key={item.codigo}>
                      <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.prevista)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.arrecadada)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={Number(calcPercent(item.arrecadada, item.prevista)) >= 100 ? "secondary" : "outline"}>
                          {calcPercent(item.arrecadada, item.prevista)}%
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right ${item.aArrecadar <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.aArrecadar <= 0 ? '+' : ''}{formatCurrency(Math.abs(item.aArrecadar))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2} className="font-bold">Total Receitas Proprias</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totaisProprias.prevista)}</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totaisProprias.arrecadada)}</TableCell>
                    <TableCell className="text-right font-bold">{calcPercent(totaisProprias.arrecadada, totaisProprias.prevista)}%</TableCell>
                    <TableCell className={`text-right font-bold ${totaisProprias.aArrecadar <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(Math.abs(totaisProprias.aArrecadar))}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TabsContent>

            <TabsContent value="estaduais" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Codigo</TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead className="text-right">Prevista</TableHead>
                    <TableHead className="text-right">Arrecadada</TableHead>
                    <TableHead className="text-right">%</TableHead>
                    <TableHead className="text-right">Diferenca</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receitasEstaduais.map((item) => (
                    <TableRow key={item.codigo}>
                      <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.prevista)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.arrecadada)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={Number(calcPercent(item.arrecadada, item.prevista)) >= 100 ? "secondary" : "outline"}>
                          {calcPercent(item.arrecadada, item.prevista)}%
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right ${item.aArrecadar <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.aArrecadar <= 0 ? '+' : ''}{formatCurrency(Math.abs(item.aArrecadar))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2} className="font-bold">Total Transf. Estaduais</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totaisEstaduais.prevista)}</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totaisEstaduais.arrecadada)}</TableCell>
                    <TableCell className="text-right font-bold">{calcPercent(totaisEstaduais.arrecadada, totaisEstaduais.prevista)}%</TableCell>
                    <TableCell className={`text-right font-bold ${totaisEstaduais.aArrecadar <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(Math.abs(totaisEstaduais.aArrecadar))}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TabsContent>

            <TabsContent value="federais" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Codigo</TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead className="text-right">Prevista</TableHead>
                    <TableHead className="text-right">Arrecadada</TableHead>
                    <TableHead className="text-right">%</TableHead>
                    <TableHead className="text-right">Diferenca</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receitasFederais.map((item) => (
                    <TableRow key={item.codigo}>
                      <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.prevista)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.arrecadada)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={Number(calcPercent(item.arrecadada, item.prevista)) >= 100 ? "secondary" : "outline"}>
                          {calcPercent(item.arrecadada, item.prevista)}%
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right ${item.aArrecadar <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.aArrecadar <= 0 ? '+' : ''}{formatCurrency(Math.abs(item.aArrecadar))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2} className="font-bold">Total Transf. Federais</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totaisFederais.prevista)}</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totaisFederais.arrecadada)}</TableCell>
                    <TableCell className="text-right font-bold">{calcPercent(totaisFederais.arrecadada, totaisFederais.prevista)}%</TableCell>
                    <TableCell className={`text-right font-bold ${totaisFederais.aArrecadar <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(Math.abs(totaisFederais.aArrecadar))}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TabsContent>

            <TabsContent value="outras" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Codigo</TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead className="text-right">Prevista</TableHead>
                    <TableHead className="text-right">Arrecadada</TableHead>
                    <TableHead className="text-right">%</TableHead>
                    <TableHead className="text-right">Diferenca</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outrasReceitas.map((item) => (
                    <TableRow key={item.codigo}>
                      <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.prevista)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.arrecadada)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={Number(calcPercent(item.arrecadada, item.prevista)) >= 100 ? "secondary" : "outline"}>
                          {calcPercent(item.arrecadada, item.prevista)}%
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right ${item.aArrecadar <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.aArrecadar <= 0 ? '+' : ''}{formatCurrency(Math.abs(item.aArrecadar))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2} className="font-bold">Total Outras Receitas</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totaisOutras.prevista)}</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totaisOutras.arrecadada)}</TableCell>
                    <TableCell className="text-right font-bold">{calcPercent(totaisOutras.arrecadada, totaisOutras.prevista)}%</TableCell>
                    <TableCell className={`text-right font-bold ${totaisOutras.aArrecadar <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(Math.abs(totaisOutras.aArrecadar))}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Comparativo Anual e Top Contribuintes */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Historico Anual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={ChartLineData02Icon} strokeWidth={2} className="size-5" />
              Historico de Arrecadacao (5 anos)
            </CardTitle>
            <CardDescription>Evolucao da arrecadacao anual</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                prevista: { label: "Prevista", color: "var(--chart-3)" },
                arrecadada: { label: "Arrecadada", color: "var(--chart-1)" },
              } satisfies ChartConfig}
              className="h-[280px] w-full"
            >
              <BarChart data={comparativoAnual} margin={{ left: 0, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="ano" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
                <Bar dataKey="prevista" fill="var(--color-prevista)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="arrecadada" fill="var(--color-arrecadada)" radius={[4, 4, 0, 0]} />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Contribuintes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={Store01Icon} strokeWidth={2} className="size-5" />
              Maiores Contribuintes
            </CardTitle>
            <CardDescription>Top 5 contribuintes por arrecadacao</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topContribuintes.map((contribuinte, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Avatar size="sm">
                    <AvatarFallback>{index + 1}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate max-w-[200px]">{contribuinte.nome}</p>
                      <span className="text-sm font-semibold">{formatCurrency(contribuinte.valor)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{contribuinte.cnpj}</p>
                      <Badge variant="outline" className="text-xs">{contribuinte.tipo}</Badge>
                    </div>
                    <Progress value={(contribuinte.valor / topContribuintes[0].valor) * 100} className="h-1.5" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Timeline */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Alertas */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Alertas e Notificacoes</h3>
          {alertasReceita.map((alerta, index) => (
            <Alert key={index} variant={alerta.tipo === "warning" ? "destructive" : "default"}>
              <HugeiconsIcon 
                icon={alerta.tipo === "warning" ? Alert02Icon : alerta.tipo === "success" ? CheckmarkCircle02Icon : InformationCircleIcon} 
                strokeWidth={2} 
                className="size-4" 
              />
              <AlertTitle className="flex items-center gap-2">
                {alerta.titulo}
                <Badge variant="outline" className="text-xs">{alerta.tributo}</Badge>
              </AlertTitle>
              <AlertDescription>{alerta.descricao}</AlertDescription>
            </Alert>
          ))}
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} className="size-5" />
              Eventos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventosReceita.map((evento, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`size-2.5 rounded-full ${
                      evento.tipo === "credito" ? "bg-green-500" : "bg-blue-500"
                    }`} />
                    {index < eventosReceita.length - 1 && (
                      <div className="w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-xs text-muted-foreground">{evento.data}</p>
                    <p className="text-sm">{evento.evento}</p>
                    <Badge variant="outline" className="mt-1 text-xs">{evento.origem}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Analitico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={Target01Icon} strokeWidth={2} className="size-5" />
            Resumo Analitico
          </CardTitle>
          <CardDescription>Indicadores consolidados da arrecadacao</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Taxa de Realizacao</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{calcPercent(totaisGerais.arrecadada, totaisGerais.prevista)}%</span>
              </div>
              <Progress value={Number(calcPercent(totaisGerais.arrecadada, totaisGerais.prevista))} className="h-2" />
              <p className="text-xs text-muted-foreground">Meta: 100% ao final do exercicio</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Autonomia Financeira</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{calcPercent(totaisProprias.arrecadada, totaisGerais.arrecadada)}%</span>
              </div>
              <Progress value={Number(calcPercent(totaisProprias.arrecadada, totaisGerais.arrecadada))} className="h-2" />
              <p className="text-xs text-muted-foreground">Receitas proprias / Total</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Dependencia Federal</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{calcPercent(totaisFederais.arrecadada, totaisGerais.arrecadada)}%</span>
              </div>
              <Progress value={Number(calcPercent(totaisFederais.arrecadada, totaisGerais.arrecadada))} className="h-2" />
              <p className="text-xs text-muted-foreground">Transferencias federais / Total</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Receita Per Capita</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">R$ 2.286</span>
              </div>
              <p className="text-xs text-muted-foreground">Base: 100.000 habitantes</p>
              <p className="text-xs text-green-600">+8.2% vs ano anterior</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analise Inteligente */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <HugeiconsIcon icon={BulbIcon} strokeWidth={2} className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle>Analise Inteligente da Receita</CardTitle>
              <CardDescription>Insights sobre a arrecadacao municipal</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visao Geral */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-foreground leading-relaxed">
              A execucao da receita orcamentaria do municipio no exercicio de {periodoSelecionado} apresenta 
              taxa de realizacao de <strong>{calcPercent(totaisGerais.arrecadada, totaisGerais.prevista)}%</strong>, 
              totalizando <strong>{formatCurrency(totaisGerais.arrecadada)}</strong> arrecadados ate o momento. 
              A composicao da receita demonstra equilibrio entre fontes proprias ({calcPercent(totaisProprias.arrecadada, totaisGerais.arrecadada)}%) 
              e transferencias constitucionais ({calcPercent(totaisFederais.arrecadada + totaisEstaduais.arrecadada, totaisGerais.arrecadada)}%), 
              indicando razoavel autonomia financeira para um municipio de medio porte.
            </p>
          </div>

          <Separator />

          {/* Acordeao de Analises */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="receitas-proprias">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Home01Icon} strokeWidth={2} className="size-4 text-blue-600" />
                  <span>Analise das Receitas Proprias</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-6">
                  <div className="flex gap-2">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4 mt-0.5 text-green-600 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">ISS com desempenho excepcional:</strong> A arrecadacao do 
                      Imposto Sobre Servicos superou a previsao em 9.5%, totalizando R$ 26.5M. Este resultado 
                      reflete o aquecimento do setor de servicos no municipio, especialmente nos segmentos de 
                      tecnologia, saude e construcao civil.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4 mt-0.5 text-amber-600 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">ITBI abaixo da expectativa:</strong> A arrecadacao de ITBI 
                      ficou 19% abaixo da previsao, sinalizando desaceleracao no mercado imobiliario local. 
                      Recomenda-se monitorar tendencias do setor para ajustes na LOA do proximo exercicio.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-4 mt-0.5 text-blue-600 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">IPTU com boa performance:</strong> A arrecadacao do IPTU 
                      atinge 90.8% da previsao, comportamento esperado considerando que a ultima parcela 
                      vence em dezembro. Projeta-se atingimento integral da meta.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="transferencias">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Bank02Icon} strokeWidth={2} className="size-4 text-green-600" />
                  <span>Analise das Transferencias</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-6">
                  <div className="flex gap-2">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4 mt-0.5 text-green-600 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">FUNDEB estavel:</strong> As transferencias do FUNDEB 
                      apresentam regularidade, com 97.8% da previsao ja creditada. Os recursos estao sendo 
                      integralmente aplicados em educacao, conforme exigencia legal.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4 mt-0.5 text-amber-600 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Convenios federais com atraso:</strong> Apenas 61% dos 
                      recursos de convenios federais foram liberados. Ha R$ 3.3M pendentes que dependem de 
                      prestacao de contas e adequacao de documentacao junto aos ministerios.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-4 mt-0.5 text-blue-600 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">ICMS e FPM regulares:</strong> As principais transferencias 
                      constitucionais (ICMS, IPVA, FPM) apresentam comportamento dentro do esperado, com 
                      variacao de +/- 5% em relacao a previsao.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="recomendacoes">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={BulbIcon} strokeWidth={2} className="size-4 text-amber-600" />
                  <span>Recomendacoes</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-6">
                  <div className="rounded-lg border bg-amber-50/50 dark:bg-amber-950/20 p-3">
                    <p className="text-sm font-medium text-foreground mb-1">1. Intensificar cobranca de IPTU</p>
                    <p className="text-xs text-muted-foreground">
                      Com R$ 1.7M ainda a arrecadar em IPTU e apenas 1 mes ate o encerramento do exercicio, 
                      recomenda-se intensificar acoes de cobranca e notificacao aos contribuintes inadimplentes.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-amber-50/50 dark:bg-amber-950/20 p-3">
                    <p className="text-sm font-medium text-foreground mb-1">2. Regularizar convenios federais</p>
                    <p className="text-xs text-muted-foreground">
                      Priorizar a prestacao de contas e documentacao necessaria para liberacao dos 
                      R$ 3.3M em convenios federais pendentes antes do encerramento do exercicio.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-amber-50/50 dark:bg-amber-950/20 p-3">
                    <p className="text-sm font-medium text-foreground mb-1">3. Revisar previsao de ITBI para 2025</p>
                    <p className="text-xs text-muted-foreground">
                      Considerando a queda de 19% na arrecadacao de ITBI, sugere-se revisao da previsao 
                      para o proximo exercicio com base nas tendencias do mercado imobiliario local.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-green-50/50 dark:bg-green-950/20 p-3">
                    <p className="text-sm font-medium text-foreground mb-1">4. Aproveitar momento do ISS</p>
                    <p className="text-xs text-muted-foreground">
                      O bom desempenho do ISS indica oportunidade de ampliacao da base tributaria. 
                      Considerar programa de incentivo a formalizacao de prestadores de servicos.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="projecoes">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={ChartLineData02Icon} strokeWidth={2} className="size-4 text-purple-600" />
                  <span>Projecoes para Encerramento</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pl-6">
                  <p className="text-sm text-muted-foreground">
                    Com base na tendencia historica e no comportamento atual da arrecadacao, projeta-se 
                    para o encerramento do exercicio:
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-2xl font-bold text-green-600">97.5%</p>
                      <p className="text-xs text-muted-foreground">Cenario Otimista</p>
                      <p className="text-xs text-muted-foreground">R$ 237.8M</p>
                    </div>
                    <div className="rounded-lg border p-3 text-center bg-primary/5">
                      <p className="text-2xl font-bold text-primary">95.2%</p>
                      <p className="text-xs text-muted-foreground">Cenario Provavel</p>
                      <p className="text-xs text-muted-foreground">R$ 232.2M</p>
                    </div>
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-2xl font-bold text-amber-600">93.0%</p>
                      <p className="text-xs text-muted-foreground">Cenario Conservador</p>
                      <p className="text-xs text-muted-foreground">R$ 226.8M</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    * Projecoes consideram sazonalidade historica de dezembro e pendencias identificadas.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />

          {/* Conclusao */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex gap-3">
              <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Conclusao da Analise</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A arrecadacao municipal apresenta desempenho satisfatorio, com destaque para o ISS que 
                  supera a meta e compensa parcialmente a queda no ITBI. A dependencia de transferencias 
                  (federais e estaduais) em torno de {calcPercent(totaisFederais.arrecadada + totaisEstaduais.arrecadada, totaisGerais.arrecadada)}% 
                  esta dentro dos parametros esperados para municipios de porte semelhante. Com as acoes 
                  recomendadas, projeta-se encerramento do exercicio com taxa de realizacao proxima a 95%, 
                  garantindo recursos suficientes para execucao do orcamento aprovado.
                </p>
                <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                  Analise gerada em {new Date().toLocaleDateString('pt-BR')} as {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} 
                  {" "}| Dados referentes ao exercicio de {periodoSelecionado}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
