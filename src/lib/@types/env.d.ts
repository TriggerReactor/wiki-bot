import type { ArrayString, NumberString } from '@skyra/env-utilities'

import type { EnvironmentKeys } from '../utils/constants.js'

declare module '@skyra/env-utilities' {
  interface Env {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    NODE_ENV: `development` | `production` | `test`

    [EnvironmentKeys.BASE_URL]: string
    [EnvironmentKeys.DATA_DIR]: string
    [EnvironmentKeys.TARGET_GIT_TO_SYNC]: string
    [EnvironmentKeys.FUZZILY_DOCS_SEARCH_THRESHOLD]: NumberString
    [EnvironmentKeys.COMMAND_GUILD_IDS]: ArrayString
  }
}
