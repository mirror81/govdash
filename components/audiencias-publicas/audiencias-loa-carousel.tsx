"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Wallet01Icon,
  MoneyAdd01Icon,
  BankIcon,
  Building04Icon,
  BookOpen02Icon,
  Stethoscope02Icon,
  UserMultipleIcon,
  ConstructionIcon,
  Analytics01Icon,
  CheckmarkCircle02Icon,
  Invoice01Icon,
  Home01Icon,
  SecurityCheckIcon,
  Target01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import * as d from "@/lib/demo-audiencias-loa";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AUTOPLAY_MS = 20_000;

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function brlM(v: number): string {
  if (v >= 1_000_000)
    return `R$ ${(v / 1_000_000).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
  if (v >= 1_000)
    return `R$ ${(v / 1_000).toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}K`;
  return brl.format(v);
}

function pctFmt(valor: number, total: number, digits = 1): string {
  return `${d.pct(valor, total).toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

function variacaoFmt(atual: number, anterior: number): string {
  const variacao = d.variacaoPct(atual, anterior);
  return `${variacao >= 0 ? "+" : ""}${variacao.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}

function fmtEvolucaoReal(atual: number, anterior: number): string {
  const delta = atual - anterior;
  const s = delta >= 0 ? "+" : "";
  return `${s}${brl.format(delta)}`;
}

function VariacaoBadge({
  atual,
  anterior,
}: {
  atual: number;
  anterior: number;
}) {
  const variacao = d.variacaoPct(atual, anterior);
  return (
    <Badge
      variant={variacao >= 0 ? "default" : "outline"}
      className={cn(
        "whitespace-nowrap text-xs",
        variacao < 0 && "border-red-300 text-red-700 dark:text-red-300",
      )}
    >
      {variacaoFmt(atual, anterior)}
    </Badge>
  );
}

function OrcamentoComparativoTable({
  rows,
  className,
}: {
  rows: { nome: string; orcado2024: number; orcado2025: number }[];
  className?: string;
}) {
  const tot24 = rows.reduce((acc, r) => acc + r.orcado2024, 0);
  const tot25 = rows.reduce((acc, r) => acc + r.orcado2025, 0);
  return (
    <div
      className={cn("max-h-full overflow-auto rounded-md border", className)}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Orçado 2024</TableHead>
            <TableHead className="text-right">Orçado 2025</TableHead>
            <TableHead className="text-right">Var. %</TableHead>
            <TableHead className="text-right">Evolução (R$)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.nome}>
              <TableCell className="font-medium">{r.nome}</TableCell>
              <TableCell className="text-right tabular-nums">
                {brl.format(r.orcado2024)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {brl.format(r.orcado2025)}
              </TableCell>
              <TableCell className="text-right">
                <VariacaoBadge atual={r.orcado2025} anterior={r.orcado2024} />
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {fmtEvolucaoReal(r.orcado2025, r.orcado2024)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Totais</TableCell>
            <TableCell className="text-right tabular-nums">
              {brl.format(tot24)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {brl.format(tot25)}
            </TableCell>
            <TableCell className="text-right">
              <VariacaoBadge atual={tot25} anterior={tot24} />
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {fmtEvolucaoReal(tot25, tot24)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

function KpiBox({
  label,
  value,
  detail,
  tone = "primary",
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: "primary" | "blue" | "green" | "amber" | "purple";
}) {
  const border = {
    primary: "border-l-[color:var(--chart-1)]",
    blue: "border-l-[color:var(--chart-2)]",
    green: "border-l-[color:var(--chart-3)]",
    amber: "border-l-[color:var(--chart-4)]",
    purple: "border-l-[color:var(--chart-5)]",
  }[tone];

  return (
    <Card className={cn("min-w-0 border-l-4", border)}>
      <CardHeader className="px-4 pb-2 pt-3">
        <CardDescription className="truncate text-xs">{label}</CardDescription>
        <CardTitle className="break-words text-2xl leading-tight tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
      {detail ? (
        <CardContent className="px-4 pb-3 pt-0">
          <p className="text-sm text-muted-foreground">{detail}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}

function requestFullscreenEl(el: HTMLElement) {
  const w = el as HTMLElement & { webkitRequestFullscreen?: () => void };
  if (el.requestFullscreen) return el.requestFullscreen();
  if (w.webkitRequestFullscreen) {
    w.webkitRequestFullscreen();
    return Promise.resolve();
  }
  return Promise.reject(new Error("fullscreen unavailable"));
}

function exitFullscreenDoc() {
  const doc = document as Document & { webkitExitFullscreen?: () => void };
  if (document.fullscreenElement && document.exitFullscreen)
    return document.exitFullscreen();
  if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
  return Promise.resolve();
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

// ── Slide section header ───────────────────────────────────────────────────────
function SlideHeader({
  titulo,
  subtitulo,
}: {
  titulo: string;
  subtitulo?: string;
}) {
  return (
    <div className="flex-none space-y-0.5 border-b border-border/50 pb-3">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {titulo}
      </h2>
      {subtitulo && (
        <p className="text-base text-muted-foreground">{subtitulo}</p>
      )}
    </div>
  );
}

// ── GaugeConstitucional ────────────────────────────────────────────────────────
function GaugeConstitucional({
  titulo,
  valor,
  base,
  limitePct,
  lei,
  descricao,
}: {
  titulo: string;
  valor: number;
  base: number;
  limitePct: number;
  lei: string;
  descricao: string;
}) {
  const pct = (valor / base) * 100;
  const acima = pct >= limitePct;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{titulo}</h3>
        <Badge
          className={
            acima
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-red-600 text-white hover:bg-red-700"
          }
        >
          {acima ? "Acima do mínimo ✓" : "Abaixo do mínimo ✗"}
        </Badge>
      </div>

      <div className="py-2 text-center">
        <span
          className={cn(
            "text-7xl font-bold tabular-nums",
            acima
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400",
          )}
        >
          {pct.toFixed(1)}%
        </span>
        <p className="mt-1 text-lg text-muted-foreground">
          aplicado sobre a base de cálculo
        </p>
      </div>

      <div className="space-y-2">
        <div className="relative h-12 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              acima ? "bg-green-500" : "bg-red-500",
            )}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
          <div
            className="absolute top-0 h-full w-1 bg-foreground/50"
            style={{ left: `${limitePct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>0%</span>
          <span className="font-medium">
            Mínimo constitucional: {limitePct}% — {lei}
          </span>
          <span>100%</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Base de cálculo
            </p>
            <p className="mt-1 text-lg font-semibold">{brlM(base)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Mínimo obrigatório
            </p>
            <p className="mt-1 text-lg font-semibold text-amber-600 dark:text-amber-400">
              {brlM((base * limitePct) / 100)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Previsto na LOA
            </p>
            <p
              className={cn(
                "mt-1 text-lg font-semibold",
                acima
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400",
              )}
            >
              {brlM(valor)}
            </p>
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-sm text-muted-foreground">{descricao}</p>
    </div>
  );
}

// ── GaugeSimples (used in Slide 12 — two bars) ────────────────────────────────
function GaugeSimples({
  titulo,
  valor,
  base,
  limitePct,
  lei,
}: {
  titulo: string;
  valor: number;
  base: number;
  limitePct: number;
  lei: string;
}) {
  const pct = (valor / base) * 100;
  const dentro = pct <= limitePct;
  const scaleMax = limitePct * 1.25;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{titulo}</p>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "text-3xl font-bold tabular-nums",
              dentro
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400",
            )}
          >
            {pct.toFixed(2)}%
          </span>
          <Badge
            className={
              dentro
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }
          >
            {dentro ? "Dentro do limite ✓" : "Acima do limite ✗"}
          </Badge>
        </div>
      </div>
      <div className="relative h-8 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full",
            dentro ? "bg-green-500" : "bg-red-500",
          )}
          style={{ width: `${Math.min((pct / scaleMax) * 100, 100)}%` }}
        />
        <div
          className="absolute top-0 h-full w-1 bg-foreground/60"
          style={{ left: `${(limitePct / scaleMax) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{brlM(valor)} aplicado</span>
        <span>
          Limite: {limitePct}% — {lei}
        </span>
        <span>RCL: {brlM(base)}</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDES
// ══════════════════════════════════════════════════════════════════════════════

function Slide01Capa() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <HugeiconsIcon
          icon={Wallet01Icon}
          strokeWidth={1.5}
          className="size-10"
        />
      </div>
      <div>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Lei Orçamentária Anual
        </h1>
        <p className="mt-4 text-3xl font-medium text-muted-foreground">
          Exercício 2025
        </p>
        <p className="mt-2 text-xl text-muted-foreground">
          Prefeitura Municipal — Audiência Pública de Aprovação
        </p>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Badge variant="outline" className="px-5 py-2 text-base">
          Receita: {brlM(d.receitaTotalLOA)}
        </Badge>
        <Badge variant="outline" className="px-5 py-2 text-base">
          Despesa: {brlM(d.despesaTotalLOA)}
        </Badge>
        <Badge variant="outline" className="px-5 py-2 text-base">
          Margem técnica: {brlM(d.receitaTotalLOA - d.despesaTotalLOA)}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        Apresentação elaborada nos termos da Lei de Responsabilidade Fiscal —
        LC&nbsp;101/2000 · Art.&nbsp;48
      </p>
    </div>
  );
}

function Slide02Agenda() {
  const items = [
    {
      icon: SecurityCheckIcon,
      titulo: "Base Legal e Transparência",
      desc: "LRF, CF/88, Lei 4.320/64 e publicidade da audiência",
    },
    {
      icon: Target01Icon,
      titulo: "Peças Orçamentárias e Ciclo PPA · LDO · LOA",
      desc: "Planejar, orientar e executar — sequência das peças e papéis",
    },
    {
      icon: Analytics01Icon,
      titulo: "Premissas, série da receita e composição",
      desc: "Macrofiscais, evolução anual, natureza e origem da receita",
    },
    {
      icon: Invoice01Icon,
      titulo: "Tributos e transferências",
      desc: "Próprias, federais e estaduais com quadros 2024 x 2025",
    },
    {
      icon: Home01Icon,
      titulo: "Fixação e classificação da despesa",
      desc: "Por órgão, natureza, secretaria e função de governo",
    },
    {
      icon: UserMultipleIcon,
      titulo: "Gastos sociais, SAAE e Previdência",
      desc: "Políticas sociais, autarquia de saneamento e RPPS municipal",
    },
    {
      icon: BookOpen02Icon,
      titulo: "Mínimos constitucionais (MDE, ASPS) e pessoal (LRF)",
      desc: "Educação, saúde e limites de folha em relação à RCL",
    },
    {
      icon: ConstructionIcon,
      titulo: "Investimentos, participação e riscos",
      desc: "Obras prioritárias, voz do cidadão e cenários fiscais",
    },
    {
      icon: SecurityCheckIcon,
      titulo: "Governança e fechamento",
      desc: "Execução monitorada, série receita vs despesa e encerramento",
    },
  ];
  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <h2 className="mb-5 flex-none text-3xl font-bold">
        Agenda desta Apresentação
      </h2>
      <div className="grid flex-1 grid-cols-2 gap-3 content-start">
        {items.map((item, i) => (
          <Card key={i} className="flex items-center gap-3 p-4">
            <div className="flex size-10 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon
                icon={item.icon}
                strokeWidth={2}
                className="size-5"
              />
            </div>
            <div>
              <p className="text-base font-semibold">{item.titulo}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Slide03BaseLegalTransparencia() {
  const marcos = [
    {
      titulo: "Constituição Federal",
      desc: "Arts. 165 a 169: PPA, LDO, LOA, créditos e controle legislativo.",
    },
    {
      titulo: "Lei 4.320/1964",
      desc: "Normas gerais de orçamento, receita, despesa, empenho e balanços.",
    },
    {
      titulo: "LRF · LC 101/2000",
      desc: "Compatibilidade com metas fiscais, limites, transparência e audiência pública.",
    },
    {
      titulo: "STN e Tribunal de Contas",
      desc: "Padronização de classificações, fontes, demonstrativos e prestação de contas.",
    },
  ];

  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Base Legal e Transparência"
        subtitulo="A LOA nasce do planejamento e deve ser discutida em audiência pública"
      />
      <div className="grid flex-1 grid-cols-[1.1fr_0.9fr] gap-5 pt-4">
        <div className="grid grid-cols-2 gap-3 content-start">
          {marcos.map((item) => (
            <Card
              key={item.titulo}
              className="border-l-4 border-l-[color:var(--chart-1)]"
            >
              <CardHeader className="px-4 pb-1 pt-3">
                <CardTitle className="text-lg">{item.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex flex-col justify-center gap-3">
          <KpiBox
            label="Obrigação de transparência"
            value="Art. 48 · LRF"
            detail="Incentivo à participação popular e realização de audiências públicas."
            tone="green"
          />
          <KpiBox
            label="Objeto da LOA"
            value="Prevê receitas e fixa despesas"
            detail="Peça anual que autoriza a execução das prioridades públicas."
            tone="blue"
          />
          <KpiBox
            label="Equilíbrio orçamentário"
            value={brlM(d.receitaTotalLOA)}
            detail={`Receita total prevista para sustentar ${brlM(d.despesaTotalLOA)} em despesas fixadas.`}
            tone="amber"
          />
        </div>
      </div>
    </div>
  );
}

function SlidePeçasOrcamentarias() {
  const ldos = ["2022", "2023", "2024", "2025"];
  const loas = ["2022", "2023", "2024", "2025"];
  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Peças Orçamentárias"
        subtitulo="Encadeamento do planejamento plurianual à execução orçamentária anual"
      />
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-6 pt-2">
        <div className="flex justify-center">
          <div className="relative flex flex-col items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Planejar
            </span>
            <Card className="border-l-4 border-l-[color:var(--chart-1)] px-8 py-4 text-center shadow-sm">
              <CardTitle className="text-2xl">PPA 2022 — 2025</CardTitle>
              <CardDescription className="text-base">
                Diretrizes plurianuais, programas e indicadores de resultado
              </CardDescription>
            </Card>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="h-8 w-px bg-[color:var(--chart-4)]" aria-hidden />
        </div>

        <div className="space-y-2">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Orientar
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ldos.map((ano, i) => (
              <Card
                key={ano}
                className={cn(
                  "border-l-4 py-3 text-center shadow-sm",
                  i % 2 === 0
                    ? "border-l-[color:var(--chart-2)]"
                    : "border-l-[color:var(--chart-3)]",
                )}
              >
                <CardDescription>LDO</CardDescription>
                <CardTitle className="text-lg">{ano}</CardTitle>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="h-8 w-px bg-[color:var(--chart-4)]" aria-hidden />
        </div>

        <div className="space-y-2">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Executar
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {loas.map((ano, i) => (
              <Card
                key={`loa-${ano}`}
                className={cn(
                  "border-l-4 py-3 text-center shadow-sm",
                  i % 2 === 0
                    ? "border-l-[color:var(--chart-4)]"
                    : "border-l-[color:var(--chart-5)]",
                )}
              >
                <CardDescription>LOA</CardDescription>
                <CardTitle className="text-lg">{ano}</CardTitle>
              </Card>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          A LOA do exercício deve ser compatível com o PPA vigente e com as
          metas da LDO do mesmo ano — fundamento dos arts. 165 a 169 da CF/88.
        </p>
      </div>
    </div>
  );
}

function Slide04CicloPlanejamento() {
  const ciclo = [
    {
      sigla: "PPA",
      titulo: "Planejar",
      desc: "Programas e diretrizes para quatro anos, com metas regionalizadas.",
    },
    {
      sigla: "LDO",
      titulo: "Orientar",
      desc: "Metas e prioridades anuais, riscos fiscais e parâmetros para a LOA.",
    },
    {
      sigla: "LOA",
      titulo: "Executar",
      desc: "Estimativa da receita e autorização da despesa para o exercício.",
    },
  ];

  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Ciclo PPA · LDO · LOA"
        subtitulo="A audiência conecta planejamento estratégico, prioridades e orçamento anual"
      />
      <div className="grid flex-1 grid-cols-3 items-stretch gap-4 pt-5">
        {ciclo.map((item, i) => (
          <Card key={item.sigla} className="flex flex-col justify-between">
            <CardHeader>
              <Badge className="w-fit px-3 py-1 text-sm">{item.sigla}</Badge>
              <CardTitle className="text-3xl">{item.titulo}</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                {item.desc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${((i + 1) / ciclo.length) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <KpiBox
          label="Receita prevista"
          value={brlM(d.receitaTotalLOA)}
          detail="Entrada estimada para o exercício"
          tone="green"
        />
        <KpiBox
          label="Despesa fixada"
          value={brlM(d.despesaTotalLOA)}
          detail="Autorização de gasto anual"
          tone="blue"
        />
        <KpiBox
          label="Reserva de contingência"
          value={brlM(d.reservaContingencia)}
          detail={`${pctFmt(d.reservaContingencia, d.despesaTotalLOA)} da despesa`}
          tone="amber"
        />
      </div>
    </div>
  );
}

function Slide04PremissasMacrofiscais() {
  const dependenciaTransferencias =
    d.transferFederais + d.transferEstaduais + d.outrasReceitas;

  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Premissas Macrofiscais da LOA"
        subtitulo="Hipóteses usadas para estimar arrecadação, despesa e capacidade de execução"
      />
      <div className="grid flex-none grid-cols-3 gap-3 pt-4">
        <KpiBox
          label="Dependência de receitas externas"
          value={pctFmt(dependenciaTransferencias, d.receitaTotalLOA)}
          detail="Transferências e outras correntes como base de financiamento municipal"
          tone="purple"
        />
        <KpiBox
          label="Arrecadação própria"
          value={pctFmt(d.receitasProprias, d.receitaTotalLOA)}
          detail="Receita de competência municipal para maior autonomia"
          tone="green"
        />
        <KpiBox
          label="Margem técnica prevista"
          value={brlM(d.receitaTotalLOA - d.despesaTotalLOA)}
          detail="Folga para abertura do exercício e absorção inicial de riscos"
          tone="amber"
        />
      </div>
      <div className="min-h-0 flex-1 pt-4">
        <div className="grid h-full grid-cols-2 gap-4">
          {d.premissasLoa.map((item) => (
            <Card
              key={item.indicador}
              className="border-l-4 border-l-[color:var(--chart-1)]"
            >
              <CardHeader className="px-4 pb-2 pt-3">
                <CardDescription className="text-xs uppercase tracking-wide">
                  Premissa
                </CardDescription>
                <CardTitle className="text-xl">{item.indicador}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-4 pb-4">
                <p className="text-2xl font-bold tabular-nums text-[color:var(--chart-1)]">
                  {item.valor}
                </p>
                <p className="text-sm text-muted-foreground">{item.impacto}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

const cfgLinhaReceita: ChartConfig = {
  receita: { label: "Receita orçada", color: "var(--chart-1)" },
};

function SlideEvolucaoReceitaAnual() {
  const serie = d.historicoOrcamento.map((h) => ({
    ano: h.ano,
    receita: h.receita,
  }));
  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Evolução anual da receita"
        subtitulo="Série orçamentária recente — tendência de arrecadação prevista na LOA"
      />
      <div className="grid flex-none grid-cols-3 gap-3 pt-3">
        {d.historicoOrcamento.map((h, i) => (
          <KpiBox
            key={h.ano}
            label={`Receita orçada ${h.ano}`}
            value={brlM(h.receita)}
            detail={
              i === 0
                ? "Ano-base da série"
                : `Variação vs ${d.historicoOrcamento[i - 1]!.ano}: ${variacaoFmt(h.receita, d.historicoOrcamento[i - 1]!.receita)}`
            }
            tone={i === 0 ? "primary" : i === 1 ? "blue" : "green"}
          />
        ))}
      </div>
      <div className="min-h-0 flex-1 pt-3">
        <ChartContainer config={cfgLinhaReceita} className="h-full w-full">
          <LineChart
            data={serie}
            margin={{ top: 16, right: 40, bottom: 16, left: 16 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="ano" />
            <YAxis tickFormatter={(v) => `R$ ${(v / 1_000_000).toFixed(0)}M`} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(v) => brl.format(v as number)}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="receita"
              stroke="var(--chart-1)"
              strokeWidth={3}
              dot={{ fill: "var(--chart-1)", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
}

function SlidePrevisaoReceitaHierarquia() {
  const correntes = [
    { label: "Receitas próprias", valor: d.receitasProprias, tone: "chart-1" },
    {
      label: "Transferência União",
      valor: d.transferFederais,
      tone: "chart-2",
    },
    {
      label: "Transferência Estado",
      valor: d.transferEstaduais,
      tone: "chart-3",
    },
    { label: "Outras receitas", valor: d.outrasReceitas, tone: "chart-4" },
  ];
  const capital = [
    { label: "Operação de crédito", valor: 0, tone: "chart-2" },
    { label: "Transferência de capital", valor: 0, tone: "chart-3" },
    { label: "Outras receitas", valor: d.receitaCapitalLOA, tone: "chart-5" },
  ];

  const Node = ({
    label,
    valor,
    tone = "chart-1",
    featured = false,
  }: {
    label: string;
    valor: number;
    tone?: string;
    featured?: boolean;
  }) => (
    <Card
      className={cn(
        "min-w-0 border-l-4 text-center",
        featured ? "py-4 shadow-sm" : "py-3",
      )}
      style={{ borderLeftColor: `var(--${tone})` }}
    >
      <CardDescription className="px-3 text-xs uppercase tracking-wide">
        {label}
      </CardDescription>
      <CardTitle
        className={cn("px-3 tabular-nums", featured ? "text-3xl" : "text-lg")}
      >
        {brlM(valor)}
      </CardTitle>
    </Card>
  );

  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Previsão da Receita"
        subtitulo="Desenho hierárquico da receita prevista, conforme estrutura didática da audiência"
      />
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-4 pt-4">
        <div className="mx-auto w-full max-w-xl">
          <Node label="Receitas" valor={d.receitaTotalLOA} featured />
        </div>
        <div className="mx-auto h-8 w-px bg-border" aria-hidden />
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-3">
            <Node
              label="Receita corrente"
              valor={d.receitaCorrenteLOA}
              tone="chart-2"
              featured
            />
            <div className="grid grid-cols-2 gap-3">
              {correntes.map((item) => (
                <Node
                  key={item.label}
                  label={item.label}
                  valor={item.valor}
                  tone={item.tone}
                />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Node
              label="Receita de capital"
              valor={d.receitaCapitalLOA}
              tone="chart-4"
              featured
            />
            <div className="grid grid-cols-1 gap-3">
              {capital.map((item) => (
                <Node
                  key={item.label}
                  label={item.label}
                  valor={item.valor}
                  tone={item.tone}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlidePrevisaoDespesaHierarquia() {
  const correntes = [
    { label: "Pessoal e encargos", valor: d.despPessoal, tone: "chart-1" },
    {
      label: "Juros e encargos da dívida",
      valor: d.despJuros,
      tone: "chart-4",
    },
    {
      label: "Outras despesas correntes",
      valor: d.despCusteio,
      tone: "chart-2",
    },
  ];
  const capital = [
    { label: "Investimentos", valor: d.despInvestimentos, tone: "chart-3" },
    { label: "Inversões financeiras", valor: 0, tone: "chart-5" },
    {
      label: "Amortização da dívida",
      valor: d.despAmortizacao,
      tone: "chart-4",
    },
  ];

  const Node = ({
    label,
    valor,
    tone = "chart-1",
    featured = false,
  }: {
    label: string;
    valor: number;
    tone?: string;
    featured?: boolean;
  }) => (
    <Card
      className={cn(
        "min-w-0 border-l-4 text-center",
        featured ? "py-4 shadow-sm" : "py-3",
      )}
      style={{ borderLeftColor: `var(--${tone})` }}
    >
      <CardDescription className="px-3 text-xs uppercase tracking-wide">
        {label}
      </CardDescription>
      <CardTitle
        className={cn("px-3 tabular-nums", featured ? "text-3xl" : "text-lg")}
      >
        {brlM(valor)}
      </CardTitle>
    </Card>
  );

  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Previsão da Despesa"
        subtitulo="Hierarquia da despesa fixada: correntes, capital e reserva de contingência"
      />
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-4 pt-4">
        <div className="mx-auto w-full max-w-xl">
          <Node label="Despesas" valor={d.despesaTotalLOA} featured />
        </div>
        <div className="mx-auto h-8 w-px bg-border" aria-hidden />
        <div className="grid grid-cols-[1fr_0.72fr_1fr] gap-5">
          <div className="space-y-3">
            <Node
              label="Correntes"
              valor={d.despPessoal + d.despJuros + d.despCusteio}
              tone="chart-2"
              featured
            />
            <div className="grid gap-3">
              {correntes.map((item) => (
                <Node
                  key={item.label}
                  label={item.label}
                  valor={item.valor}
                  tone={item.tone}
                />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Node
              label="Reserva contingência"
              valor={d.reservaContingencia}
              tone="chart-5"
              featured
            />
          </div>
          <div className="space-y-3">
            <Node
              label="Capital"
              valor={d.despCapital}
              tone="chart-3"
              featured
            />
            <div className="grid gap-3">
              {capital.map((item) => (
                <Node
                  key={item.label}
                  label={item.label}
                  valor={item.valor}
                  tone={item.tone}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const cfgNatureza: ChartConfig = {
  corrente: { label: "Receita Corrente", color: "var(--chart-1)" },
  capital: { label: "Receita de Capital", color: "var(--chart-2)" },
};

function Slide05ReceitaNatureza() {
  const pieData = d.receitaNatureza.map((item, i) => ({
    name: item.nome,
    value: item.valor,
    fill: i === 0 ? "var(--chart-1)" : "var(--chart-2)",
  }));
  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Receita Total — Natureza"
        subtitulo="Composição da receita prevista na LOA 2025"
      />
      <div className="flex flex-1 min-h-0 gap-6 pt-4">
        <div className="flex w-64 flex-none flex-col gap-3">
          <Card className="flex-1 border-l-4 border-l-[color:var(--chart-1)]">
            <CardHeader className="pb-1">
              <CardDescription>Receita Total</CardDescription>
              <CardTitle className="text-2xl">
                {brl.format(d.receitaTotalLOA)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="flex-1 border-l-4 border-l-[color:var(--chart-2)]">
            <CardHeader className="pb-1">
              <CardDescription>Receita Corrente</CardDescription>
              <CardTitle className="text-xl">
                {brl.format(d.receitaCorrenteLOA)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                {((d.receitaCorrenteLOA / d.receitaTotalLOA) * 100).toFixed(1)}%
                do total
              </p>
            </CardContent>
          </Card>
          <Card className="flex-1 border-l-4 border-l-[color:var(--chart-3)]">
            <CardHeader className="pb-1">
              <CardDescription>Receita de Capital</CardDescription>
              <CardTitle className="text-xl">
                {brl.format(d.receitaCapitalLOA)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                {((d.receitaCapitalLOA / d.receitaTotalLOA) * 100).toFixed(2)}%
                do total
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="min-h-0 flex-1">
          <ChartContainer config={cfgNatureza} className="h-full w-full">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v) => brl.format(v as number)}
                  />
                }
              />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="70%"
                innerRadius="40%"
                label={({ name, percent }) =>
                  `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`
                }
                labelLine
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}

const cfgOrigem: ChartConfig = {
  valor: { label: "Valor", color: "var(--chart-1)" },
};

function Slide04ReceitasOrigem() {
  const barData = d.receitasOrigem.map((item) => ({
    name: item.nome,
    valor: item.valor,
    pct: pctFmt(item.valor, d.receitaTotalLOA),
  }));
  const colors = [
    "border-l-[color:var(--chart-1)]",
    "border-l-[color:var(--chart-2)]",
    "border-l-[color:var(--chart-3)]",
    "border-l-[color:var(--chart-4)]",
    "border-l-[color:var(--chart-5)]",
  ];
  const fillColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];
  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Receitas por Origem"
        subtitulo="Composição das fontes de receita"
      />
      <div className="flex-none grid grid-cols-5 gap-3 pt-3">
        {barData.map((item, i) => (
          <Card key={i} className={`border-l-4 ${colors[i]}`}>
            <CardHeader className="px-4 pb-1 pt-3">
              <CardDescription className="text-xs">{item.name}</CardDescription>
              <CardTitle className="text-lg">{brlM(item.valor)}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-2">
              <p className="text-sm font-medium text-muted-foreground">
                {item.pct} da receita
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="min-h-0 flex-1 pt-3">
        <ChartContainer config={cfgOrigem} className="h-full w-full">
          <BarChart
            data={barData}
            margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(v) => `R$ ${(v / 1_000_000).toFixed(0)}M`} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(v) => brl.format(v as number)}
                />
              }
            />
            <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
              {barData.map((_, i) => (
                <Cell key={i} fill={fillColors[i]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}

const cfgTrib: ChartConfig = {
  valor: { label: "Valor", color: "var(--chart-1)" },
};

function Slide05TributariasProprias() {
  const tribData = d.receitasPropriasDetalhe
    .map((item) => ({
      name: item.nome,
      valor: item.orcado2025,
      anterior: item.orcado2024,
    }))
    .sort((a, b) => b.valor - a.valor);
  const tribRows = [...d.receitasPropriasDetalhe].sort(
    (a, b) => b.orcado2025 - a.orcado2025,
  );
  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Receitas Tributárias Próprias"
        subtitulo="Quadro comparativo e distribuição — mesmo formato da audiência de referência"
      />
      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,1.15fr)] gap-3 pt-3">
        <div className="min-h-0">
          <ChartContainer config={cfgTrib} className="h-full w-full">
            <BarChart
              layout="vertical"
              data={tribData}
              margin={{ top: 5, right: 80, bottom: 5, left: 10 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(v) => `R$ ${(v / 1_000_000).toFixed(1)}M`}
              />
              <YAxis type="category" dataKey="name" width={60} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v) => brl.format(v as number)}
                  />
                }
              />
              <Bar
                dataKey="valor"
                radius={[0, 6, 6, 0]}
                fill="var(--chart-1)"
              />
            </BarChart>
          </ChartContainer>
        </div>
        <OrcamentoComparativoTable
          rows={tribRows}
          className="text-xs [&_th]:h-9 [&_th]:px-2 [&_td]:p-2"
        />
      </div>
    </div>
  );
}

const cfgFed: ChartConfig = {
  valor: { label: "Valor", color: "var(--chart-2)" },
};

function Slide06TransferenciasFederais() {
  const fedData = d.transferenciasFederaisDetalhe
    .map((item) => ({
      name: item.nome,
      valor: item.orcado2025,
      anterior: item.orcado2024,
    }))
    .sort((a, b) => b.valor - a.valor);
  const fedRows = [...d.transferenciasFederaisDetalhe].sort(
    (a, b) => b.orcado2025 - a.orcado2025,
  );
  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Transferências Federais"
        subtitulo="55,1% da receita total — quadro comparativo e distribuição por rubrica"
      />
      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,1.15fr)] gap-3 pt-3">
        <div className="min-h-0">
          <ChartContainer config={cfgFed} className="h-full w-full">
            <BarChart
              data={fedData}
              margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(v) => `R$ ${(v / 1_000_000).toFixed(0)}M`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v) => brl.format(v as number)}
                  />
                }
              />
              <Bar
                dataKey="valor"
                fill="var(--chart-2)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
        <OrcamentoComparativoTable
          rows={fedRows}
          className="text-xs [&_th]:h-9 [&_th]:px-2 [&_td]:p-2"
        />
      </div>
    </div>
  );
}

const cfgEst: ChartConfig = {
  valor: { label: "Valor", color: "var(--chart-3)" },
};

function Slide07TransferenciasEstaduais() {
  const estData = d.transferenciasEstaduaisDetalhe
    .map((item) => ({
      name: item.nome,
      valor: item.orcado2025,
      anterior: item.orcado2024,
    }))
    .sort((a, b) => b.valor - a.valor);
  const estRows = [...d.transferenciasEstaduaisDetalhe].sort(
    (a, b) => b.orcado2025 - a.orcado2025,
  );
  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Transferências Estaduais"
        subtitulo="23,8% da receita total — quadro comparativo por rubrica de repasse"
      />
      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,1.15fr)] gap-3 pt-3">
        <div className="min-h-0">
          <ChartContainer config={cfgEst} className="h-full w-full">
            <BarChart
              data={estData}
              margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(v) => `R$ ${(v / 1_000_000).toFixed(0)}M`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v) => brl.format(v as number)}
                  />
                }
              />
              <Bar
                dataKey="valor"
                fill="var(--chart-3)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
        <OrcamentoComparativoTable
          rows={estRows}
          className="text-xs [&_th]:h-9 [&_th]:px-2 [&_td]:p-2"
        />
      </div>
    </div>
  );
}

function Slide08FixacaoDespesas() {
  const orgaos = [
    {
      name: "Prefeitura Municipal",
      valor: d.despPrefeitura,
      pct: pctFmt(d.despPrefeitura, d.despesaTotalLOA),
      pctBar: d.pct(d.despPrefeitura, d.despesaTotalLOA),
    },
    {
      name: "Câmara Municipal",
      valor: d.despCamara,
      pct: pctFmt(d.despCamara, d.despesaTotalLOA),
      pctBar: d.pct(d.despCamara, d.despesaTotalLOA),
    },
    {
      name: "Fundo de Previdência",
      valor: d.despPrevidencia,
      pct: pctFmt(d.despPrevidencia, d.despesaTotalLOA),
      pctBar: d.pct(d.despPrevidencia, d.despesaTotalLOA),
    },
  ];
  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Fixação das Despesas"
        subtitulo="Total autorizado na LOA 2025 por unidade orçamentária"
      />
      <div className="flex flex-1 min-h-0 flex-col gap-4 pt-3">
        <div className="flex-none grid grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-[color:var(--chart-1)]">
            <CardHeader className="pb-1">
              <CardDescription>Despesa Total Fixada</CardDescription>
              <CardTitle className="text-3xl">
                {brl.format(d.despesaTotalLOA)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-[color:var(--chart-4)]">
            <CardHeader className="pb-1">
              <CardDescription>Reserva de Contingência</CardDescription>
              <CardTitle className="text-3xl">
                {brl.format(d.reservaContingencia)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {((d.reservaContingencia / d.despesaTotalLOA) * 100).toFixed(1)}
                % do total — margem para riscos fiscais
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left">
                <th className="pb-2 font-semibold">Unidade Orçamentária</th>
                <th className="pb-2 text-right font-semibold">Valor Fixado</th>
                <th className="pb-2 text-right font-semibold">% do Total</th>
                <th className="w-48 pb-2 pl-6 font-semibold">Distribuição</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orgaos.map((item, i) => (
                <tr key={i}>
                  <td className="py-5 font-medium">{item.name}</td>
                  <td className="py-5 text-right tabular-nums">
                    {brl.format(item.valor)}
                  </td>
                  <td className="py-5 text-right tabular-nums text-muted-foreground">
                    {item.pct}
                  </td>
                  <td className="py-5 pl-6">
                    <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-[color:var(--chart-1)]"
                        style={{ width: `${item.pctBar}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const cfgDesp: ChartConfig = {
  pessoal: { label: "Pessoal", color: "var(--chart-1)" },
  custeio: { label: "Custeio", color: "var(--chart-2)" },
  investimentos: { label: "Investimentos", color: "var(--chart-3)" },
  amortizacao: { label: "Amortização", color: "var(--chart-4)" },
  reserva: { label: "Reserva", color: "var(--chart-5)" },
  juros: { label: "Juros", color: "var(--muted-foreground)" },
};

function Slide09DespesasNatureza() {
  const fills = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--muted-foreground)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];
  const pieData = d.despesaNatureza.map((item, i) => ({
    name: item.nome,
    value: item.valor,
    fill: fills[i],
    pct: pctFmt(item.valor, d.despesaTotalLOA),
  }));
  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Despesas por Natureza"
        subtitulo="Composição do gasto público fixado"
      />
      <div className="flex flex-1 min-h-0 gap-6 pt-3">
        <div className="min-h-0 flex-1">
          <ChartContainer config={cfgDesp} className="h-full w-full">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v) => brl.format(v as number)}
                  />
                }
              />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="75%"
                innerRadius="40%"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
        <div className="flex w-64 flex-none flex-col justify-center gap-2">
          {pieData.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg border px-3 py-2"
            >
              <div
                className="h-3 w-3 flex-none rounded-sm"
                style={{ background: item.fill }}
              />
              <span className="flex-1 text-sm font-medium">{item.name}</span>
              <span className="text-sm text-muted-foreground">{item.pct}</span>
              <span className="text-sm font-medium tabular-nums">
                {brlM(item.value)}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 mt-1">
            <span className="flex-1 text-sm font-semibold">Total</span>
            <span className="text-sm font-semibold">
              {brlM(d.despesaTotalLOA)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const cfgComparativo: ChartConfig = {
  orcado2024: { label: "Orçado 2024", color: "var(--chart-4)" },
  orcado2025: { label: "Orçado 2025", color: "var(--chart-1)" },
};

function Slide10DespesaPorSecretaria() {
  const ordenadas = [...d.despesaSecretarias].sort(
    (a, b) => b.orcado2025 - a.orcado2025,
  );
  const secRows = ordenadas.map((s) => ({
    nome: s.nome,
    orcado2024: s.orcado2024,
    orcado2025: s.orcado2025,
  }));
  const top = ordenadas.slice(0, 7).map((item) => ({
    ...item,
    nomeCurto: item.nome
      .replace("Educação, Cultura, Esportes e Lazer", "Educação/Cultura")
      .replace(
        "Serviços Urbanos, Meio Ambiente e Agricultura",
        "Serviços urbanos",
      )
      .replace("Administração e Finanças", "Admin./Finanças"),
  }));

  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Despesa por Secretaria"
        subtitulo="Quadro completo com variação percentual e evolução em reais — como na LOA de referência"
      />
      <div className="grid flex-none grid-cols-3 gap-3 pt-3">
        <KpiBox
          label="Maior dotação"
          value={brlM(top[0]?.orcado2025 ?? 0)}
          detail={top[0]?.nomeCurto}
          tone="green"
        />
        <KpiBox
          label="Saúde + Educação/Cultura"
          value={brlM(
            d.despesaSecretarias[0].orcado2025 +
              d.despesaSecretarias[1].orcado2025,
          )}
          detail={`${pctFmt(d.despesaSecretarias[0].orcado2025 + d.despesaSecretarias[1].orcado2025, d.despesaTotalLOA)} da despesa fixada`}
          tone="blue"
        />
        <KpiBox
          label="Crescimento total"
          value={variacaoFmt(d.despesaTotalLOA, 45_304_484.9)}
          detail="Frente ao orçamento de 2024 da mesma base"
          tone="amber"
        />
      </div>
      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,1.2fr)] gap-3 pt-3">
        <div className="min-h-0">
          <ChartContainer config={cfgComparativo} className="h-full w-full">
            <BarChart
              layout="vertical"
              data={top}
              margin={{ top: 10, right: 35, bottom: 10, left: 20 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(v) => `R$ ${(v / 1_000_000).toFixed(0)}M`}
              />
              <YAxis type="category" dataKey="nomeCurto" width={125} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v) => brl.format(v as number)}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="orcado2024"
                fill="var(--chart-4)"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="orcado2025"
                fill="var(--chart-1)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
        <OrcamentoComparativoTable
          rows={secRows}
          className="text-[11px] [&_td:first-child]:max-w-[min(280px,36vw)] [&_td:first-child]:whitespace-normal [&_th]:h-9 [&_th]:px-2 [&_td]:p-2"
        />
      </div>
    </div>
  );
}

