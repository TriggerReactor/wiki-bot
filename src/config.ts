import { setup } from '@skyra/env-utilities'
import type { ClientOptions } from 'discord.js'
import { Constants } from 'discord.js'
import { GatewayIntentBits } from 'discord-api-types/v10'
import { URL } from 'node:url'

import { Directories } from './lib/utils/constants.js'

setup(new URL(`.env`, Directories.Root))

export const CLIENT_OPTIONS: ClientOptions = {
  intents: [GatewayIntentBits.Guilds],
  partials: [
    Constants.PartialTypes.CHANNEL,
    Constants.PartialTypes.GUILD_MEMBER,
    Constants.PartialTypes.GUILD_SCHEDULED_EVENT,
    Constants.PartialTypes.MESSAGE,
    Constants.PartialTypes.REACTION
  ]
}
