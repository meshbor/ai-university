import { useState, type FormEvent } from 'react'
import { useAppStore } from '@/stores/use-app-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    <div className="game-lobby flex min-h-screen flex-col items-center justify-center p-4">
      <div className="game-lobby-bg" aria-hidden />
      <div className="game-lobby-scanlines" aria-hidden />

      <div className="relative z-10 w-full max-w-md text-center">
        <p className="game-lobby-kicker">press start to continue</p>
        <h1 className="game-lobby-title mt-3 text-4xl sm:text-5xl">AI University</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#c8c1dc]">
          Геймифицированный трекер навыков.
          <br />
          Войди в систему — дальше выбор героя и курсы.
        </p>

        <form
          className="game-lobby-panel mt-8 space-y-4 p-6 text-left"
          onSubmit={submit}
        >
          <div className="space-y-2">
            <Label htmlFor="auth-user" className="text-xs uppercase tracking-wider text-[#9a92b0]">
              Логин
            </Label>
            <Input
              id="auth-user"
              autoComplete="username"
              placeholder="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="game-lobby-input h-11 border-[#6f5bdf]/40 bg-[#0f0c18] text-[#efeafc]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="auth-pass" className="text-xs uppercase tracking-wider text-[#9a92b0]">
              Пароль
            </Label>
            <Input
              id="auth-pass"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="game-lobby-input h-11 border-[#6f5bdf]/40 bg-[#0f0c18] text-[#efeafc]"
            />
          </div>
          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          <Button type="submit" className="game-lobby-cta h-12 w-full text-base font-semibold">
            ▶ Войти в игру
          </Button>
        </form>

        <p className="mt-6 text-xs text-[#7a7294]">Доступ только для своих · прогресс в браузере</p>
      </div>
    </div>
  )
}
