export type RelatedName = { name: string } | { name: string }[] | null

export function relatedName(value: RelatedName): string | null {
  if (Array.isArray(value)) return value[0]?.name ?? null
  return value?.name ?? null
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUuid(value: string): boolean {
  return uuidPattern.test(value)
}
