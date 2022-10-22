import { SapphireClient } from '@sapphire/framework'
import { container } from '@sapphire/pieces'
import { type ClientOptions, Collection } from 'discord.js'

import { CLIENT_OPTIONS } from '#lib/config.js'
import { WikiCacheClient } from '#lib/client/WikiCacheClient.js'

export class Client extends SapphireClient {
  public constructor()
  public constructor(options: ClientOptions = CLIENT_OPTIONS) {
    super(options)

    container.tagCache = new Collection()
    container.wikiCacheClient = new WikiCacheClient()
  }
}
