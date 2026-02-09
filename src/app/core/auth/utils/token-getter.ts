export function tokenGetter(): string | null {
  return localStorage.getItem('token');
}