function Slide11DespesaPorFuncao() {
  const ordenadas = [...d.despesaFuncoes].sort(
    (a, b) => b.orcado2025 - a.orcado2025,
  );
  const funcRows = ordenadas.map((f) => ({
    nome: f.nome,
    orcado2024: f.orcado2024,
    orcado2025: f.orcado2025,
  }));
  const chartRows = ordenadas.slice(0, 7).map((f) => ({
    ...f,
    nomeCurto: f.nome.length > 22 ? `${f.nome.slice(0, 20)}…` : f.nome,
  }));

  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Despesa por Função"
        subtitulo="Classificação por finalidade — quadro detalhado e maiores rubricas em barras comparativas"
      />
      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,1.25fr)] gap-3 pt-3">
        <div className="min-h-0">
          <ChartContainer config={cfgComparativo} className="h-full w-full">
            <BarChart
              layout="vertical"
              data={chartRows}
              margin={{ top: 8, right: 28, bottom: 8, left: 8 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(v) => `R$ ${(v / 1_000_000).toFixed(0)}M`}
              />
              <YAxis type="category" dataKey="nomeCurto" width={108} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v) => brl.format(v as number)}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="orcado2024"
                fill="var(--chart-4)"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="orcado2025"
                fill="var(--chart-2)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
        <OrcamentoComparativoTable
          rows={funcRows}
          className="text-[11px] [&_td:first-child]:max-w-[min(280px,36vw)] [&_td:first-child]:whitespace-normal [&_th]:h-9 [&_th]:px-2 [&_td]:p-2"
        />
      </div>
    </div>
  );
}

