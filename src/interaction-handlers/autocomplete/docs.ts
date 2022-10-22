import { ApplyOptions as Mixin } from '@sapphire/decorators'
import { type Option, InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework'
import { isNullishOrEmpty } from '@sapphire/utilities'
import type { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from 'discord.js'

import {
  docsToChoiceData,
  fuzzyDocsToChoiceData
} from '#lib/utils/responseBuilders/docsResponseBuilder.js'

@Mixin<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class DocsAutoCompleteHandler extends InteractionHandler<{
  interactionHandlerType: InteractionHandlerTypes.Autocomplete
}> {
  public override async parse(
    interaction: AutocompleteInteraction
  ): Promise<Option<ApplicationCommandOptionChoiceData[]>> {
    if (interaction.commandName !== 'docs') {
      return this.none()
    }

    const focusedOption = interaction.options.getFocused(true)

    if (focusedOption.name !== 'query') {
      return this.none()
    }

    if (isNullishOrEmpty(focusedOption.value)) {
      const docs = await this.container.wikiCacheClient.getDocs()

      return this.some(docs.map(docsToChoiceData))
    }

    const fuzzyDocs = await this.container.wikiCacheClient //
      .fuzzilySearchDocs(focusedOption.value)

    return this.some(fuzzyDocs.map(fuzzyDocsToChoiceData))
  }

  public override async run(
    interaction: AutocompleteInteraction,
    result: InteractionHandler.ParseResult<this>
  ): Promise<void> {
    return interaction.respond(result)
  }
}
