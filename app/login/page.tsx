"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Analytics01Icon, LockIcon, UserIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const AUTH_COOKIE_NAME = "auth"
const AUTH_USERNAME = "admin"
const AUTH_PASSWORD = "admin"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    const isValid = username === AUTH_USERNAME && password === AUTH_PASSWORD

    if (!isValid) {
      setError("Usuário ou senha inválidos.")
      setIsSubmitting(false)
      return
    }

    document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=28800; samesite=lax`
    router.replace("/")
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted p-4 dark:bg-background">
      <Card className="w-full max-w-md border-border/70 shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={Analytics01Icon} strokeWidth={2} className="size-5" />
            </div>
            <div>
              <CardTitle className="text-2xl">Mirante Painel</CardTitle>
              <CardDescription>Portal de Gestão Pública Municipal</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="inline-flex items-center gap-2">
                <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-4" />
                Usuário
              </Label>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="admin"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="inline-flex items-center gap-2">
                <HugeiconsIcon icon={LockIcon} strokeWidth={2} className="size-4" />
                Senha
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="admin"
                required
              />
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
