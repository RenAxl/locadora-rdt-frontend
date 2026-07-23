const ROLE_PREFIX = 'ROLE_';

export function normalizeRoleAuthority(value: string): string {
  const authority = value
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/[^A-Z0-9_]/g, '');

  if (!authority || authority.startsWith(ROLE_PREFIX)) {
    return authority;
  }

  return `${ROLE_PREFIX}${authority}`;
}
