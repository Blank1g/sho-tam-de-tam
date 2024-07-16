import { CommandInteraction, GuildMember, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("hear")
    .setDescription("Unmutes sound for all users in the voice channel");

export async function execute(interaction: CommandInteraction) {
    const { channel } = interaction.member instanceof GuildMember && interaction.member.voice ? interaction.member.voice : { channel: null };
    if (!channel) {
        return interaction.reply({ content: 'You need to join a voice channel first!', ephemeral: true });
    }

    for (const member of channel.members.values()) {
        member.voice.setDeaf(false);
    }

    return interaction.reply({ content: 'Unmuted all users in the voice channel', ephemeral: true });
}