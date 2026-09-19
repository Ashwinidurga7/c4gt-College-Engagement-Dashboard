/** Accessibility attributes for a control rendered inside FormField. */
export function fieldProps(id, error, hint) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  }
}
