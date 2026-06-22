/** Временные креды до Go API — совпадают с legacy index.html */
export const AUTH_USER = 'user'
export const AUTH_PASS = 'useradmin'

export function checkCredentials(user: string, pass: string): boolean {
  return user.trim() === AUTH_USER && pass === AUTH_PASS
}
