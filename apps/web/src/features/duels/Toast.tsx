interface ToastProps {
  message: string | null
}

export function Toast({ message }: ToastProps) {
  if (!message) return null
  return <div className="rpg-toast show">{message}</div>
}
