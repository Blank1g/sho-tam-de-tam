import { CommandInteraction, GuildMember, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("deaf")
    .setDescription("Mutes sound for all users in the voice channel");

export async function execute(interaction: CommandInteraction) {
    const member = interaction.member;
    const channel = member instanceof GuildMember && member.voice ? member.voice.channel : null;
    if (!channel) {
        return interaction.reply({ content: 'You need to join a voice channel first!', ephemeral: true });
    }

    for (const member of channel.members.values()) {
        member.voice.setDeaf(true);
    }

    return interaction.reply({ content: 'Muted all users in the voice channel', ephemeral: true });
}