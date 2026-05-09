"use client";

/**
 * Painel estilo TV: licitações em aberto em carrossel automático,
 * área ~80vh × 90vw; clique entra em tela cheia; ESC sai.
 */

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
import { LICITACOES_ABERTAS } from "@/lib/demo-licitacoes-abertas";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 10_000;

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function requestFullscreenEl(el: HTMLElement) {
  const w = el as HTMLElement & {
    webkitRequestFullscreen?: () => void;
  };
  if (el.requestFullscreen) {
    return el.requestFullscreen();
  }
  if (w.webkitRequestFullscreen) {
    w.webkitRequestFullscreen();
    return Promise.resolve();
  }
  return Promise.reject(new Error("fullscreen unavailable"));
}

function exitFullscreenDoc() {
  const d = document as Document & {
    webkitExitFullscreen?: () => void;
  };
  if (document.fullscreenElement && document.exitFullscreen) {
    return document.exitFullscreen();
  }
  if (d.webkitExitFullscreen) {
    d.webkitExitFullscreen();
  }
  return Promise.resolve();
}

export function LicitacoesAbertas() {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [fsHint, setFsHint] = React.useState<string | null>(null);

  const slides = LICITACOES_ABERTAS;
  const total = slides.length;

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
    if (!api) return;
    const id = window.setInterval(() => {
      api.scrollNext();
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [api]);

  React.useEffect(() => {
    setProgress(0);
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const p = Math.min(
        100,
        ((now - start) / AUTOPLAY_MS) * 100,
      );
      setProgress(p);
      if (p < 100) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [current]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (document.fullscreenElement) {
        void exitFullscreenDoc();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handlePanelClick = () => {
    const el = panelRef.current;
    if (!el) return;
    if (document.fullscreenElement) return;
    setFsHint(null);
    void requestFullscreenEl(el).catch(() => {
      setFsHint(
        "Tela cheia indisponível neste navegador ou permissão negada.",
      );
    });
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Licitações em aberto
        </h2>
        <p className="text-sm text-muted-foreground">
          Painel para exibição em telão: rotação automática. Clique no painel
          para tela cheia; use ESC para sair.
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
        aria-label="Painel de licitações em aberto. Clique para tela cheia."
      >
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
            {slides.map((lic) => (
              <CarouselItem key={lic.id} className="h-full pl-0">
                <div className="flex h-full items-stretch px-6 pb-8 pt-10 sm:px-10">
                  <Card className="flex w-full flex-col justify-center border-0 bg-transparent shadow-none">
                    <CardHeader className="gap-3 space-y-4 pb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-sm">
                          Em aberto
                        </Badge>
                        <span className="font-mono text-lg text-muted-foreground sm:text-xl">
                          {lic.processo}
                        </span>
                      </div>
                      <CardTitle className="text-balance text-3xl leading-tight sm:text-4xl lg:text-5xl">
                        {lic.objeto}
                      </CardTitle>
                      <CardDescription className="text-base text-muted-foreground sm:text-lg">
                        {lic.orgao}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 pt-2 sm:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Modalidade
                        </p>
                        <p className="text-xl font-semibold sm:text-2xl">
                          {lic.modalidade}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Valor estimado
                        </p>
                        <p className="text-xl font-semibold tabular-nums sm:text-2xl">
                          {brl.format(lic.valorEstimado)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Abertura do processo
                        </p>
                        <p className="text-lg sm:text-xl">{lic.dataAbertura}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Limite para propostas
                        </p>
                        <p className="text-lg font-medium text-amber-700 dark:text-amber-400 sm:text-xl">
                          {lic.dataLimitePropostas}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Publicação / portal
                        </p>
                        <p className="mt-1 text-base leading-relaxed text-muted-foreground sm:text-lg">
                          {lic.portal}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center px-4">
          <p className="rounded-full bg-background/90 px-4 py-1.5 text-center text-xs text-muted-foreground shadow-sm backdrop-blur-sm">
            Slide {current + 1} de {total} · próximo em{" "}
            {Math.ceil(((100 - progress) / 100) * (AUTOPLAY_MS / 1000))}s
          </p>
        </div>
      </div>

      {fsHint ? (
        <p className="text-center text-sm text-amber-700 dark:text-amber-400">
          {fsHint}
        </p>
      ) : null}
    </div>
  );
}
