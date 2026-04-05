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
  ResponsiveContainer,
  Treemap,
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
  GridViewIcon,
  Analytics01Icon,
  FilterIcon,
  Download01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"

// Dados fictícios para demonstração
const dadosOrgaos = [
  { 
    codigo: "01", 
    nome: "Gabinete do Prefeito", 
    atualizada: 2850000, 
    empenhada: 2234500, 
    aEmpenhar: 615500, 
    pago: 1890000, 
    aPagar: 344500 
  },
  { 
    codigo: "02", 
    nome: "Secretaria de Administração", 
    atualizada: 5420000, 
    empenhada: 4890000, 
    aEmpenhar: 530000, 
    pago: 4120000, 
    aPagar: 770000 
  },
  { 
    codigo: "03", 
    nome: "Secretaria de Fazenda", 
    atualizada: 3180000, 
    empenhada: 2950000, 
    aEmpenhar: 230000, 
    pago: 2680000, 
    aPagar: 270000 
  },
  { 
    codigo: "04", 
    nome: "Secretaria de Educação", 
    atualizada: 45600000, 
    empenhada: 42300000, 
    aEmpenhar: 3300000, 
    pago: 38900000, 
    aPagar: 3400000 
  },
  { 
    codigo: "05", 
    nome: "Secretaria de Saúde", 
    atualizada: 52400000, 
    empenhada: 49800000, 
    aEmpenhar: 2600000, 
    pago: 46200000, 
    aPagar: 3600000 
  },
  { 
    codigo: "06", 
    nome: "Secretaria de Infraestrutura", 
    atualizada: 18900000, 
    empenhada: 16200000, 
    aEmpenhar: 2700000, 
    pago: 13500000, 
    aPagar: 2700000 
  },
  { 
    codigo: "07", 
    nome: "Secretaria de Assistência Social", 
    atualizada: 8750000, 
    empenhada: 7890000, 
    aEmpenhar: 860000, 
    pago: 6950000, 
    aPagar: 940000 
  },
  { 
    codigo: "08", 
    nome: "Secretaria de Meio Ambiente", 
    atualizada: 2340000, 
    empenhada: 1980000, 
    aEmpenhar: 360000, 
    pago: 1720000, 
    aPagar: 260000 
  },
]

const dadosUnidades = [
  { codigo: "04.01", nome: "Gabinete do Secretário de Educação", atualizada: 1200000, empenhada: 1100000, aEmpenhar: 100000, pago: 980000, aPagar: 120000 },
  { codigo: "04.02", nome: "Departamento de Ensino Fundamental", atualizada: 18500000, empenhada: 17200000, aEmpenhar: 1300000, pago: 15800000, aPagar: 1400000 },
  { codigo: "04.03", nome: "Departamento de Ensino Infantil", atualizada: 12400000, empenhada: 11600000, aEmpenhar: 800000, pago: 10700000, aPagar: 900000 },
  { codigo: "04.04", nome: "Departamento de Merenda Escolar", atualizada: 8900000, empenhada: 8200000, aEmpenhar: 700000, pago: 7500000, aPagar: 700000 },
  { codigo: "04.05", nome: "Departamento de Transporte Escolar", atualizada: 4600000, empenhada: 4200000, aEmpenhar: 400000, pago: 3920000, aPagar: 280000 },
]

const dadosFuncaoSubfuncao = [
  { funcao: "12", subfuncao: "361", nome: "Educação / Ensino Fundamental", atualizada: 32000000, empenhada: 29500000, aEmpenhar: 2500000, pago: 27200000, aPagar: 2300000 },
  { funcao: "12", subfuncao: "365", nome: "Educação / Ensino Infantil", atualizada: 13600000, empenhada: 12800000, aEmpenhar: 800000, pago: 11700000, aPagar: 1100000 },
  { funcao: "10", subfuncao: "301", nome: "Saúde / Atenção Básica", atualizada: 28500000, empenhada: 27100000, aEmpenhar: 1400000, pago: 25200000, aPagar: 1900000 },
  { funcao: "10", subfuncao: "302", nome: "Saúde / Assistência Hospitalar", atualizada: 23900000, empenhada: 22700000, aEmpenhar: 1200000, pago: 21000000, aPagar: 1700000 },
  { funcao: "08", subfuncao: "244", nome: "Assistência Social / Assistência Comunitária", atualizada: 8750000, empenhada: 7890000, aEmpenhar: 860000, pago: 6950000, aPagar: 940000 },
  { funcao: "15", subfuncao: "451", nome: "Urbanismo / Infraestrutura Urbana", atualizada: 14200000, empenhada: 12100000, aEmpenhar: 2100000, pago: 10200000, aPagar: 1900000 },
  { funcao: "04", subfuncao: "122", nome: "Administração / Administração Geral", atualizada: 8270000, empenhada: 7840000, aEmpenhar: 430000, pago: 6800000, aPagar: 1040000 },
]

