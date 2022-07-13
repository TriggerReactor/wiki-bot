import { URL } from 'node:url'

import { keyMirror } from './util.js'

export const enum BrandingColors {
  Primary = 0x06d6a0,
  Secondary = 0xa08de9,
  Info = 0x608bda,
  Warn = 0xf1c40f,
  Danger = 0xe22b46
}

export const Directories = {
  Root: new URL(`../`, import.meta.url)
}

export const SelectMenuIdentifiers = keyMirror([`ChoiceSuggestion`])

export const EnvironmentKeys = keyMirror([
  `BASE_URL`,
  `DATA_DIR`,
  `TARGET_GIT_TO_SYNC`,

  `FUZZILY_DOCS_SEARCH_THRESHOLD`,

  `COMMAND_GUILD_IDS`
])
