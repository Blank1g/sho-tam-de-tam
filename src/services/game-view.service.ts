import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, User } from "discord.js";

export function generateEmbeded(template?: EmbedBuilder, players?: any): EmbedBuilder {
    if (!template) {
        return new EmbedBuilder()
        .setTitle('Teams information')
        .setAuthor({ name: 'See game in web', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
        .addFields(
            { name: 'Host', value: '...' },
            { name: '\u200B', value: '\u200B' },
            { name: 'Team Sho Tam', value: '...' },
            { name: 'Team De Tam', value: '...' },
            { name: '\u200B', value: '\u200B' },
        )
        .setFooter({ text: 'Created by "Sho Tam" team', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
    } else {
        const host = players['host']
        const shoTam = players['sho_tam']
        const deTam = players['de_tam']  

        const newTemplate = template.setFields(
            { name: 'Host', value: `${host ? host.username : '...'}` },
            { name: '\u200B', value: '\u200B' },
            { name: 'Team Sho Tam', value: `${shoTam && shoTam.team.length ? shoTam.team.map((player: User) => player.username).join(', ') : '...'}` },
            { name: 'Team De Tam', value: `${deTam && deTam.team.length ? deTam.team.map((player: User) => player.username).join(', ') : '...'}` },
            { name: '\u200B', value: '\u200B' },
        );

        return newTemplate
    }
}

export function generateButtons(): ActionRowBuilder<ButtonBuilder> {
    const hostButton = new ButtonBuilder()
    .setCustomId('host')
    .setLabel('Join Host')
    .setStyle(ButtonStyle.Success)

    const shoTamButton = new ButtonBuilder()
        .setCustomId('sho_tam')
        .setLabel('Join Sho Tam')
        .setStyle(ButtonStyle.Danger)

    const deTamButton = new ButtonBuilder()
        .setCustomId('de_tam')
        .setLabel('Join De Tam')
        .setStyle(ButtonStyle.Primary)

    const buttons = new ActionRowBuilder<ButtonBuilder>()
        buttons.addComponents(hostButton, shoTamButton, deTamButton);

    return buttons
}