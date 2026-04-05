"use client"

import { Demo } from "@/components/demo"
import { DespesaMunicipal } from "@/components/despesa-municipal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HugeiconsIcon } from "@hugeicons/react"
import { GridViewIcon, Analytics01Icon } from "@hugeicons/core-free-icons"

export default function Page() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start bg-muted p-4 sm:p-6 lg:p-12 dark:bg-background">
      <div className="w-full max-w-6xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Radix Luma Components</h1>
          <p className="mt-2 text-muted-foreground">Demonstracao de componentes e sistema de gestao publica</p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-none sm:flex">
            <TabsTrigger value="demo" className="gap-2">
              <HugeiconsIcon icon={GridViewIcon} strokeWidth={2} className="size-4" />
              Demo
            </TabsTrigger>
            <TabsTrigger value="despesa" className="gap-2">
              <HugeiconsIcon icon={Analytics01Icon} strokeWidth={2} className="size-4" />
              Despesa
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="demo" className="mt-6">
            <Demo />
          </TabsContent>
          
          <TabsContent value="despesa" className="mt-6">
            <DespesaMunicipal />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
