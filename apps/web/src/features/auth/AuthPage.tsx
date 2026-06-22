import { useState, type FormEvent } from 'react'
import { useAppStore } from '@/stores/use-app-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function AuthPage() {
  const login = useAppStore((s) => s.login)
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  const submit = (e?: FormEvent) => {
    e?.preventDefault()
    if (login(user, pass)) {
      setError('')
      return
    }
    setError('Неверный логин или пароль')
    setPass('')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0a0810] to-[#141020] p-4">
      <Card className="w-full max-w-md border-white/15 bg-[#1a1528]/95 text-[#efeafc] shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">AI University</CardTitle>
          <CardDescription className="text-[#c8c1dc]">
            Вход по логину и паролю. Без него страница недоступна.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="auth-user" className="text-[#b8b0ce]">
                Логин
              </Label>
              <Input
                id="auth-user"
                autoComplete="username"
                placeholder="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="border-[#4f466d] bg-[#171522] text-[#efeafc]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auth-pass" className="text-[#b8b0ce]">
                Пароль
              </Label>
              <Input
                id="auth-pass"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="border-[#4f466d] bg-[#171522] text-[#efeafc]"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" className="w-full">
              Войти
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
