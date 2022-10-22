import '#lib/setup.js'

import { Client } from '#lib/client/Client.js'

const client = new Client()

await client
  .login() //
  .catch(reason => {
    process.exitCode = 1

    client.logger.error(reason)
    client.destroy()

    throw new Error('App panic!', { cause: reason })
  })
