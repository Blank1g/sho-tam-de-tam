import { CategoryChannelResolvable, ChannelType, Collection, CommandInteraction, GuildChannel, GuildMember, PermissionsBitField, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("init")
    .setDescription("Initialize channel, creates category and adds voice channels!");

export async function execute(interaction: CommandInteraction) {
    const guild = interaction.guild;

    let hostRole = guild?.roles.cache.find(role => role.name === 'SHOTAMDETAM');
    let shoTamRole = guild?.roles.cache.find(role => role.name === 'SHOTAM');
    let deTamRole = guild?.roles.cache.find(role => role.name === 'DETAM');

    if (!hostRole) {
        hostRole = await guild?.roles.create({
            name: 'SHOTAMDETAM',
            color: '#D0D0D0',
        });
    }
    if (!shoTamRole) {
        shoTamRole = await guild?.roles.create({
            name: 'SHOTAM',
            color: '#FF5B5B',
        });
    }
    if (!deTamRole) {
        deTamRole = await guild?.roles.create({
            name: 'DETAM',
            color: '#5BA3FF',
        });
    }

    let category = guild?.channels.cache.find(channel => channel.name === 'Sho Tam? De Tam? Game');
    const hostChannel = guild?.channels.cache.find(channel => channel.name === 'Sho Tam? De Tam?') as GuildChannel;
    const shoTamChannel = guild?.channels.cache.find(channel => channel.name === 'Sho Tam?') as GuildChannel;
    const deTamChannel = guild?.channels.cache.find(channel => channel.name === 'De Tam?') as GuildChannel;

    if (!category) {
        category = await guild?.channels.create({
            name: 'Sho Tam? De Tam? Game',
            type: ChannelType.GuildCategory,
            permissionOverwrites: [
                {
                    id: guild!.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: hostRole!.id,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: shoTamRole!.id,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: deTamRole!.id,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }
            ]
        });
    }

    if (hostChannel) {
        await hostChannel.setParent(category as CategoryChannelResolvable);
    }
    if (shoTamChannel) {
        await shoTamChannel.setParent(category as CategoryChannelResolvable);
    }
    if (deTamChannel) {
        await deTamChannel.setParent(category as CategoryChannelResolvable);
    }

    if (!hostChannel) {      
        await guild?.channels.create({
            name: 'Sho Tam? De Tam?',
            type: ChannelType.GuildVoice,
            parent: category as CategoryChannelResolvable,
            permissionOverwrites: [
                {
                    id: guild!.id,
                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect]
                },
                {
                    id: hostRole!.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect]
                },
                {
                    id: shoTamRole!.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect],
                },
                {
                    id: deTamRole!.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect],
                },
            ]
        });
    }

    if (!shoTamChannel) {
        await guild?.channels.create({
            name: 'Sho Tam?',
            type: ChannelType.GuildVoice,
            parent: category as CategoryChannelResolvable,
            permissionOverwrites: [
                {
                    id: guild!.id,
                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect]
                },
                {
                    id: hostRole!.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect],
                },
                {
                    id: shoTamRole!.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect],
                },
            ]
        });
    }

    if (!deTamChannel) {
        await guild?.channels.create({
            name: 'De Tam?',
            type: ChannelType.GuildVoice,
            parent: category as CategoryChannelResolvable,
            permissionOverwrites: [
                {
                    id: guild!.id,
                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect]
                },
                {
                    id: hostRole!.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect],
                },
                {
                    id: deTamRole!.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect],
                },
            ]
        });
    }

    await interaction.reply({ content: 'Initialization is done', ephemeral: true });
}

