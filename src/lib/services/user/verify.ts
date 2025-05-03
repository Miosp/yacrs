import { err, errAsync, okAsync, ResultAsync } from 'neverthrow'
import * as argon2 from "argon2";
import { client } from '../db';

export async function verifyUser(username: string | undefined, password: string | undefined) {
  if (!username || !password) {
    return err('Missing username or password');
  }

  return ResultAsync.fromPromise(
    client.user.findUnique({
      where: { username }
    }),
    () => ({ message: 'Database error' })
  )
    .andThen(user => {
      if (!user) return errAsync('User not found');
      if (!user.password) return errAsync('Password not set');

      return okAsync({ user, password });
    })
    .andThen(({ user, password: plainPassword }) =>
      ResultAsync.fromPromise(
        argon2.verify(user.password!, plainPassword),
        () => ({ message: 'Password verification failed' })
      )
        .map(isValid => ({ user, isValid }))
    )
    .andThen(({ user, isValid }) => {
      if (!isValid) return errAsync('Invalid password');

      const { password: _, ...userWithoutPassword } = user;
      return okAsync(userWithoutPassword);
    });
}