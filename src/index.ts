import './config.js'
import 'zx/globals'

import { Client } from './lib/client/Client.js'

$.verbose = process.env.NODE_ENV !== `production`

const client = new Client()
await client.login().catch(reason => {
  process.exitCode = 1

  client.logger.error(reason)
  client.destroy()
})
