"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"

type KpiOrcamentoCardProps = {
  title: string
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  iconClassName?: string
  iconWrapperClassName?: string
  value: React.ReactNode
  footer?: React.ReactNode
  borderClassName?: string
}

export function KpiOrcamentoCard({
  title,
  icon,
  iconClassName = "text-blue-600",
  iconWrapperClassName = "bg-blue-100 dark:bg-blue-900/30",
  value,
  footer,
  borderClassName,
}: KpiOrcamentoCardProps) {
  return (
    <Card className={borderClassName}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`rounded-full p-2 ${iconWrapperClassName}`}>
          <HugeiconsIcon icon={icon} strokeWidth={2} className={`size-4 ${iconClassName}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {footer != null ? <div className="mt-1">{footer}</div> : null}
      </CardContent>
    </Card>
  )
}
