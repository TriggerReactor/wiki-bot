import { envParseArray } from '@skyra/env-utilities'

import { EnvironmentKeys } from './constants.js'

export function getGuildIds(): string[] {
  return envParseArray(EnvironmentKeys.COMMAND_GUILD_IDS, [])
}

/**
 * Acquires an array of string, and returns an object which has the keys equal of
 * array length, and their values also equal to their mapping keys.
 *
 * **Credits**: https://github.com/Sayakie/Hakase/blob/3860bf7881/src/lib/internal/utils/functions/keyMirror.ts
 *
 * @param {string[]} keys An array of string would be the keys in the returned object
 * @returns An object with the same keys as the given array, and their values also equal to their mapping keys
 * @example
 * ```typescript
 * const ChatInputIds = keyMirror([
 *   `Docs`
 * ])
 *
 * asserts.equals(ChatInputIds.Docs, `Docs`) // true
 * ```
 */
export function keyMirror<T extends string>(keys: T[]): { [P in T]: P } {
  // @ts-expect-error - Should be a valid type
  const mirroredKeys: { [P in T]: P } = {}

  keys.forEach(key => {
    mirroredKeys[key] = key
  })

  return mirroredKeys
}

/**
 * Acquires an array of string and returns an object with the string as keys
 * and the index of the string as values. This is useful for mapping strings
 * to their index in an array.
 *
 * **Credits**: https://github.com/Sayakie/Hakase/blob/3860bf7881/src/lib/internal/utils/functions/createEnum.ts
 *
 * @param {string[]} keys An array of string would be the keys in the returned object
 * @returns {Record<string, number>} An object with the same keys as the given array, but with each key's value being the index of the key in the array
 * @example
 * ```typescript
 * const ClientStatus = createEnum([
 *   `Ready`,
 *   `Disconnected`
 * ])
 *
 * asserts.equals(ClientStatus[0], `Ready`) // true
 * asserts.equals(ClientStatus.Disconnected === 1) // true
 * ```
 */
export function createEnum<T extends ReadonlyArray<string>>(
  keys: [...T] | Readonly<T>
): {
  [V in T[number]]: {
    [K in Exclude<keyof T, keyof unknown[]>]: V extends T[K] ? K : never
  }[Exclude<keyof T, keyof unknown[]>]
} & {
  [K in Exclude<keyof T, keyof unknown[]>]: T[K]
} {
  return (keys as T).reduce((mirror, key, index) => {
    mirror[key] = index
    mirror[index] = key

    return mirror
  }, {} as any) // eslint-disable-line @typescript-eslint/no-explicit-any
}