const dadosProgramas = [
  { codigo: "0001", nome: "Gestão e Manutenção Administrativa", atualizada: 12500000, empenhada: 11800000, aEmpenhar: 700000, pago: 10500000, aPagar: 1300000 },
  { codigo: "0010", nome: "Educação de Qualidade para Todos", atualizada: 45600000, empenhada: 42300000, aEmpenhar: 3300000, pago: 38900000, aPagar: 3400000 },
  { codigo: "0020", nome: "Saúde para a Comunidade", atualizada: 52400000, empenhada: 49800000, aEmpenhar: 2600000, pago: 46200000, aPagar: 3600000 },
  { codigo: "0030", nome: "Assistência Social Integral", atualizada: 8750000, empenhada: 7890000, aEmpenhar: 860000, pago: 6950000, aPagar: 940000 },
  { codigo: "0040", nome: "Cidade Sustentável", atualizada: 18900000, empenhada: 16200000, aEmpenhar: 2700000, pago: 13500000, aPagar: 2700000 },
  { codigo: "0050", nome: "Meio Ambiente Preservado", atualizada: 2340000, empenhada: 1980000, aEmpenhar: 360000, pago: 1720000, aPagar: 260000 },
]

const dadosAcoes = [
  { codigo: "2001", tipo: "Atividade", nome: "Manutenção das Atividades Administrativas", atualizada: 8500000, empenhada: 8100000, aEmpenhar: 400000, pago: 7200000, aPagar: 900000 },
  { codigo: "2010", tipo: "Atividade", nome: "Manutenção do Ensino Fundamental", atualizada: 28000000, empenhada: 26200000, aEmpenhar: 1800000, pago: 24100000, aPagar: 2100000 },
  { codigo: "2011", tipo: "Atividade", nome: "Manutenção do Ensino Infantil", atualizada: 12400000, empenhada: 11600000, aEmpenhar: 800000, pago: 10700000, aPagar: 900000 },
  { codigo: "1001", tipo: "Projeto", nome: "Construção de Escola Municipal", atualizada: 3200000, empenhada: 2800000, aEmpenhar: 400000, pago: 2400000, aPagar: 400000 },
  { codigo: "2020", tipo: "Atividade", nome: "Manutenção da Atenção Básica", atualizada: 28500000, empenhada: 27100000, aEmpenhar: 1400000, pago: 25200000, aPagar: 1900000 },
  { codigo: "2021", tipo: "Atividade", nome: "Manutenção Hospitalar", atualizada: 23900000, empenhada: 22700000, aEmpenhar: 1200000, pago: 21000000, aPagar: 1700000 },
  { codigo: "1010", tipo: "Projeto", nome: "Ampliação da UBS Central", atualizada: 1800000, empenhada: 1500000, aEmpenhar: 300000, pago: 1200000, aPagar: 300000 },
  { codigo: "2030", tipo: "Atividade", nome: "Pavimentação de Vias Urbanas", atualizada: 8500000, empenhada: 7200000, aEmpenhar: 1300000, pago: 5800000, aPagar: 1400000 },
]

