import type { ApplicationCommandOptionChoiceData, MessageSelectOptionData } from 'discord.js'

import type { WikiCacheClient } from '../../client/WikiCacheClient.js'

export function docsToChoiceData(docs: string): ApplicationCommandOptionChoiceData {
  return {
    name: docs,
    value: docs
  }
}

export function docsToSelectOption(docs: string): MessageSelectOptionData {
  return {
    label: docs,
    value: docs
  }
}

export function fuzzyDocsToChoiceData(
  fuzzyEntry: WikiCacheClient.FuzzilySearchDocs.Result
): ApplicationCommandOptionChoiceData {
  return {
    name: fuzzyEntry.name,
    value: fuzzyEntry.name
  }
}
