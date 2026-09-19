/** Query keys include the role and filters so cached data never leaks between roles or views. */
export const queryKeys = {
  me: ['auth', 'me'],
}