const dadosSecretarias = [
  { nome: "Secretaria de Educação", sigla: "SEMED", atualizada: 45600000, empenhada: 42300000, aEmpenhar: 3300000, pago: 38900000, aPagar: 3400000 },
  { nome: "Secretaria de Saúde", sigla: "SEMSA", atualizada: 52400000, empenhada: 49800000, aEmpenhar: 2600000, pago: 46200000, aPagar: 3600000 },
  { nome: "Secretaria de Infraestrutura", sigla: "SEMINF", atualizada: 18900000, empenhada: 16200000, aEmpenhar: 2700000, pago: 13500000, aPagar: 2700000 },
  { nome: "Secretaria de Assistência Social", sigla: "SEMAS", atualizada: 8750000, empenhada: 7890000, aEmpenhar: 860000, pago: 6950000, aPagar: 940000 },
  { nome: "Secretaria de Administração", sigla: "SEMAD", atualizada: 5420000, empenhada: 4890000, aEmpenhar: 530000, pago: 4120000, aPagar: 770000 },
  { nome: "Secretaria de Fazenda", sigla: "SEMFAZ", atualizada: 3180000, empenhada: 2950000, aEmpenhar: 230000, pago: 2680000, aPagar: 270000 },
  { nome: "Gabinete do Prefeito", sigla: "GAB", atualizada: 2850000, empenhada: 2234500, aEmpenhar: 615500, pago: 1890000, aPagar: 344500 },
  { nome: "Secretaria de Meio Ambiente", sigla: "SEMMA", atualizada: 2340000, empenhada: 1980000, aEmpenhar: 360000, pago: 1720000, aPagar: 260000 },
]

// Dados para evolução mensal
const evolucaoMensal = [
  { mes: "Jan", empenhado: 11500000, pago: 9800000 },
  { mes: "Fev", empenhado: 12200000, pago: 10500000 },
  { mes: "Mar", empenhado: 13100000, pago: 11200000 },
  { mes: "Abr", empenhado: 11800000, pago: 10800000 },
  { mes: "Mai", empenhado: 12600000, pago: 11500000 },
  { mes: "Jun", empenhado: 13400000, pago: 12100000 },
  { mes: "Jul", empenhado: 12900000, pago: 11800000 },
  { mes: "Ago", empenhado: 13800000, pago: 12500000 },
  { mes: "Set", empenhado: 14200000, pago: 13100000 },
  { mes: "Out", empenhado: 13600000, pago: 12800000 },
  { mes: "Nov", empenhado: 14500000, pago: 13200000 },
  { mes: "Dez", empenhado: 4644500, pago: 3560000 },
]

// Totais gerais
const totais = {
  atualizada: 139440000,
  empenhada: 128244500,
  aEmpenhar: 11195500,
  pago: 115960000,
  aPagar: 12284500,
}

// Função para formatar valores em reais
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Função para formatar valores em milhões
function formatMillions(value: number): string {
  return `R$ ${(value / 1000000).toFixed(1)}M`
}

// Função para calcular percentual
function calcPercent(value: number, total: number): number {
  return Math.round((value / total) * 100)
}

