"use client"

import { VisaoGeral } from "@/components/visao-geral"
import { Demo } from "@/components/demo"
import { DespesaMunicipal } from "@/components/despesa-municipal"
import { ReceitaMunicipal } from "@/components/receita-municipal"
import { FinanceiroMunicipal } from "@/components/financeiro-municipal"
import { ComprasMunicipais } from "@/components/compras-municipais"
import { RHMunicipal } from "@/components/rh-municipal"
import { PrestacaoContas } from "@/components/prestacao-contas"
import { TributacaoMunicipal } from "@/components/tributacao-municipal"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HugeiconsIcon } from "@hugeicons/react"
import { GridViewIcon, Analytics01Icon, MoneyAdd01Icon, BankIcon, ShoppingCartIcon, UserMultipleIcon, SecurityCheckIcon, Invoice01Icon, Home01Icon } from "@hugeicons/core-free-icons"

export default function Page() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start bg-muted p-4 sm:p-6 lg:p-12 dark:bg-background">
      <div className="w-full max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={Analytics01Icon} strokeWidth={2} className="size-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics Dash</h1>
              <p className="text-sm text-muted-foreground">Portal de Gestão Pública Municipal</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="visao-geral" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl p-2 sm:w-auto sm:grid-cols-none sm:flex sm:rounded-full sm:p-1">
            <TabsTrigger value="visao-geral" className="gap-2">
              <HugeiconsIcon icon={Home01Icon} strokeWidth={2} className="size-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="receita" className="gap-2">
              <HugeiconsIcon icon={MoneyAdd01Icon} strokeWidth={2} className="size-4" />
              Receita
            </TabsTrigger>
            <TabsTrigger value="despesa" className="gap-2">
              <HugeiconsIcon icon={Analytics01Icon} strokeWidth={2} className="size-4" />
              Despesa
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="gap-2">
              <HugeiconsIcon icon={BankIcon} strokeWidth={2} className="size-4" />
              Financeiro
            </TabsTrigger>
            <TabsTrigger value="compras" className="gap-2">
              <HugeiconsIcon icon={ShoppingCartIcon} strokeWidth={2} className="size-4" />
              Compras
            </TabsTrigger>
            <TabsTrigger value="rh" className="gap-2">
              <HugeiconsIcon icon={UserMultipleIcon} strokeWidth={2} className="size-4" />
              RH
            </TabsTrigger>
            <TabsTrigger value="tributacao" className="gap-2">
              <HugeiconsIcon icon={Invoice01Icon} strokeWidth={2} className="size-4" />
              Tributação
            </TabsTrigger>
            <TabsTrigger value="prestacao-contas" className="gap-2">
              <HugeiconsIcon icon={SecurityCheckIcon} strokeWidth={2} className="size-4" />
              Prestação de Contas
            </TabsTrigger>
            <TabsTrigger value="demo" className="gap-2">
              <HugeiconsIcon icon={GridViewIcon} strokeWidth={2} className="size-4" />
              Componentes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="visao-geral" className="mt-6">
            <VisaoGeral />
          </TabsContent>
          
          <TabsContent value="receita" className="mt-6">
            <ReceitaMunicipal />
          </TabsContent>
          
          <TabsContent value="despesa" className="mt-6">
            <DespesaMunicipal />
          </TabsContent>
          
          <TabsContent value="financeiro" className="mt-6">
            <FinanceiroMunicipal />
          </TabsContent>
          
          <TabsContent value="compras" className="mt-6">
            <ComprasMunicipais />
          </TabsContent>
          
          <TabsContent value="rh" className="mt-6">
            <RHMunicipal />
          </TabsContent>
          
          <TabsContent value="tributacao" className="mt-6">
            <TributacaoMunicipal />
          </TabsContent>
          
          <TabsContent value="prestacao-contas" className="mt-6">
            <PrestacaoContas />
          </TabsContent>
          
          <TabsContent value="demo" className="mt-6">
            <Demo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
