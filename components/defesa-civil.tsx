"use client";

import * as React from "react";
import {
  Alert02Icon,
  AlertCircleIcon,
  Activity01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  DeliveryTruck01Icon,
  DropletIcon,
  FirstAidKitIcon,
  Flag01Icon,
  HandHelpingIcon,
  Home01Icon,
  InformationCircleIcon,
  SecurityCheckIcon,
  ShoppingCart01Icon,
  Target01Icon,
  UserMultipleIcon,
  BulbIcon,
  MedicineBottle02Icon,
  Archive02Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  ChartLineData02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CardDescription } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/kpi-card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── Tipos de alerta ──────────────────────────────────────────────────────────

type NivelAlerta = "normal" | "observacao" | "atencao" | "alerta" | "emergencia";

const NIVEL_CONFIG: Record<NivelAlerta, { label: string; color: string; bg: string; badge: string }> = {
  normal:     { label: "Normal",      color: "text-green-600 dark:text-green-400",   bg: "bg-green-50 dark:bg-green-950/30",   badge: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" },
  observacao: { label: "Observação",  color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950/30", badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300" },
  atencao:    { label: "Atenção",     color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30", badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300" },
  alerta:     { label: "Alerta",      color: "text-red-600 dark:text-red-400",       bg: "bg-red-50 dark:bg-red-950/30",       badge: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" },
  emergencia: { label: "Emergência",  color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/30", badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300" },
};

// ─── Dados demo — Monitoramento ───────────────────────────────────────────────

const NIVEL_ATUAL: NivelAlerta = "atencao";

const chuvaHistorico = [
  { dia: "Dom", mm: 8 },
  { dia: "Seg", mm: 14 },
  { dia: "Ter", mm: 6 },
  { dia: "Qua", mm: 31 },
  { dia: "Qui", mm: 48 },
  { dia: "Sex", mm: 52 },
  { dia: "Sáb", mm: 19 },
];

const nivelRioHistorico = [
  { hora: "00h", nivel: 42 },
  { hora: "02h", nivel: 45 },
  { hora: "04h", nivel: 49 },
  { hora: "06h", nivel: 53 },
  { hora: "08h", nivel: 58 },
  { hora: "10h", nivel: 63 },
  { hora: "12h", nivel: 68 },
  { hora: "14h", nivel: 65 },
  { hora: "16h", nivel: 62 },
  { hora: "18h", nivel: 60 },
  { hora: "20h", nivel: 61 },
  { hora: "22h", nivel: 64 },
];

const previsao5dias = [
  { dia: "Sáb", tMin: 19, tMax: 26, chuva: 19, icon: "🌦️" },
  { dia: "Dom", tMin: 21, tMax: 28, chuva: 32, icon: "🌧️" },
  { dia: "Seg", tMin: 20, tMax: 25, chuva: 45, icon: "⛈️" },
  { dia: "Ter", tMin: 18, tMax: 24, chuva: 28, icon: "🌦️" },
  { dia: "Qua", tMin: 17, tMax: 23, chuva: 8,  icon: "🌤️" },
];

const comunidadesRisco = [
  { nome: "Vila Ribeirinha",    nivel: "alerta"     as NivelAlerta, familias: 312, tipo: "Enchente" },
  { nome: "Jardim das Pedras",  nivel: "atencao"    as NivelAlerta, familias: 148, tipo: "Deslizamento" },
  { nome: "Bairro Santa Cruz",  nivel: "atencao"    as NivelAlerta, familias: 204, tipo: "Enchente" },
  { nome: "Morro do Cruzeiro",  nivel: "observacao" as NivelAlerta, familias: 89,  tipo: "Ventania" },
  { nome: "Conjunto Esperança", nivel: "observacao" as NivelAlerta, familias: 127, tipo: "Enchente" },
  { nome: "Centro Histórico",   nivel: "normal"     as NivelAlerta, familias: 967, tipo: "—" },
];

// ─── Dados demo — Ocorrências ─────────────────────────────────────────────────

const ocorrencias = [
  { id: "DC-2025-041", tipo: "Enchente",     bairro: "Vila Ribeirinha",   abertura: "08/01 — 14h32", status: "Em atendimento", afetados: 148, equipe: "Busca e Resgate A" },
  { id: "DC-2025-042", tipo: "Ventania",     bairro: "Bairro Santa Cruz", abertura: "08/01 — 16h10", status: "Em atendimento", afetados: 62,  equipe: "Operações Urbanas" },
  { id: "DC-2025-043", tipo: "Deslizamento", bairro: "Jardim das Pedras", abertura: "08/01 — 17h55", status: "Aguardando recurso", afetados: 34, equipe: "—" },
  { id: "DC-2025-044", tipo: "Enchente",     bairro: "Conjunto Esperança", abertura: "09/01 — 06h20", status: "Em atendimento", afetados: 97, equipe: "Saúde de Campo" },
  { id: "DC-2025-045", tipo: "Ventania",     bairro: "Centro",            abertura: "09/01 — 08h05", status: "Encerrado",      afetados: 12, equipe: "Operações Urbanas" },
  { id: "DC-2025-046", tipo: "Enchente",     bairro: "Vila Ribeirinha",   abertura: "09/01 — 09h40", status: "Em atendimento", afetados: 70, equipe: "Busca e Resgate A" },
];

const ocorrenciasMensais = [
  { mes: "Jul", enchente: 2,  ventania: 4,  deslizamento: 1 },
  { mes: "Ago", enchente: 1,  ventania: 3,  deslizamento: 0 },
  { mes: "Set", enchente: 3,  ventania: 5,  deslizamento: 2 },
  { mes: "Out", enchente: 5,  ventania: 6,  deslizamento: 3 },
  { mes: "Nov", enchente: 8,  ventania: 9,  deslizamento: 4 },
  { mes: "Dez", enchente: 12, ventania: 11, deslizamento: 6 },
  { mes: "Jan", enchente: 7,  ventania: 8,  deslizamento: 3 },
];

// ─── Dados demo — Recursos ────────────────────────────────────────────────────

const abrigos = [
  { nome: "Ginásio Municipal",          capacidade: 300, ocupacao: 118, status: "Ativo",   responsavel: "João Ferreira",   tel: "(44) 99801-2233" },
  { nome: "Escola Est. João XXIII",     capacidade: 200, ocupacao: 0,   status: "Standby", responsavel: "Maria Conceição", tel: "(44) 99802-4455" },
  { nome: "Centro Comunitário Norte",   capacidade: 150, ocupacao: 0,   status: "Standby", responsavel: "Carlos Mendes",   tel: "(44) 99803-6677" },
];

const suprimentos = [
  { categoria: "Água potável",    disponivel: "12.000 L",  consumoDia: "2.360 L/dia", autonomia: 5,  pct: 42, icon: DropletIcon,       critico: false },
  { categoria: "Cestas básicas",  disponivel: "340 kits",  consumoDia: "25/dia",      autonomia: 13, pct: 68, icon: ShoppingCart01Icon, critico: false },
  { categoria: "Kits de roupa",   disponivel: "280 kits",  consumoDia: "—",           autonomia: 0,  pct: 56, icon: Archive02Icon,      critico: false },
  { categoria: "Kits de higiene", disponivel: "190 kits",  consumoDia: "—",           autonomia: 0,  pct: 38, icon: FirstAidKitIcon,    critico: false },
  { categoria: "Medicamentos",    disponivel: "48 kits",   consumoDia: "8/dia",       autonomia: 6,  pct: 24, icon: MedicineBottle02Icon,critico: false },
  { categoria: "Lonas/abrigo",    disponivel: "35 kits",   consumoDia: "—",           autonomia: 0,  pct: 18, icon: Home01Icon,         critico: true  },
  { categoria: "Geradores",       disponivel: "3 / 10",    consumoDia: "—",           autonomia: 0,  pct: 30, icon: BulbIcon,           critico: false },
];

// ─── Dados demo — Logística ───────────────────────────────────────────────────

const zonasEvacuacao = [
  { zona: "A", descricao: "Vila Ribeirinha",    risco: "Enchente",     rota: "Av. Principal → R. das Flores → Ginásio Municipal",    destino: "Ginásio Municipal",        status: "Em uso",    pop: 312,  prioridade: "Alta"  },
  { zona: "B", descricao: "Jardim das Pedras",  risco: "Deslizamento", rota: "Estrada Rural → Anel Viário → Escola João XXIII",      destino: "Escola Est. João XXIII",   status: "Livre",     pop: 148,  prioridade: "Alta"  },
  { zona: "C", descricao: "Morro do Cruzeiro",  risco: "Ventania",     rota: "R. do Morro → Av. Central → Centro Comunitário Norte", destino: "Centro Com. Norte",        status: "Livre",     pop: 89,   prioridade: "Média" },
  { zona: "D", descricao: "Conjunto Esperança", risco: "Enchente",     rota: "R. Esperança → Via Expressa → Ginásio Municipal",      destino: "Ginásio Municipal",        status: "Bloqueada", pop: 204,  prioridade: "Alta"  },
];

const equipes = [
  { nome: "Busca e Resgate A",  funcao: "Resgate em área alagada",    status: "Ativa",   local: "Vila Ribeirinha",    membros: 6  },
  { nome: "Saúde de Campo",     funcao: "Triagem e atendimento",      status: "Ativa",   local: "Ginásio Municipal",  membros: 4  },
  { nome: "Distribuição",       funcao: "Entrega de suprimentos",     status: "Ativa",   local: "Centro Logístico",   membros: 5  },
  { nome: "Monitoramento Rio",  funcao: "Medição nível d'água",       status: "Ativa",   local: "Margem Norte",       membros: 3  },
  { nome: "Busca e Resgate B",  funcao: "Resgate em área de risco",   status: "Standby", local: "Base Central",       membros: 6  },
  { nome: "Eng. Vistoria",      funcao: "Avaliação de imóveis",       status: "Ativa",   local: "Bairro Santa Cruz",  membros: 3  },
];

const veiculos = [
  { tipo: "Viaturas leves",       total: 8,  emUso: 5, icon: DeliveryTruck01Icon },
  { tipo: "Caminhões suprimento", total: 3,  emUso: 2, icon: DeliveryTruck01Icon },
  { tipo: "Barcos de resgate",    total: 4,  emUso: 4, icon: DropletIcon          },
  { tipo: "Geradores portáteis",  total: 10, emUso: 7, icon: BulbIcon             },
];

// ─── Chart configs ────────────────────────────────────────────────────────────

const chartConfigChuva: ChartConfig = {
  mm: { label: "Chuva (mm)", color: "var(--chart-1)" },
};

const chartConfigRio: ChartConfig = {
  nivel: { label: "Nível (%)", color: "var(--chart-2)" },
};

const chartConfigOcorrencias: ChartConfig = {
  enchente:     { label: "Enchente",     color: "var(--chart-1)" },
  ventania:     { label: "Ventania",     color: "var(--chart-2)" },
  deslizamento: { label: "Deslizamento", color: "var(--chart-3)" },
};

// ─── Helper components ────────────────────────────────────────────────────────

function NivelBadge({ nivel }: { nivel: NivelAlerta }) {
  const cfg = NIVEL_CONFIG[nivel];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cfg.badge}`}>
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Em atendimento":     "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    "Aguardando recurso": "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    "Encerrado":          "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    "Ativo":              "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    "Standby":            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    "Ativa":              "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    "Em uso":             "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    "Livre":              "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    "Bloqueada":          "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

// ─── Painel Monitoramento ─────────────────────────────────────────────────────

function PainelMonitoramento() {
  const cfg = NIVEL_CONFIG[NIVEL_ATUAL];
  return (
    <div className="space-y-6">
      {/* Nível de alerta geral */}
      <div className={`rounded-xl border p-4 ${cfg.bg}`}>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className={`size-5 ${cfg.color}`} />
            <div>
              <p className={`text-sm font-semibold ${cfg.color}`}>Nível de alerta municipal — {cfg.label}</p>
              <p className="text-xs text-muted-foreground">Atualizado em 09/01/2025 às 10h15 · Fonte: CEMADEN / Defesa Civil</p>
            </div>
          </div>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-green-500 inline-block" /> Normal</span>
            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-yellow-400 inline-block" /> Observação</span>
            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-orange-500 inline-block" /> Atenção</span>
            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-500 inline-block" /> Alerta</span>
            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-purple-500 inline-block" /> Emergência</span>
          </div>
        </div>
      </div>

      {/* KPIs clima */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Temperatura atual"
          icon={Activity01Icon}
          value="26,4 °C"
          borderColor="border-l-orange-400"
          footer={<p className="text-xs text-muted-foreground">Máx. 29°C · Mín. 19°C hoje</p>}
        />
        <KpiCard
          title="Chuva acumulada 24h"
          icon={DropletIcon}
          value="52 mm"
          valueClassName="text-orange-600 dark:text-orange-400"
          borderColor="border-l-blue-500"
          footer={
            <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
              <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} className="size-3" />
              Acima da média mensal
            </div>
          }
        />
        <KpiCard
          title="Chuva prevista 48h"
          icon={DropletIcon}
          value="38 mm"
          borderColor="border-l-blue-300"
          footer={<p className="text-xs text-muted-foreground">Risco de enxurrada até amanhã</p>}
        />
        <KpiCard
          title="Vento (rajadas)"
          icon={AlertCircleIcon}
          value="42 km/h"
          borderColor="border-l-slate-400"
          footer={<p className="text-xs text-muted-foreground">Direção nordeste · Moderado</p>}
        />
      </div>

      {/* KPIs risco */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Nível do Rio Municipal"
          icon={DropletIcon}
          value="68%"
          valueClassName="text-orange-600 dark:text-orange-400"
          borderColor="border-l-cyan-500"
          footer={
            <>
              <Progress value={68} className="h-2" />
              <p className="text-xs text-muted-foreground">Cota de atenção: 80% · Alerta: 100%</p>
            </>
          }
        />
        <KpiCard
          title="Comunidades em alerta"
          icon={Flag01Icon}
          value="4"
          valueClassName="text-red-600 dark:text-red-400"
          borderColor="border-l-red-500"
          footer={<p className="text-xs text-muted-foreground">2 em Alerta · 2 em Atenção</p>}
        />
        <KpiCard
          title="Casas a vistoriar"
          icon={Home01Icon}
          value="312"
          borderColor="border-l-yellow-500"
          footer={<p className="text-xs text-muted-foreground">189 já vistoriadas nesta temporada</p>}
        />
        <KpiCard
          title="Famílias em área de risco"
          icon={UserMultipleIcon}
          value="1.847"
          borderColor="border-l-primary/40"
          footer={<p className="text-xs text-muted-foreground">Zonas A, B, C e D cadastradas</p>}
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chuva acumulada 7 dias */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Chuva acumulada — últimos 7 dias (mm)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigChuva} className="h-48 w-full">
              <BarChart data={chuvaHistorico}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="mm" fill="var(--chart-1)" radius={[4, 4, 0, 0]}>
                  {chuvaHistorico.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.mm >= 40 ? "var(--chart-5)" : entry.mm >= 25 ? "hsl(25 95% 55%)" : "var(--chart-1)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Nível do rio 24h */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Nível do Rio Municipal — últimas 24h (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigRio} className="h-48 w-full">
              <AreaChart data={nivelRioHistorico}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hora" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 120]} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ReferenceLine y={80}  stroke="hsl(25 95% 55%)" strokeDasharray="4 4" label={{ value: "Atenção 80%",  position: "insideTopRight", fontSize: 10, fill: "hsl(25 95% 55%)" }} />
                <ReferenceLine y={100} stroke="hsl(0 72% 51%)"  strokeDasharray="4 4" label={{ value: "Alerta 100%", position: "insideTopRight", fontSize: 10, fill: "hsl(0 72% 51%)"  }} />
                <Area dataKey="nivel" fill="var(--chart-2)" stroke="var(--chart-2)" fillOpacity={0.2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Previsão 5 dias */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Previsão climática — próximos 5 dias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {previsao5dias.map((d) => (
              <div key={d.dia} className="flex flex-col items-center gap-1 rounded-lg border bg-muted/40 p-3 text-center">
                <p className="text-sm font-medium">{d.dia}</p>
                <span className="text-2xl">{d.icon}</span>
                <p className="text-xs text-muted-foreground">{d.tMin}° – {d.tMax}°</p>
                <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                  <HugeiconsIcon icon={DropletIcon} strokeWidth={2} className="size-3" />
                  {d.chuva} mm
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comunidades por nível */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Comunidades monitoradas por nível de risco</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comunidade</TableHead>
                <TableHead>Tipo de risco</TableHead>
                <TableHead>Famílias</TableHead>
                <TableHead>Nível</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comunidadesRisco.map((c) => (
                <TableRow key={c.nome}>
                  <TableCell className="font-medium">{c.nome}</TableCell>
                  <TableCell>{c.tipo}</TableCell>
                  <TableCell>{c.familias.toLocaleString("pt-BR")}</TableCell>
                  <TableCell><NivelBadge nivel={c.nivel} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Painel Ocorrências ───────────────────────────────────────────────────────

function PainelOcorrencias() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Ocorrências ativas" icon={Alert02Icon} value="6" valueClassName="text-red-600 dark:text-red-400" borderColor="border-l-red-500"
          footer={<p className="text-xs text-muted-foreground">1 aguardando recurso</p>} />
        <KpiCard title="Pessoas afetadas" icon={UserMultipleIcon} value="423" borderColor="border-l-orange-500"
          footer={<p className="text-xs text-muted-foreground">Total no período ativo</p>} />
        <KpiCard title="Desabrigados" icon={Home01Icon} value="118" valueClassName="text-orange-600 dark:text-orange-400" borderColor="border-l-yellow-500"
          footer={<p className="text-xs text-muted-foreground">Nos abrigos municipais</p>} />
        <KpiCard title="Imóveis danificados" icon={AlertCircleIcon} value="89" borderColor="border-l-primary/40"
          footer={<p className="text-xs text-muted-foreground">12 com dano total</p>} />
      </div>

      {/* Ocorrências ativas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Ocorrências ativas e recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Protocolo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Localidade</TableHead>
                <TableHead>Abertura</TableHead>
                <TableHead>Afetados</TableHead>
                <TableHead>Equipe</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ocorrencias.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{o.tipo}</Badge>
                  </TableCell>
                  <TableCell>{o.bairro}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{o.abertura}</TableCell>
                  <TableCell>{o.afetados}</TableCell>
                  <TableCell className="text-xs">{o.equipe}</TableCell>
                  <TableCell><StatusBadge status={o.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Histórico mensal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Ocorrências por tipo — últimos 7 meses</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigOcorrencias} className="h-56 w-full">
            <BarChart data={ocorrenciasMensais}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="enchente"     fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="ventania"     fill="var(--chart-2)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="deslizamento" fill="var(--chart-3)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Análise */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Alert>
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4" />
          <AlertTitle>Pico em dezembro</AlertTitle>
          <AlertDescription className="text-xs">Dezembro concentrou 29 ocorrências — maior volume dos últimos 7 meses. Reforço de equipes necessário para a temporada de chuvas.</AlertDescription>
        </Alert>
        <Alert>
          <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-4" />
          <AlertTitle>Enchentes dominam</AlertTitle>
          <AlertDescription className="text-xs">Enchentes representaram 49% de todas as ocorrências. Vila Ribeirinha é a comunidade mais recorrente nos registros.</AlertDescription>
        </Alert>
        <Alert>
          <HugeiconsIcon icon={SecurityCheckIcon} strokeWidth={2} className="size-4" />
          <AlertTitle>Tempo médio de resposta</AlertTitle>
          <AlertDescription className="text-xs">Média de 22 minutos entre abertura e início do atendimento. Meta da Defesa Civil: ≤ 15 minutos em nível de Alerta.</AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

// ─── Painel Recursos ──────────────────────────────────────────────────────────

function PainelRecursos() {
  return (
    <div className="space-y-6">
      {/* KPIs abrigos */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard title="Capacidade total de abrigos" icon={Home01Icon} value="650 pessoas" borderColor="border-l-blue-500"
          footer={<p className="text-xs text-muted-foreground">3 abrigos cadastrados</p>} />
        <KpiCard title="Ocupação atual" icon={UserMultipleIcon} value="118 pessoas" borderColor="border-l-green-500"
          footer={
            <>
              <Progress value={18} className="h-2" />
              <p className="text-xs text-muted-foreground">18% da capacidade total utilizada</p>
            </>
          }
        />
        <KpiCard title="Abrigos disponíveis" icon={SecurityCheckIcon} value="2 em standby" borderColor="border-l-yellow-500"
          footer={<p className="text-xs text-muted-foreground">Podem ser ativados em até 2h</p>} />
      </div>

      {/* Cards de abrigos */}
      <div className="grid gap-4 sm:grid-cols-3">
        {abrigos.map((a) => {
          const pct = Math.round((a.ocupacao / a.capacidade) * 100);
          return (
            <Card key={a.nome}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm leading-tight">{a.nome}</CardTitle>
                  <StatusBadge status={a.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Ocupação: {a.ocupacao} / {a.capacidade}</span>
                    <span>{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
                <Separator />
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p><span className="font-medium text-foreground">Responsável:</span> {a.responsavel}</p>
                  <p><span className="font-medium text-foreground">Contato:</span> {a.tel}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Suprimentos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Estoque de suprimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suprimentos.map((s) => (
              <div key={s.categoria} className={`rounded-lg border p-3 ${s.critico ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/20" : ""}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${s.critico ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400" : "bg-muted text-muted-foreground"}`}>
                      <HugeiconsIcon icon={s.icon} strokeWidth={2} className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-none">{s.categoria}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{s.disponivel} · {s.consumoDia !== "—" ? `Consumo: ${s.consumoDia}` : "Uso esporádico"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {s.autonomia > 0 && (
                      <span className={`text-xs font-medium ${s.autonomia <= 3 ? "text-red-600 dark:text-red-400" : s.autonomia <= 7 ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400"}`}>
                        {s.autonomia}d autonomia
                      </span>
                    )}
                    {s.critico && (
                      <span className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
                        <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-3" /> Crítico
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <Progress
                    value={s.pct}
                    className={`h-1.5 ${s.pct < 20 ? "[&>div]:bg-red-500" : s.pct < 40 ? "[&>div]:bg-orange-500" : ""}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4 text-red-500" />
        <AlertTitle>Estoque crítico — Lonas e kits de abrigo</AlertTitle>
        <AlertDescription className="text-xs">Apenas 18% do estoque recomendado. Com nível de atenção ativo, solicite reposição imediata junto à Defesa Civil Estadual ou ao Governo Federal (SEDEC/MI).</AlertDescription>
      </Alert>
    </div>
  );
}

// ─── Painel Logística ─────────────────────────────────────────────────────────

function PainelLogistica() {
  return (
    <div className="space-y-6">
      {/* KPIs mobilização */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Equipes mobilizadas" icon={UserMultipleIcon} value="5 de 6" valueClassName="text-green-600 dark:text-green-400" borderColor="border-l-green-500"
          footer={<p className="text-xs text-muted-foreground">1 em standby</p>} />
        <KpiCard title="Agentes em campo" icon={SecurityCheckIcon} value="27" borderColor="border-l-blue-500"
          footer={<p className="text-xs text-muted-foreground">Em 5 zonas de atuação</p>} />
        <KpiCard title="Veículos em uso" icon={DeliveryTruck01Icon} value="14 de 25" borderColor="border-l-primary/40"
          footer={<p className="text-xs text-muted-foreground">Incluindo barcos e viaturas</p>} />
        <KpiCard title="Zonas com rota bloqueada" icon={AlertCircleIcon} value="1" valueClassName="text-red-600 dark:text-red-400" borderColor="border-l-red-500"
          footer={<p className="text-xs text-muted-foreground">Zona D — Conjunto Esperança</p>} />
      </div>

      {/* Zonas de evacuação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Plano de evacuação por zona</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {zonasEvacuacao.map((z) => (
              <div key={z.zona} className="rounded-lg border bg-muted/30 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                      {z.zona}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{z.descricao}</p>
                        <Badge variant="outline" className="text-xs">{z.risco}</Badge>
                        <span className={`text-xs font-medium ${z.prioridade === "Alta" ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"}`}>
                          Prioridade {z.prioridade}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-start gap-1">
                        <HugeiconsIcon icon={DeliveryTruck01Icon} strokeWidth={2} className="size-3 shrink-0 mt-0.5" />
                        {z.rota}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Destino:</span> {z.destino} · <span className="font-medium text-foreground">Pop.:</span> {z.pop.toLocaleString("pt-BR")} pessoas
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={z.status} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Equipes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Equipes e localização atual</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipe</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Membros</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipes.map((e) => (
                <TableRow key={e.nome}>
                  <TableCell className="font-medium text-sm">{e.nome}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{e.funcao}</TableCell>
                  <TableCell>{e.membros}</TableCell>
                  <TableCell className="text-xs">{e.local}</TableCell>
                  <TableCell><StatusBadge status={e.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Veículos e equipamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Veículos e equipamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {veiculos.map((v) => {
              const disponiveis = v.total - v.emUso;
              const pct = Math.round((v.emUso / v.total) * 100);
              return (
                <div key={v.tipo} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={v.icon} strokeWidth={2} className="size-4 text-muted-foreground" />
                    <p className="text-sm font-medium leading-tight">{v.tipo}</p>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-600 dark:text-green-400 font-medium">{disponiveis} disponíveis</span>
                    <span className="text-muted-foreground">{v.emUso}/{v.total} em uso</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alertas logísticos */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Alert>
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4 text-red-500" />
          <AlertTitle>Rota da Zona D bloqueada</AlertTitle>
          <AlertDescription className="text-xs">
            A rota de evacuação do Conjunto Esperança está bloqueada por alagamento na Via Expressa. Acionar rota alternativa pela Av. do Contorno até liberação.
          </AlertDescription>
        </Alert>
        <Alert>
          <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-4" />
          <AlertTitle>Todos os barcos em operação</AlertTitle>
          <AlertDescription className="text-xs">
            Os 4 barcos de resgate estão em campo. Para novas demandas de resgate aquático, acionar reforço da Defesa Civil Estadual ou Bombeiros.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

// ─── Dados demo — Análises ────────────────────────────────────────────────────

const alertasAnalise = [
  {
    tipo: "warning" as const,
    titulo: "Rota de evacuação da Zona D bloqueada",
    categoria: "Logística",
    descricao:
      "A via expressa que serve o Conjunto Esperança está intransitável por alagamento. A rota alternativa pela Av. do Contorno deve ser ativada e comunicada à população. Monitoramento contínuo é necessário até a liberação.",
  },
  {
    tipo: "warning" as const,
    titulo: "Estoque de lonas e kits de abrigo em nível crítico (18%)",
    categoria: "Recursos",
    descricao:
      "Com apenas 35 kits disponíveis e nível de atenção ativo, o estoque está abaixo do mínimo operacional recomendado (50 kits). Acionar imediatamente o pedido de reposição junto à SEDEC/MI ou Defesa Civil Estadual.",
  },
  {
    tipo: "warning" as const,
    titulo: "Todos os barcos de resgate em operação — sem reserva",
    categoria: "Logística",
    descricao:
      "Os 4 barcos de resgate estão em campo. Qualquer nova demanda de resgate aquático exige acionamento do reforço estadual. Verificar disponibilidade junto ao Corpo de Bombeiros e à Defesa Civil Estadual preventivamente.",
  },
  {
    tipo: "info" as const,
    titulo: "Nível do Rio Municipal em 68% da cota de alerta",
    categoria: "Monitoramento",
    descricao:
      "O rio está em trajetória de alta nas últimas 12h. Com 38 mm de chuva previstos para as próximas 48h, existe risco de superar 80% (cota de atenção). Intensificar monitoramento e pré-posicionar equipes na margem.",
  },
  {
    tipo: "info" as const,
    titulo: "Previsão de 83 mm de chuva nos próximos 2 dias",
    categoria: "Monitoramento",
    descricao:
      "A previsão do INMET/CPTEC aponta precipitação acumulada de 83 mm entre domingo e segunda-feira, período de maior risco. Recomenda-se emitir alerta preventivo para as comunidades da Zona A e D.",
  },
  {
    tipo: "success" as const,
    titulo: "Ginásio Municipal com capacidade suficiente para a demanda atual",
    categoria: "Recursos",
    descricao:
      "O principal abrigo ativo opera com 39% da capacidade (118 de 300 vagas). Há espaço para absorver até 182 novas famílias sem acionar os abrigos em standby, garantindo conforto e condições de atendimento adequadas.",
  },
];

// ─── Painel Análises ──────────────────────────────────────────────────────────

function PainelAnalises() {
  return (
    <div className="space-y-6">
      {/* Separador */}
      <div className="relative py-4">
        <Separator />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted px-4 dark:bg-background">
          <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Análises
          </span>
        </div>
      </div>

      {/* ── 1. Resumo Analítico ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Analítico</CardTitle>
          <CardDescription>
            Indicadores consolidados da operação de Defesa Civil — período ativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Nível de alerta</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">Atenção</span>
              </div>
              <p className="text-xs text-muted-foreground">Nível 3 de 5</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Ocorrências ativas</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">6</span>
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                  1 sem equipe
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">7 abertas nas últimas 48h</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Pessoas afetadas</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">423</span>
                <Badge variant="secondary" className="text-xs">
                  <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} className="size-3" />
                  +70 hoje
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">118 em abrigo municipal</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Comunidades em alerta</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">4</span>
              </div>
              <p className="text-xs text-muted-foreground">2 em Alerta · 2 em Atenção</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Ocupação dos abrigos</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">18%</span>
                <Badge variant="secondary" className="text-xs text-green-600">
                  Adequado
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">118 / 650 vagas utilizadas</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Estoques críticos</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">1</span>
                <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                  Lonas
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Reposição urgente necessária</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-muted/40 p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Nível do Rio</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">68%</p>
              <Progress value={68} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-1">Cota de atenção: 80%</p>
            </div>
            <div className="rounded-lg border bg-muted/40 p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Chuva acumulada 24h</p>
              <p className="text-3xl font-bold">52 <span className="text-base font-normal">mm</span></p>
              <p className="text-xs text-muted-foreground mt-1">+38 mm previstos (48h)</p>
            </div>
            <div className="rounded-lg border bg-muted/40 p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Equipes mobilizadas</p>
              <p className="text-3xl font-bold">5 <span className="text-base font-normal text-muted-foreground">/ 6</span></p>
              <p className="text-xs text-muted-foreground mt-1">27 agentes em campo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 2. Alertas e Notificações ───────────────────────────────────────── */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Alertas e Notificações</h3>
        {alertasAnalise.map((alerta, index) => (
          <Alert
            key={index}
            variant={alerta.tipo === "warning" ? "destructive" : "default"}
          >
            <HugeiconsIcon
              icon={
                alerta.tipo === "warning"
                  ? Alert02Icon
                  : alerta.tipo === "success"
                    ? CheckmarkCircle02Icon
                    : InformationCircleIcon
              }
              strokeWidth={2}
              className="size-4"
            />
            <AlertTitle className="flex items-center gap-2">
              {alerta.titulo}
              <Badge variant="outline" className="text-xs">
                {alerta.categoria}
              </Badge>
            </AlertTitle>
            <AlertDescription>{alerta.descricao}</AlertDescription>
          </Alert>
        ))}
      </div>

      {/* ── 3. Análise Inteligente ──────────────────────────────────────────── */}
      <Card className="border-l-4 border-l-primary bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <HugeiconsIcon icon={BulbIcon} strokeWidth={2} className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle>Análise Inteligente da Defesa Civil</CardTitle>
              <CardDescription>
                Insights gerados com base nos indicadores de monitoramento, ocorrências e recursos
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visão geral */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="leading-relaxed text-foreground">
              O município opera em <strong>nível de Atenção</strong> com{" "}
              <strong>6 ocorrências ativas</strong> e <strong>423 pessoas afetadas</strong>,
              sendo 118 desabrigadas no Ginásio Municipal. O rio está a{" "}
              <strong>68% da cota de alerta</strong> e a previsão de{" "}
              <strong>83 mm nas próximas 48h</strong> eleva o risco de progressão para nível
              de Alerta nas zonas ribeirinhas. O principal gargalo operacional é a{" "}
              <strong>rota bloqueada da Zona D</strong> e o{" "}
              <strong>estoque crítico de lonas (18%)</strong>, que exigem ação imediata.
              A capacidade de abrigo está adequada à demanda atual (18% de ocupação),
              garantindo margem para absorção de novas famílias sem abertura de novos pontos.
            </p>
          </div>

          <Separator />

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="destaques">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Flag01Icon} strokeWidth={2} className="size-4 text-green-600" />
                  <span>Pontos de Destaque Positivo</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-6">
                  <div className="flex gap-2">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4 mt-0.5 shrink-0 text-green-600" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Capacidade de abrigo adequada:</strong>{" "}
                      Com 18% de ocupação (118/650 vagas), o sistema de abrigos comporta
                      mais 532 pessoas sem acionar os pontos em standby. Isso garante
                      margem operacional segura mesmo com eventual agravamento do evento.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4 mt-0.5 shrink-0 text-green-600" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">5 de 6 equipes mobilizadas:</strong>{" "}
                      A taxa de mobilização de 83% das equipes — com 27 agentes em campo —
                      demonstra capacidade de resposta efetiva. A equipe de Busca e
                      Resgate B permanece em standby como reserva estratégica.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4 mt-0.5 shrink-0 text-green-600" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Autonomia de suprimentos alimentares:</strong>{" "}
                      Com 340 cestas básicas disponíveis e consumo de 25/dia, há
                      13 dias de autonomia alimentar — acima do padrão mínimo de 7 dias
                      recomendado pela Defesa Civil para eventos de duração intermediária.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="atencao">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4 text-amber-600" />
                  <span>Pontos de Atenção</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-6">
                  <div className="flex gap-2">
                    <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4 mt-0.5 shrink-0 text-amber-600" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Rota D bloqueada e sem alternativa pré-sinalizada:</strong>{" "}
                      O bloqueio da Via Expressa afeta 204 moradores do Conjunto Esperança.
                      A rota pela Av. do Contorno não estava no plano original de evacuação
                      e pode gerar confusão. Recomenda-se sinalização imediata e comunicação
                      ativa com líderes comunitários da região.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4 mt-0.5 shrink-0 text-amber-600" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Sem reserva de embarcações:</strong>{" "}
                      Com todos os 4 barcos de resgate em campo, qualquer novo chamado
                      de resgate aquático ficará sem atendimento imediato. O tempo
                      médio de acionamento de reforço estadual é de 45 a 90 minutos —
                      crítico em casos de afogamento ou isolamento.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4 mt-0.5 shrink-0 text-amber-600" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Medicamentos com apenas 6 dias de autonomia:</strong>{" "}
                      O estoque de 48 kits médicos com consumo de 8/dia resulta em
                      6 dias de autonomia. Com a previsão de chuvas intensas, o número
                      de atendimentos pode crescer — solicitar reposição junto à Secretaria
                      de Saúde nas próximas 24h.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="recomendacoes">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={BulbIcon} strokeWidth={2} className="size-4 text-blue-600" />
                  <span>Recomendações Estratégicas</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-6">
                  {[
                    {
                      titulo: "1. Acionar reposição de lonas e kits de abrigo",
                      texto: "Com 18% de estoque e nível de atenção ativo, solicitar imediatamente ao SEDEC/MI ou à Coordenadoria Estadual de Defesa Civil reposição de pelo menos 80 kits de abrigo emergencial para garantir cobertura de 3 dias de eventual agravamento.",
                    },
                    {
                      titulo: "2. Sinalizar e comunicar rota alternativa da Zona D",
                      texto: "Mobilizar equipe de operações urbanas para instalar sinalização na Av. do Contorno como rota de evacuação da Zona D. Ativar sistema de alertas via SMS/WhatsApp para os moradores do Conjunto Esperança com instruções claras.",
                    },
                    {
                      titulo: "3. Pré-acionar reforço de embarcações junto ao Estado",
                      texto: "Solicitar preventivamente ao Corpo de Bombeiros Estadual e à Defesa Civil Regional disponibilidade de barcos de resgate adicionais para as próximas 48h, período de pico de precipitação previsto pelo INMET.",
                    },
                    {
                      titulo: "4. Emitir alerta preventivo para comunidades das zonas A e D",
                      texto: "Com nível do rio em 68% e previsão de 83 mm nas próximas 48h, emitir comunicado de alerta preventivo para Vila Ribeirinha e Conjunto Esperança — orientando as famílias a monitorarem o nível da água e manterem documentos prontos para evacuação rápida.",
                    },
                  ].map((r) => (
                    <div key={r.titulo} className="rounded-lg border bg-blue-50/50 p-3 dark:bg-blue-950/20">
                      <p className="mb-1 text-sm font-medium text-foreground">{r.titulo}</p>
                      <p className="text-xs text-muted-foreground">{r.texto}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="projecoes">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={ChartLineData02Icon} strokeWidth={2} className="size-4 text-purple-600" />
                  <span>Projeções e Cenários (próximas 48h)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pl-6">
                  <p className="text-sm text-muted-foreground">
                    Com base nos dados de chuva prevista (83 mm) e tendência do nível do rio:
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-2xl font-bold text-green-600">Atenção</p>
                      <p className="text-xs text-muted-foreground mt-1">Cenário Otimista</p>
                      <p className="text-xs text-muted-foreground">Chuva abaixo da previsão · Rio estabiliza em 75%</p>
                    </div>
                    <div className="rounded-lg border bg-primary/5 p-3 text-center">
                      <p className="text-2xl font-bold text-primary">Alerta</p>
                      <p className="text-xs text-muted-foreground mt-1">Cenário Provável</p>
                      <p className="text-xs text-muted-foreground">Rio ultrapassa 80% · Zona A em evacuação parcial</p>
                    </div>
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-2xl font-bold text-purple-600">Emergência</p>
                      <p className="text-xs text-muted-foreground mt-1">Cenário Crítico</p>
                      <p className="text-xs text-muted-foreground">Rio supera cota de alerta · Evacuação total das Zonas A e D</p>
                    </div>
                  </div>
                  <p className="text-xs italic text-muted-foreground">
                    * Projeções com base na previsão do INMET/CPTEC e histórico hidrológico do Rio Municipal.
                    Atualizar a cada 6h ou após evento de chuva significativo.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />

          {/* Conclusão */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex gap-3">
              <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="mt-0.5 size-5 shrink-0 text-primary" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Conclusão da Análise</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  A operação de Defesa Civil está em curso com boa capacidade de resposta
                  humana (83% das equipes mobilizadas) e abrigos com folga adequada.
                  Os riscos críticos das próximas 48h são: progressão do nível do rio para
                  a cota de alerta (cenário provável com 83 mm previstos), esgotamento de
                  lonas e kits de abrigo em caso de agravamento, e ausência de reserva de
                  embarcações. A ação imediata nos três pontos — reposição de lonas,
                  sinalização da rota alternativa e pré-acionamento de reforço de barcos —
                  é determinante para manter a operação em nível controlado.
                </p>
                <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">
                  Análise gerada em{" "}
                  {new Date().toLocaleDateString("pt-BR")} às{" "}
                  {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}{" "}
                  | Defesa Civil — Operação Ativa Jan/2025
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function DefesaCivil() {
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Defesa Civil</h2>
        <p className="text-sm text-muted-foreground">
          Monitoramento climático, ocorrências, recursos e logística de emergência municipal
        </p>
      </div>

      <Tabs defaultValue="monitoramento" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="monitoramento" className="gap-2">
            <HugeiconsIcon icon={Activity01Icon} strokeWidth={2} className="size-4" />
            Monitoramento
          </TabsTrigger>
          <TabsTrigger value="ocorrencias" className="gap-2">
            <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4" />
            Ocorrências
          </TabsTrigger>
          <TabsTrigger value="recursos" className="gap-2">
            <HugeiconsIcon icon={HandHelpingIcon} strokeWidth={2} className="size-4" />
            Recursos
          </TabsTrigger>
          <TabsTrigger value="logistica" className="gap-2">
            <HugeiconsIcon icon={DeliveryTruck01Icon} strokeWidth={2} className="size-4" />
            Logística
          </TabsTrigger>
          <TabsTrigger value="analises" className="gap-2">
            <HugeiconsIcon icon={ChartLineData02Icon} strokeWidth={2} className="size-4" />
            Análises
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitoramento"><PainelMonitoramento /></TabsContent>
        <TabsContent value="ocorrencias"><PainelOcorrencias /></TabsContent>
        <TabsContent value="recursos"><PainelRecursos /></TabsContent>
        <TabsContent value="logistica"><PainelLogistica /></TabsContent>
        <TabsContent value="analises"><PainelAnalises /></TabsContent>
      </Tabs>
    </div>
  );
}
