import { SapphireClient } from '@sapphire/framework'
import { container } from '@sapphire/pieces'
import type { ClientOptions } from 'discord.js'

import { CLIENT_OPTIONS } from '../../config.js'
import { WikiCacheClient } from './WikiCacheClient.js'

export class Client extends SapphireClient {
  public constructor()
  public constructor(options: ClientOptions = CLIENT_OPTIONS) {
    super(options)

    container.wikiCacheClient = new WikiCacheClient()
  }
}
