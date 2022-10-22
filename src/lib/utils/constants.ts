import { URL } from 'node:url'

import { keyMirror } from '@dareharu/utilities'

export const enum BrandingColor {
  Primary = 0x06d6a0,
  Secondary = 0xa08de9,
  Info = 0x608bda,
  Warn = 0xf1c40f,
  Danger = 0xe22b46
}

export const RootDirectory = new URL('../', import.meta.url)

export const enum EmojiKey {
  Repository = '<:__:1032585667139604501>',
  Workflow = '<:__:1032585697426690078>',
  Iteration = '<:__:1032585711007830076>',
  PullRequestMerged = '<:__:1032585586546057286>',
  PullRequestClosed = '<:__:1032585607236554765>',
  PullRequestDraft = '<:__:1032585616862498877>',
  PullRequestOpen = '<:__:1032585628627509319>',
  IssueClosedAsNotPlanned = '<:__:1032585642275774515>',
  IssueClosed = '<:__:1033239757762859018>',
  IssueOpen = '<:__:1032585652308541440>',
  ThumbsUp = '<:__:1032585678191611985>',
  ThumbsDown = '<:__:1032585683782606900>'
}

export const SelectMenuIdentifiers = keyMirror(['ChoiceSuggestion'])

export const EnvironmentKeys = keyMirror([
  'BASE_URL',
  'DATA_DIR',
  'TARGET_GIT_TO_SYNC',

  'FUZZILY_DOCS_SEARCH_THRESHOLD',

  'COMMAND_GUILD_IDS'
])