const cfgSaaeComp: ChartConfig = {
  orcado2024: { label: "Orçado 2024", color: "var(--chart-4)" },
  orcado2025: { label: "Orçado 2025", color: "var(--chart-1)" },
};

function SlideSaneamentoSAAE() {
  const recChart = d.saaeReceitasDetalhe.map((r) => ({
    name: r.nome,
    orcado2024: r.orcado2024,
    orcado2025: r.orcado2025,
  }));
  const despChart = d.saaeDespesasDetalhe.map((r) => ({
    name: r.nome,
    orcado2024: r.orcado2024,
    orcado2025: r.orcado2025,
  }));
  const saldoSaaE =
    d.saneamentoAutarquia.receita2025 - d.saneamentoAutarquia.despesa2025;
  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Receitas e Despesas do SAAE"
        subtitulo="Serviço Autônomo de Água e Esgoto — autarquia em equilíbrio orçamentário"
      />
      <div className="grid flex-none grid-cols-3 gap-3 pt-3">
        <KpiBox
          label="Receita orçada 2025"
          value={brlM(d.saneamentoAutarquia.receita2025)}
          detail={`Var. vs 2024: ${variacaoFmt(d.saneamentoAutarquia.receita2025, d.saneamentoAutarquia.receita2024)}`}
          tone="green"
        />
        <KpiBox
          label="Despesa fixada 2025"
          value={brlM(d.saneamentoAutarquia.despesa2025)}
          detail={`Investimentos: ${brlM(d.saneamentoAutarquia.investimentos2025)}`}
          tone="blue"
        />
        <KpiBox
          label="Resultado previsto"
          value={saldoSaaE === 0 ? "Equilibrado" : brlM(saldoSaaE)}
          detail="Receitas e despesas compatíveis na LOA"
          tone="amber"
        />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 pt-3 lg:grid-cols-2">
        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Receitas por rubrica
          </p>
          <div className="h-[min(180px,22vh)] min-h-[100px]">
            <ChartContainer config={cfgSaaeComp} className="h-full w-full">
              <BarChart
                layout="vertical"
                data={recChart}
                margin={{ top: 4, right: 16, bottom: 4, left: 4 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `R$ ${(v / 1_000).toFixed(0)}K`}
                />
                <YAxis type="category" dataKey="name" width={88} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(v) => brl.format(v as number)}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="orcado2024"
                  fill="var(--chart-4)"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="orcado2025"
                  fill="var(--chart-1)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
          <OrcamentoComparativoTable
            rows={d.saaeReceitasDetalhe}
            className="min-h-0 flex-1 text-[11px] [&_th]:h-9 [&_th]:px-2 [&_td]:p-2"
          />
        </div>
        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Despesas por natureza
          </p>
          <div className="h-[min(180px,22vh)] min-h-[100px]">
            <ChartContainer config={cfgSaaeComp} className="h-full w-full">
              <BarChart
                layout="vertical"
                data={despChart}
                margin={{ top: 4, right: 16, bottom: 4, left: 4 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `R$ ${(v / 1_000_000).toFixed(1)}M`}
                />
                <YAxis type="category" dataKey="name" width={100} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(v) => brl.format(v as number)}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="orcado2024"
                  fill="var(--chart-4)"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="orcado2025"
                  fill="var(--chart-2)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
          <OrcamentoComparativoTable
            rows={d.saaeDespesasDetalhe}
            className="min-h-0 flex-1 text-[11px] [&_th]:h-9 [&_th]:px-2 [&_td]:p-2"
          />
        </div>
      </div>
    </div>
  );
}

