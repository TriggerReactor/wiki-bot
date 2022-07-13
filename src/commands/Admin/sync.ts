import { ApplyOptions as Mixin } from '@sapphire/decorators'
import type { ChatInputCommand } from '@sapphire/framework'
import { Command } from '@sapphire/framework'

import { getGuildIds } from '../../lib/utils/util.js'

@Mixin<ChatInputCommand.Options>({
  description: `Synchronize wiki index data to latest version. Can only be used by the moderators.`
})
export class SyncCommand extends Command {
  readonly #SUCCESS_MESSAGE: string = `Synced wiki index data to latest version successfully.`
  readonly #FAILURE_MESSAGE: string = `Failed to sync wiki index data to latest version. The loaded pages would be restored fallback.`

  public override registerApplicationCommands(registry: ChatInputCommand.Registry): void {
    registry.registerChatInputCommand(
      builder =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .setDefaultMemberPermissions(null),
      {
        guildIds: getGuildIds(),
        idHints: [`996666970663571466`, `996689768253501460`]
      }
    )
  }

  public override async chatInputRun(interaction: ChatInputCommand.Interaction): Promise<void> {
    await interaction.deferReply()

    const isSynced = await this.container.wikiCacheClient.updateDocs()
    if (isSynced) {
      await interaction.editReply({
        content: this.#SUCCESS_MESSAGE
      })
    } else {
      await interaction.editReply({
        content: this.#FAILURE_MESSAGE
      })
    }
  }
}
