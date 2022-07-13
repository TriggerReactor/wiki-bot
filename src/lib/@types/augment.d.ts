import type { WikiCacheClient } from '../client/WikiCacheClient.js'

declare module '@sapphire/pieces' {
  interface Container {
    wikiCacheClient: WikiCacheClient
  }
}
