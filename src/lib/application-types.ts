export type ApplyActionState =
  | { status: 'error'; message: string }
  | { status: 'success'; message: string }
  | null