const cfgPrevRec: ChartConfig = {
  valor: { label: "Valor", color: "var(--chart-1)" },
};

function SlidePrevidenciaRPPS() {
  const palette = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];
  const receitasPie = d.previdenciaRPPS.receitasDetalhe2025.map((r, i) => ({
    name: r.nome,
    value: r.valor,
    fill: palette[i % palette.length]!,
  }));
  const despesasPie = d.previdenciaRPPS.despesasDetalhe2025.map((r, i) => ({
    name: r.nome,
    value: r.valor,
    fill: palette[(i + 2) % palette.length]!,
  }));
  const comparativo = [
    {
      nome: "Receitas RPPS",
      orcado2024: d.previdenciaRPPS.receita2024,
      orcado2025: d.previdenciaRPPS.receita2025,
    },
    {
      nome: "Despesas RPPS",
      orcado2024: d.previdenciaRPPS.despesa2024,
      orcado2025: d.previdenciaRPPS.despesa2025,
    },
  ];
  const saldo = d.previdenciaRPPS.receita2025 - d.previdenciaRPPS.despesa2025;
  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Receitas e Despesas da Previdência (RPPS)"
        subtitulo="Fundo municipal — composição da receita estimada e despesa autorizada"
      />
      <div className="grid flex-none grid-cols-3 gap-3 pt-3">
        <KpiBox
          label="Receita estimada 2025"
          value={brlM(d.previdenciaRPPS.receita2025)}
          detail={`Var. vs 2024: ${variacaoFmt(d.previdenciaRPPS.receita2025, d.previdenciaRPPS.receita2024)}`}
          tone="green"
        />
        <KpiBox
          label="Despesa fixada 2025"
          value={brlM(d.previdenciaRPPS.despesa2025)}
          detail={`Função Previdência Social — ${variacaoFmt(d.previdenciaRPPS.despesa2025, d.previdenciaRPPS.despesa2024)} vs 2024`}
          tone="blue"
        />
        <KpiBox
          label="Saldo técnico previsto"
          value={brlM(saldo)}
          detail={
            saldo >= 0
              ? "Superávit estimado no conjunto receita/despesa"
              : "Déficit a monitorar na execução"
          }
          tone="amber"
        />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[0.95fr_1fr_1fr] gap-4 pt-3">
        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <p className="text-center text-xs font-semibold uppercase text-muted-foreground">
            Evolução receita x despesa
          </p>
          <div className="h-[min(190px,24vh)] min-h-[110px]">
            <ChartContainer config={cfgComparativo} className="h-full w-full">
              <BarChart
                data={comparativo}
                margin={{ top: 8, right: 12, bottom: 8, left: 10 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="nome" tick={{ fontSize: 11 }} />
                <YAxis
                  tickFormatter={(v) => `R$ ${(v / 1_000_000).toFixed(1)}M`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(v) => brl.format(v as number)}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="orcado2024"
                  fill="var(--chart-4)"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="orcado2025"
                  fill="var(--chart-1)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
          <OrcamentoComparativoTable
            rows={comparativo}
            className="min-h-0 flex-1 text-[11px] [&_th]:h-9 [&_th]:px-2 [&_td]:p-2"
          />
        </div>
        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <p className="text-center text-xs font-semibold uppercase text-muted-foreground">
            Composição da receita
          </p>
          <ChartContainer config={cfgPrevRec} className="min-h-0 flex-1 w-full">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v) => brl.format(v as number)}
                  />
                }
              />
              <Pie
                data={receitasPie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="45%"
                outerRadius="75%"
                label={({ percent }) => `${((percent ?? 0) * 100).toFixed(1)}%`}
              >
                {receitasPie.map((e, i) => (
                  <Cell key={i} fill={e.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </div>
        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <p className="text-center text-xs font-semibold uppercase text-muted-foreground">
            Composição da despesa
          </p>
          <ChartContainer config={cfgPrevRec} className="min-h-0 flex-1 w-full">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v) => brl.format(v as number)}
                  />
                }
              />
              <Pie
                data={despesasPie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="45%"
                outerRadius="75%"
                label={({ percent }) => `${((percent ?? 0) * 100).toFixed(1)}%`}
              >
                {despesasPie.map((e, i) => (
                  <Cell key={i} fill={e.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}

function Slide10GastosEducacao() {
  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Gastos com Educação — MDE"
        subtitulo="Manutenção e Desenvolvimento do Ensino · Art. 212 CF/88"
      />
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <GaugeConstitucional
            titulo="Aplicação em Educação (MDE)"
            valor={d.gastosMDE}
            base={d.baseImpostosMDE}
            limitePct={25}
            lei="Art. 212 CF/88"
            descricao="Inclui recursos do FUNDEB + dotações próprias da Secretaria de Educação. Base de cálculo: receita de impostos e transferências de impostos."
          />
        </div>
      </div>
    </div>
  );
}

function Slide11GastosSaude() {
  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Gastos com Saúde — ASPS"
        subtitulo="Ações e Serviços Públicos de Saúde · LC 141/2012"
      />
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <GaugeConstitucional
            titulo="Aplicação em Saúde (ASPS)"
            valor={d.gastosASPS}
            base={d.baseImpostosASPS}
            limitePct={15}
            lei="LC 141/2012"
            descricao="Base de cálculo: receita de impostos e transferências constitucionais, conforme LC 141/2012. A dotação prevista supera o mínimo obrigatório."
          />
        </div>
      </div>
    </div>
  );
}

function Slide12GastosPessoal() {
  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Gastos com Pessoal — LRF"
        subtitulo="Limite de 60% da RCL · Art. 19 LC 101/2000"
      />
      <div className="flex flex-1 flex-col justify-center gap-8 pt-2">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">
            Total Pessoal — Executivo + Legislativo
          </p>
          <span className="text-6xl font-bold text-green-600 dark:text-green-400">
            {d.pctPessoalGlobal.toFixed(2)}%
          </span>
          <p className="mt-1 text-base text-muted-foreground">
            Limite global: 60% da RCL — Dentro do limite ✓
          </p>
        </div>
        <div className="space-y-6">
          <GaugeSimples
            titulo="Poder Executivo"
            valor={d.despPessoalExecutivo}
            base={d.rclLOA}
            limitePct={54}
            lei="Art. 20 LC 101/2000"
          />
          <GaugeSimples
            titulo="Poder Legislativo — Câmara Municipal"
            valor={d.despPessoalLegislativo}
            base={d.rclLOA}
            limitePct={6}
            lei="Art. 20 LC 101/2000"
          />
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <p className="text-sm text-muted-foreground">
            Receita Corrente Líquida (RCL):{" "}
            <strong className="text-foreground">{brl.format(d.rclLOA)}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

function Slide13GastosSociais() {
  const totalSocial = d.gastosSociais.reduce(
    (acc, item) => acc + item.orcado2025,
    0,
  );
  const socialData = d.gastosSociais.map((item) => ({
    ...item,
    pctTotal: pctFmt(item.orcado2025, d.despesaTotalLOA),
  }));

  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Gastos Sociais"
        subtitulo="Educação, saúde e assistência social concentram a entrega direta à população"
      />
      <div className="grid flex-none grid-cols-3 gap-3 pt-3">
        <KpiBox
          label="Total em políticas sociais"
          value={brlM(totalSocial)}
          detail={`${pctFmt(totalSocial, d.despesaTotalLOA)} da despesa fixada`}
          tone="green"
        />
        <KpiBox
          label="Crescimento social"
          value={variacaoFmt(totalSocial, 25_414_734.81)}
          detail="Em relação ao orçamento social de 2024"
          tone="blue"
        />
        <KpiBox
          label="Maior prioridade"
          value="Saúde e Educação"
          detail="Dotações alinhadas aos mínimos legais e à demanda cidadã"
          tone="amber"
        />
      </div>
      <div className="flex flex-1 min-h-0 gap-5 pt-4">
        <div className="min-h-0 flex-1">
          <ChartContainer config={cfgComparativo} className="h-full w-full">
            <BarChart
              data={socialData}
              margin={{ top: 20, right: 35, bottom: 20, left: 35 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis
                tickFormatter={(v) => `R$ ${(v / 1_000_000).toFixed(0)}M`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v) => brl.format(v as number)}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="orcado2024"
                fill="var(--chart-4)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="orcado2025"
                fill="var(--chart-1)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="w-72 flex-none space-y-3">
          {socialData.map((item) => (
            <Card key={item.nome}>
              <CardHeader className="px-4 pb-1 pt-3">
                <CardDescription>{item.pctTotal} do orçamento</CardDescription>
                <CardTitle className="text-xl">{item.nome}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between px-4 pb-3">
                <span className="font-semibold">{brlM(item.orcado2025)}</span>
                <VariacaoBadge
                  atual={item.orcado2025}
                  anterior={item.orcado2024}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Slide13Investimentos() {
  const borderColors = [
    "border-l-[color:var(--chart-1)]",
    "border-l-[color:var(--chart-2)]",
    "border-l-[color:var(--chart-3)]",
    "border-l-[color:var(--chart-4)]",
    "border-l-[color:var(--chart-5)]",
    "border-l-[color:var(--chart-1)]",
  ];
  const secIcons: Record<string, typeof ConstructionIcon> = {
    Saúde: Stethoscope02Icon,
    Educação: BookOpen02Icon,
    Obras: ConstructionIcon,
    Administração: Building04Icon,
  };
  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Principais Investimentos"
        subtitulo={`Total: ${brl.format(d.despInvestimentos)} em projetos estratégicos`}
      />
      <div className="mt-3 flex-1 grid grid-cols-3 gap-3 content-start">
        {d.investimentos.map((inv, i) => (
          <Card key={i} className={`border-l-4 ${borderColors[i]}`}>
            <CardHeader className="px-4 pb-1 pt-3">
              <CardDescription className="flex items-center gap-1 text-xs">
                <HugeiconsIcon
                  icon={secIcons[inv.secretaria] ?? ConstructionIcon}
                  strokeWidth={2}
                  className="size-3"
                />
                {inv.secretaria}
              </CardDescription>
              <CardTitle className="text-base leading-snug">
                {inv.descricao}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <p className="text-xl font-bold">{brl.format(inv.valor)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex-none flex justify-end pt-2">
        <p className="text-sm text-muted-foreground">
          Total em investimentos:{" "}
          <strong className="text-foreground">
            {brl.format(d.despInvestimentos)}
          </strong>{" "}
          — {((d.despInvestimentos / d.despesaTotalLOA) * 100).toFixed(1)}% da
          despesa fixada
        </p>
      </div>
    </div>
  );
}

function Slide14ParticipacaoCidada() {
  const totalParticipantes = d.participacaoCidada.reduce(
    (acc, item) => acc + item.participantes,
    0,
  );
  const data = d.participacaoCidada.map((item) => ({
    ...item,
    temaCurto: item.tema.replace("Habitação e urbanismo", "Habitação"),
  }));

  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Participação Cidadã e Prioridades"
        subtitulo="Temas com maior demanda social devem conversar com a alocação orçamentária"
      />
      <div className="grid flex-none grid-cols-3 gap-3 pt-3">
        <KpiBox
          label="Participações analisadas"
          value={totalParticipantes.toLocaleString("pt-BR")}
          detail="Recorte demonstrativo por área temática"
          tone="primary"
        />
        <KpiBox
          label="Tema mais votado"
          value="Educação"
          detail="Demanda associada a vagas, escolas e manutenção da rede"
          tone="green"
        />
        <KpiBox
          label="Governança recomendada"
          value="Devolutiva pública"
          detail="Mostrar o que entrou na LOA e o que seguirá para PPA/LDO"
          tone="amber"
        />
      </div>
      <div className="flex flex-1 min-h-0 gap-5 pt-4">
        <div className="min-h-0 flex-1">
          <ChartContainer
            config={{
              participantes: {
                label: "Participantes",
                color: "var(--chart-1)",
              },
            }}
            className="h-full w-full"
          >
            <BarChart
              data={data}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="temaCurto" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="participantes"
                fill="var(--chart-1)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="w-80 flex-none space-y-2">
          {data.map((item) => (
            <div
              key={item.tema}
              className="grid grid-cols-[1fr_auto] gap-2 rounded-lg border px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium">{item.tema}</p>
                <p className="text-xs text-muted-foreground">
                  Dotação relacionada: {brlM(item.valorLOA)}
                </p>
              </div>
              <span className="text-lg font-semibold tabular-nums">
                {item.participantes}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const cfgCenarios: ChartConfig = {
  receita: { label: "Receita", color: "var(--chart-1)" },
  despesa: { label: "Despesa", color: "var(--chart-2)" },
};

function Slide15CenariosERiscos() {
  const cenarios = d.cenariosReceita.map((item) => ({
    ...item,
    saldo: item.receita - item.despesa,
  }));

  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Cenários e Riscos Fiscais"
        subtitulo="Leitura preventiva para manter equilíbrio orçamentário durante a execução"
      />
      <div className="grid flex-none grid-cols-3 gap-3 pt-3">
        {cenarios.map((item) => (
          <KpiBox
            key={item.cenario}
            label={item.cenario}
            value={brlM(item.saldo)}
            detail={`Saldo projetado com variação de ${item.variacao.toLocaleString("pt-BR")} % na receita`}
            tone={item.saldo >= 0 ? "green" : "amber"}
          />
        ))}
      </div>
      <div className="flex min-h-0 flex-1 gap-5 pt-4">
        <div className="min-h-0 flex-1">
          <ChartContainer config={cfgCenarios} className="h-full w-full">
            <BarChart
              data={cenarios}
              margin={{ top: 20, right: 35, bottom: 20, left: 35 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="cenario" />
              <YAxis
                tickFormatter={(v) => `R$ ${(v / 1_000_000).toFixed(0)}M`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v) => brl.format(v as number)}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="receita"
                fill="var(--chart-1)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="despesa"
                fill="var(--chart-2)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="w-80 flex-none space-y-2">
          {d.riscosFiscais.map((item) => (
            <Card key={item.risco}>
              <CardHeader className="px-4 pb-1 pt-3">
                <CardTitle className="text-base">{item.risco}</CardTitle>
                <CardDescription>
                  Probabilidade: {item.probabilidade} · Impacto: {item.impacto}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <p className="text-sm text-muted-foreground">{item.resposta}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Slide16GovernancaExecucao() {
  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Governança da Execução da LOA"
        subtitulo="Rotina de controle para transformar dotação em entrega com responsabilidade fiscal"
      />
      <div className="grid flex-none grid-cols-3 gap-3 pt-3">
        <KpiBox
          label="Ponto de controle"
          value="Bimestral"
          detail="Receita realizada x meta e limitação de empenho quando necessário"
          tone="blue"
        />
        <KpiBox
          label="Prestação de contas"
          value="Quadrimestral"
          detail="Audiência pública de metas fiscais com divulgação de resultados"
          tone="green"
        />
        <KpiBox
          label="Foco de gestão"
          value="Entrega ao cidadão"
          detail="Execução física e financeira monitorada por prioridade"
          tone="amber"
        />
      </div>
      <div className="mt-4 flex-1 grid grid-cols-2 gap-4 content-start">
        {d.marcosGovernanca.map((item) => (
          <Card
            key={item.etapa}
            className="border-l-4 border-l-[color:var(--chart-1)]"
          >
            <CardHeader className="px-4 pb-1 pt-3">
              <CardDescription>Periodicidade</CardDescription>
              <CardTitle className="text-xl">{item.etapa}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <p className="text-sm text-muted-foreground">{item.entrega}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

const cfgEvolucao: ChartConfig = {
  receita: { label: "Receita", color: "var(--chart-1)" },
  despesa: { label: "Despesa", color: "var(--chart-2)" },
};

function Slide14EvolucaoOrcamentaria() {
  return (
    <div className="flex h-full flex-col px-8 pt-6 pb-4">
      <SlideHeader
        titulo="Evolução Orçamentária"
        subtitulo="Comparativo 2023 · 2024 · 2025 — Receita vs Despesa"
      />
      <div className="min-h-0 flex-1 pt-3">
        <ChartContainer config={cfgEvolucao} className="h-full w-full">
          <BarChart
            data={d.historicoOrcamento}
            margin={{ top: 20, right: 40, bottom: 20, left: 60 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="ano" />
            <YAxis tickFormatter={(v) => `R$ ${(v / 1_000_000).toFixed(0)}M`} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(v) => brl.format(v as number)}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="receita"
              fill="var(--chart-1)"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="despesa"
              fill="var(--chart-2)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}

function Slide15ConsideracoesFinais() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <HugeiconsIcon
          icon={CheckmarkCircle02Icon}
          strokeWidth={1.5}
          className="size-8 text-green-600 dark:text-green-400"
        />
      </div>
      <div>
        <h2 className="text-4xl font-bold">Obrigado pela participação!</h2>
        <p className="mt-3 text-xl text-muted-foreground">
          A LOA 2025 foi elaborada com transparência e responsabilidade fiscal,
          <br />
          atendendo a todos os índices constitucionais obrigatórios.
        </p>
      </div>
      <div className="grid max-w-2xl grid-cols-3 gap-4 text-sm">
        <Card>
          <CardContent className="pt-4">
            <HugeiconsIcon
              icon={SecurityCheckIcon}
              strokeWidth={2}
              className="size-6 text-primary mb-2"
            />
            <p className="font-semibold">Portal da Transparência</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Acesse dados detalhados da LOA, execução orçamentária e prestação
              de contas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <HugeiconsIcon
              icon={Analytics01Icon}
              strokeWidth={2}
              className="size-6 text-primary mb-2"
            />
            <p className="font-semibold">Ouvidoria Municipal</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Canais de participação cidadã e manifestações sobre a gestão
              pública
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <HugeiconsIcon
              icon={Invoice01Icon}
              strokeWidth={2}
              className="size-6 text-primary mb-2"
            />
            <p className="font-semibold">e-SIC</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sistema de Informação ao Cidadão — solicite documentos e
              informações
            </p>
          </CardContent>
        </Card>
      </div>
      <p className="text-sm text-muted-foreground">
        "Promover a gestão fiscal responsável é o compromisso com as gerações
        presentes e futuras."
        <br />— Lei de Responsabilidade Fiscal (LC 101/2000)
      </p>
    </div>
  );
}

// ── Slide registry ─────────────────────────────────────────────────────────────
const SLIDES: { titulo: string; node: React.ReactNode }[] = [
  { titulo: "Capa", node: <Slide01Capa /> },
  { titulo: "Agenda", node: <Slide02Agenda /> },
  {
    titulo: "Base Legal e Transparência",
    node: <Slide03BaseLegalTransparencia />,
  },
  {
    titulo: "Peças Orçamentárias",
    node: <SlidePeçasOrcamentarias />,
  },
  { titulo: "Ciclo PPA · LDO · LOA", node: <Slide04CicloPlanejamento /> },
  {
    titulo: "Premissas Macrofiscais",
    node: <Slide04PremissasMacrofiscais />,
  },
  {
    titulo: "Evolução anual da receita",
    node: <SlideEvolucaoReceitaAnual />,
  },
  {
    titulo: "Previsão da Receita",
    node: <SlidePrevisaoReceitaHierarquia />,
  },
  { titulo: "Receita Total — Natureza", node: <Slide05ReceitaNatureza /> },
  { titulo: "Receitas por Origem", node: <Slide04ReceitasOrigem /> },
  {
    titulo: "Receitas Tributárias Próprias",
    node: <Slide05TributariasProprias />,
  },
  {
    titulo: "Transferências Federais",
    node: <Slide06TransferenciasFederais />,
  },
  {
    titulo: "Transferências Estaduais",
    node: <Slide07TransferenciasEstaduais />,
  },
  { titulo: "Fixação das Despesas", node: <Slide08FixacaoDespesas /> },
  {
    titulo: "Previsão da Despesa",
    node: <SlidePrevisaoDespesaHierarquia />,
  },
  { titulo: "Despesas por Natureza", node: <Slide09DespesasNatureza /> },
  { titulo: "Despesa por Secretaria", node: <Slide10DespesaPorSecretaria /> },
  { titulo: "Despesa por Função", node: <Slide11DespesaPorFuncao /> },
  { titulo: "Gastos Sociais", node: <Slide13GastosSociais /> },
  {
    titulo: "Receitas e Despesas do SAAE",
    node: <SlideSaneamentoSAAE />,
  },
  {
    titulo: "Receitas e Despesas da Previdência",
    node: <SlidePrevidenciaRPPS />,
  },
  { titulo: "Gastos com Educação (MDE)", node: <Slide10GastosEducacao /> },
  { titulo: "Gastos com Saúde (ASPS)", node: <Slide11GastosSaude /> },
  { titulo: "Gastos com Pessoal (LRF)", node: <Slide12GastosPessoal /> },
  { titulo: "Principais Investimentos", node: <Slide13Investimentos /> },
  { titulo: "Participação Cidadã", node: <Slide14ParticipacaoCidada /> },
  { titulo: "Cenários e Riscos Fiscais", node: <Slide15CenariosERiscos /> },
  { titulo: "Governança da Execução", node: <Slide16GovernancaExecucao /> },
  { titulo: "Evolução Orçamentária", node: <Slide14EvolucaoOrcamentaria /> },
  { titulo: "Considerações Finais", node: <Slide15ConsideracoesFinais /> },
];

// ══════════════════════════════════════════════════════════════════════════════
// Main exported component
// ══════════════════════════════════════════════════════════════════════════════
export function AudienciasLoaCarousel() {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [fsHint, setFsHint] = React.useState<string | null>(null);

  const total = SLIDES.length;

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  React.useEffect(() => {
    if (!api || paused) return;
    const id = window.setInterval(() => {
      api.scrollNext();
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [api, paused]);

  React.useEffect(() => {
    if (paused) return;
    setProgress(0);
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const p = Math.min(100, ((now - start) / AUTOPLAY_MS) * 100);
      setProgress(p);
      if (p < 100) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [current, paused]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (document.fullscreenElement) void exitFullscreenDoc();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "p" && e.key !== "P") return;
      if (isTypingTarget(e.target)) return;
      e.preventDefault();
      setPaused((p) => !p);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handlePanelClick = () => {
    const el = panelRef.current;
    if (!el) return;
    if (document.fullscreenElement) return;
    setFsHint(null);
    void requestFullscreenEl(el).catch(() => {
      setFsHint("Tela cheia indisponível neste navegador ou permissão negada.");
    });
  };

  const secondsLeft = Math.ceil(
    ((100 - progress) / 100) * (AUTOPLAY_MS / 1000),
  );

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="space-y-1">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          LOA 2025 — Audiência Pública
        </h2>
        <p className="text-base text-muted-foreground">
          Apresentação com {total} slides · rotação automática a cada 20&nbsp;s.
          Tecla <span className="font-medium text-foreground">P</span> pausa ou
          retoma. Clique no painel para tela cheia; use ESC para sair.
        </p>
      </div>

      <div
        ref={panelRef}
        role="button"
        tabIndex={0}
        onClick={handlePanelClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handlePanelClick();
          }
        }}
        className={cn(
          "relative mx-auto flex w-[90vw] max-w-[90vw] flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-lg ring-1 ring-foreground/5 outline-none transition-shadow",
          "h-[80vh] min-h-[320px] cursor-pointer hover:ring-2 hover:ring-primary/25 focus-visible:ring-2 focus-visible:ring-ring",
        )}
        aria-label="Apresentação LOA 2025. Tecla P pausa ou retoma a rotação. Clique para tela cheia."
      >
        {/* Progress bar */}
        <div className="absolute left-0 right-0 top-0 z-10 h-1.5 bg-muted">
          <div
            className="h-full bg-primary transition-[width] duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <Carousel
          setApi={setApi}
          opts={{ loop: true, align: "start" }}
          className="flex h-full min-h-0 flex-1 flex-col"
        >
          <CarouselContent className="-ml-0 h-full [&>div]:h-full">
            {SLIDES.map((slide, i) => (
              <CarouselItem key={i} className="h-full pl-0">
                {slide.node}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Slide indicator */}
        <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center px-4">
          <p className="max-w-[95%] rounded-full bg-background/90 px-4 py-1.5 text-center text-sm text-muted-foreground shadow-sm backdrop-blur-sm">
            {paused ? (
              <>
                Pausado · slide {current + 1} de {total} —{" "}
                {SLIDES[current]?.titulo} · tecla{" "}
                <span className="font-medium text-foreground">P</span> para
                retomar
              </>
            ) : (
              <>
                Slide {current + 1} de {total} — {SLIDES[current]?.titulo} ·
                próximo em {secondsLeft}s ·{" "}
                <span className="font-medium text-foreground">P</span> pausa
              </>
            )}
          </p>
        </div>
      </div>

      {fsHint ? (
        <p className="text-center text-base text-amber-700 dark:text-amber-400">
          {fsHint}
        </p>
      ) : null}
    </div>
  );
}