export function DespesaMunicipal() {
  const [periodoSelecionado, setPeriodoSelecionado] = React.useState("2024")
  const [viewMode, setViewMode] = React.useState("orgao")

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Despesa Municipal</h2>
          <p className="text-muted-foreground">Execucao orcamentaria do municipio</p>
        </div>
        <div className="flex flex-wrap gap-2">
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
            <HugeiconsIcon icon={FilterIcon} strokeWidth={2} data-icon="inline-start" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <HugeiconsIcon icon={Download01Icon} strokeWidth={2} data-icon="inline-start" />
            Exportar
          </Button>
          <Button variant="outline" size="icon-sm">
            <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
          </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <HugeiconsIcon icon={Wallet01Icon} strokeWidth={2} className="size-4" />
              Despesa Atualizada
            </CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totais.atualizada)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Orcamento atualizado do exercicio</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <HugeiconsIcon icon={Invoice01Icon} strokeWidth={2} className="size-4" />
              Despesa Empenhada
            </CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totais.empenhada)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Progress value={calcPercent(totais.empenhada, totais.atualizada)} className="h-2 flex-1" />
              <span className="text-xs font-medium">{calcPercent(totais.empenhada, totais.atualizada)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <HugeiconsIcon icon={Calendar01Icon} strokeWidth={2} className="size-4" />
              A Empenhar
            </CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totais.aEmpenhar)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{calcPercent(totais.aEmpenhar, totais.atualizada)}% do orcamento disponivel</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <HugeiconsIcon icon={MoneyReceiveSquareIcon} strokeWidth={2} className="size-4" />
              Pago
            </CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totais.pago)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Progress value={calcPercent(totais.pago, totais.empenhada)} className="h-2 flex-1" />
              <span className="text-xs font-medium">{calcPercent(totais.pago, totais.empenhada)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <HugeiconsIcon icon={Building06Icon} strokeWidth={2} className="size-4" />
              A Pagar
            </CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totais.aPagar)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs">
              <Badge variant="outline" className="text-amber-600">
                <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} className="size-3" />
                {calcPercent(totais.aPagar, totais.empenhada)}% pendente
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graficos de Visao Geral */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Evolucao Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Evolucao Mensal da Execucao</CardTitle>
            <CardDescription>Empenhado vs Pago por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                empenhado: { label: "Empenhado", color: "var(--chart-1)" },
                pago: { label: "Pago", color: "var(--chart-2)" },
              } satisfies ChartConfig}
              className="h-[280px] w-full"
            >
              <AreaChart data={evolucaoMensal} margin={{ left: 0, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
                <Area type="monotone" dataKey="empenhado" fill="var(--color-empenhado)" fillOpacity={0.3} stroke="var(--color-empenhado)" strokeWidth={2} />
                <Area type="monotone" dataKey="pago" fill="var(--color-pago)" fillOpacity={0.3} stroke="var(--color-pago)" strokeWidth={2} />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Distribuicao por Secretaria */}
        <Card>
          <CardHeader>
            <CardTitle>Despesa por Secretaria</CardTitle>
            <CardDescription>Distribuicao da despesa empenhada</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                SEMSA: { label: "Saude", color: "var(--chart-1)" },
                SEMED: { label: "Educacao", color: "var(--chart-2)" },
                SEMINF: { label: "Infraestrutura", color: "var(--chart-3)" },
                SEMAS: { label: "Assistencia Social", color: "var(--chart-4)" },
                outros: { label: "Outros", color: "var(--chart-5)" },
              } satisfies ChartConfig}
              className="mx-auto aspect-square h-[280px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} hideLabel />} />
                <Pie
                  data={[
                    { name: "SEMSA", value: 49800000, fill: "var(--color-SEMSA)" },
                    { name: "SEMED", value: 42300000, fill: "var(--color-SEMED)" },
                    { name: "SEMINF", value: 16200000, fill: "var(--color-SEMINF)" },
                    { name: "SEMAS", value: 7890000, fill: "var(--color-SEMAS)" },
                    { name: "outros", value: 12054500, fill: "var(--color-outros)" },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                />
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabelas por Classificacao */}
      <Tabs defaultValue="orgao" className="w-full" onValueChange={setViewMode}>
        <TabsList variant="line" className="w-full justify-start">
          <TabsTrigger value="orgao">Por Orgao</TabsTrigger>
          <TabsTrigger value="unidade">Por Unidade</TabsTrigger>
          <TabsTrigger value="funcao">Funcao/Subfuncao</TabsTrigger>
          <TabsTrigger value="programa">Por Programa</TabsTrigger>
          <TabsTrigger value="acao">Por Acao</TabsTrigger>
          <TabsTrigger value="secretaria">Por Secretaria</TabsTrigger>
        </TabsList>

        {/* Tabela por Orgao */}
        <TabsContent value="orgao" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Execucao por Orgao</CardTitle>
              <CardDescription>Despesa orcamentaria por orgao da administracao</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Codigo</TableHead>
                    <TableHead>Orgao</TableHead>
                    <TableHead className="text-right">Atualizada</TableHead>
                    <TableHead className="text-right">Empenhada</TableHead>
                    <TableHead className="text-right">A Empenhar</TableHead>
                    <TableHead className="text-right">Pago</TableHead>
                    <TableHead className="text-right">A Pagar</TableHead>
                    <TableHead className="w-32">Execucao</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosOrgaos.map((item) => (
                    <TableRow key={item.codigo}>
                      <TableCell className="font-mono text-xs">{item.codigo}</TableCell>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.atualizada)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.empenhada)}</TableCell>
                      <TableCell className="text-right font-mono text-sm text-muted-foreground">{formatCurrency(item.aEmpenhar)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.pago)}</TableCell>
                      <TableCell className="text-right font-mono text-sm text-amber-600">{formatCurrency(item.aPagar)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={calcPercent(item.empenhada, item.atualizada)} className="h-2 flex-1" />
                          <span className="w-10 text-right text-xs">{calcPercent(item.empenhada, item.atualizada)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2} className="font-bold">Total Geral</TableCell>
                    <TableCell className="text-right font-mono font-bold">{formatCurrency(totais.atualizada)}</TableCell>
                    <TableCell className="text-right font-mono font-bold">{formatCurrency(totais.empenhada)}</TableCell>
                    <TableCell className="text-right font-mono font-bold">{formatCurrency(totais.aEmpenhar)}</TableCell>
                    <TableCell className="text-right font-mono font-bold">{formatCurrency(totais.pago)}</TableCell>
                    <TableCell className="text-right font-mono font-bold">{formatCurrency(totais.aPagar)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tabela por Unidade */}
        <TabsContent value="unidade" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Execucao por Unidade Orcamentaria</CardTitle>
              <CardDescription>Despesa orcamentaria por unidade (Educacao)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Codigo</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead className="text-right">Atualizada</TableHead>
                    <TableHead className="text-right">Empenhada</TableHead>
                    <TableHead className="text-right">A Empenhar</TableHead>
                    <TableHead className="text-right">Pago</TableHead>
                    <TableHead className="text-right">A Pagar</TableHead>
                    <TableHead className="w-32">Execucao</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosUnidades.map((item) => (
                    <TableRow key={item.codigo}>
                      <TableCell className="font-mono text-xs">{item.codigo}</TableCell>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.atualizada)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.empenhada)}</TableCell>
                      <TableCell className="text-right font-mono text-sm text-muted-foreground">{formatCurrency(item.aEmpenhar)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.pago)}</TableCell>
                      <TableCell className="text-right font-mono text-sm text-amber-600">{formatCurrency(item.aPagar)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={calcPercent(item.empenhada, item.atualizada)} className="h-2 flex-1" />
                          <span className="w-10 text-right text-xs">{calcPercent(item.empenhada, item.atualizada)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tabela por Funcao/Subfuncao */}
        <TabsContent value="funcao" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Execucao por Funcao/Subfuncao</CardTitle>
              <CardDescription>Classificacao funcional da despesa</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Funcao</TableHead>
                    <TableHead className="w-24">Subfuncao</TableHead>
                    <TableHead>Descricao</TableHead>
                    <TableHead className="text-right">Atualizada</TableHead>
                    <TableHead className="text-right">Empenhada</TableHead>
                    <TableHead className="text-right">Pago</TableHead>
                    <TableHead className="w-32">Execucao</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosFuncaoSubfuncao.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{item.funcao}</TableCell>
                      <TableCell className="font-mono text-xs">{item.subfuncao}</TableCell>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.atualizada)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.empenhada)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.pago)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={calcPercent(item.empenhada, item.atualizada)} className="h-2 flex-1" />
                          <span className="w-10 text-right text-xs">{calcPercent(item.empenhada, item.atualizada)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tabela por Programa */}
        <TabsContent value="programa" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Execucao por Programa</CardTitle>
              <CardDescription>Despesa por programa de governo</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Codigo</TableHead>
                    <TableHead>Programa</TableHead>
                    <TableHead className="text-right">Atualizada</TableHead>
                    <TableHead className="text-right">Empenhada</TableHead>
                    <TableHead className="text-right">A Empenhar</TableHead>
                    <TableHead className="text-right">Pago</TableHead>
                    <TableHead className="text-right">A Pagar</TableHead>
                    <TableHead className="w-32">Execucao</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosProgramas.map((item) => (
                    <TableRow key={item.codigo}>
                      <TableCell className="font-mono text-xs">{item.codigo}</TableCell>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.atualizada)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.empenhada)}</TableCell>
                      <TableCell className="text-right font-mono text-sm text-muted-foreground">{formatCurrency(item.aEmpenhar)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.pago)}</TableCell>
                      <TableCell className="text-right font-mono text-sm text-amber-600">{formatCurrency(item.aPagar)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={calcPercent(item.empenhada, item.atualizada)} className="h-2 flex-1" />
                          <span className="w-10 text-right text-xs">{calcPercent(item.empenhada, item.atualizada)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tabela por Acao */}
        <TabsContent value="acao" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Execucao por Acao</CardTitle>
              <CardDescription>Projetos e atividades orcamentarias</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Codigo</TableHead>
                    <TableHead className="w-24">Tipo</TableHead>
                    <TableHead>Acao</TableHead>
                    <TableHead className="text-right">Atualizada</TableHead>
                    <TableHead className="text-right">Empenhada</TableHead>
                    <TableHead className="text-right">Pago</TableHead>
                    <TableHead className="w-32">Execucao</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosAcoes.map((item) => (
                    <TableRow key={item.codigo}>
                      <TableCell className="font-mono text-xs">{item.codigo}</TableCell>
                      <TableCell>
                        <Badge variant={item.tipo === "Projeto" ? "default" : "secondary"} className="text-xs">
                          {item.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.atualizada)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.empenhada)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.pago)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={calcPercent(item.empenhada, item.atualizada)} className="h-2 flex-1" />
                          <span className="w-10 text-right text-xs">{calcPercent(item.empenhada, item.atualizada)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tabela por Secretaria */}
        <TabsContent value="secretaria" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Execucao por Secretaria</CardTitle>
              <CardDescription>Visao consolidada por secretaria</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Sigla</TableHead>
                    <TableHead>Secretaria</TableHead>
                    <TableHead className="text-right">Atualizada</TableHead>
                    <TableHead className="text-right">Empenhada</TableHead>
                    <TableHead className="text-right">A Empenhar</TableHead>
                    <TableHead className="text-right">Pago</TableHead>
                    <TableHead className="text-right">A Pagar</TableHead>
                    <TableHead className="w-32">Execucao</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosSecretarias.map((item) => (
                    <TableRow key={item.sigla}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">{item.sigla}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.atualizada)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.empenhada)}</TableCell>
                      <TableCell className="text-right font-mono text-sm text-muted-foreground">{formatCurrency(item.aEmpenhar)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.pago)}</TableCell>
                      <TableCell className="text-right font-mono text-sm text-amber-600">{formatCurrency(item.aPagar)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={calcPercent(item.empenhada, item.atualizada)} className="h-2 flex-1" />
                          <span className="w-10 text-right text-xs">{calcPercent(item.empenhada, item.atualizada)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Graficos Adicionais */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Comparativo de Execucao */}
        <Card>
          <CardHeader>
            <CardTitle>Comparativo de Execucao por Secretaria</CardTitle>
            <CardDescription>Empenhado vs Pago por secretaria</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                empenhada: { label: "Empenhada", color: "var(--chart-1)" },
                pago: { label: "Pago", color: "var(--chart-2)" },
              } satisfies ChartConfig}
              className="h-[300px] w-full"
            >
              <BarChart
                data={dadosSecretarias.slice(0, 5).map(s => ({
                  sigla: s.sigla,
                  empenhada: s.empenhada,
                  pago: s.pago,
                }))}
                layout="vertical"
                margin={{ left: 60, right: 12 }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
                <YAxis dataKey="sigla" type="category" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
                <Bar dataKey="empenhada" fill="var(--color-empenhada)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="pago" fill="var(--color-pago)" radius={[0, 4, 4, 0]} />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Indicadores de Alerta */}
        <Card>
          <CardHeader>
            <CardTitle>Indicadores de Atencao</CardTitle>
            <CardDescription>Orgaos com execucao abaixo de 90%</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dadosOrgaos
              .filter(o => calcPercent(o.empenhada, o.atualizada) < 90)
              .sort((a, b) => calcPercent(a.empenhada, a.atualizada) - calcPercent(b.empenhada, b.atualizada))
              .map((item) => (
                <div key={item.codigo} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">{item.codigo}</Badge>
                      <span className="text-sm font-medium">{item.nome}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {calcPercent(item.empenhada, item.atualizada)}%
                    </span>
                  </div>
                  <Progress 
                    value={calcPercent(item.empenhada, item.atualizada)} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Empenhado: {formatCurrency(item.empenhada)}</span>
                    <span>Saldo: {formatCurrency(item.aEmpenhar)}</span>
                  </div>
                  <Separator />
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Resumo Analitico */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Analitico</CardTitle>
          <CardDescription>Indicadores de desempenho da execucao orcamentaria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Taxa de Execucao</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{calcPercent(totais.empenhada, totais.atualizada)}%</span>
                <Badge variant="secondary" className="text-xs">
                  <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} className="size-3" />
                  +5.2%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Comparado ao mesmo periodo do ano anterior</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Taxa de Pagamento</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{calcPercent(totais.pago, totais.empenhada)}%</span>
                <Badge variant="secondary" className="text-xs">
                  <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} className="size-3" />
                  +2.8%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Do total empenhado foi efetivamente pago</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Restos a Pagar</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatMillions(totais.aPagar)}</span>
                <Badge variant="outline" className="text-xs text-amber-600">
                  <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-3" />
                  -12%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Reducao em relacao ao ano anterior</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Saldo Disponivel</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatMillions(totais.aEmpenhar)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{calcPercent(totais.aEmpenhar, totais.atualizada)}% do orcamento ainda disponivel</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
