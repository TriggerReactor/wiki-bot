import type { WikiCacheClient } from '#lib/client/WikiCacheClient.js'
import type { Tag } from '#lib/utils/tag-utils.js'

declare module '@sapphire/pieces' {
  interface Container {
    tagCache: Tag.Store
    wikiCacheClient: WikiCacheClient
  }
}
