import { bold, hideLinkEmbed, hyperlink, italic, underscore } from '@discordjs/builders'
import { ApplyOptions as Mixin } from '@sapphire/decorators'
import { type ChatInputCommand, Command } from '@sapphire/framework'
import { MessageActionRow, MessageSelectMenu } from 'discord.js'

import { SelectMenuIdentifiers } from '../lib/utils/constants.js'
import { docsToSelectOption } from '../lib/utils/responseBuilders/docsResponseBuilder.js'
import { getGuildIds } from '../lib/utils/util.js'

const QUERY_DESCRIPTION = `Docs name or containing content to search for`
const TARGET_DESCRIPTION = `User to mention`

@Mixin<ChatInputCommand.Options>({
  description: `Display TriggerReactor documentation`
})
export class DocsCommand extends Command {
  public override registerApplicationCommands(registry: ChatInputCommand.Registry): void {
    registry.registerChatInputCommand(
      builder =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption(option =>
            option
              .setName(`query`)
              .setDescription(QUERY_DESCRIPTION)
              .setRequired(true)
              .setAutocomplete(true)
          )
          .addUserOption(option =>
            option.setName(`target`).setDescription(TARGET_DESCRIPTION).setRequired(false)
          ),
      {
        guildIds: getGuildIds(),
        idHints: [`996673569801113640`, `996689769700524064`]
      }
    )
  }

  public override async chatInputRun(interaction: ChatInputCommand.Interaction): Promise<void> {
    await interaction.deferReply()

    const query = interaction.options.getString(`query`, true)
    const target = interaction.options.getUser(`target`)

    const documentLinkOption = await this.container.wikiCacheClient.getDocumentLink(query)
    if (documentLinkOption.isNone()) {
      const docs = await this.container.wikiCacheClient.getDocs()

      const messageActionRow = new MessageActionRow().setComponents(
        new MessageSelectMenu()
          .setCustomId(SelectMenuIdentifiers.ChoiceSuggestion)
          .setOptions(docs.map(docsToSelectOption))
      )

      await interaction.editReply({ components: [messageActionRow] })
      return
    }

    const documentName = query
    const documentLink = documentLinkOption.unwrap()
    const documentToDiscordFormat = bold(
      underscore(hyperlink(documentName, hideLinkEmbed(documentLink)))
    )

    await interaction.editReply({
      content:
        (target ? italic(`Docs for ${target}\n`) : ``) +
        `:small_orange_diamond: ${documentToDiscordFormat}`
    })
  }
}
