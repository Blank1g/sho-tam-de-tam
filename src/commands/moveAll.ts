import { Collection, CommandInteraction, CommandInteractionOptionResolver, GuildChannel, GuildMember, Role, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("move_all")
    .setDescription("Moves all users in the voice channel to defferent voice channel by role")
    .addStringOption((option) => 
        option.setName("in_or_out")
        .setDescription('move all users in or out of the channel'));

export async function execute(interaction: CommandInteraction) {
    const guild = interaction.guild;
    const hostChannel = guild?.channels.cache.find(channel => channel.name === 'Sho Tam? De Tam?') as GuildChannel;
    const shoTamChannel = guild?.channels.cache.find(channel => channel.name === 'Sho Tam?') as GuildChannel;
    const deTamChannel = guild?.channels.cache.find(channel => channel.name === 'De Tam?') as GuildChannel;
    
    if (!hostChannel || !shoTamChannel || !deTamChannel) {
        await interaction.reply({ content: 'Voice channels not found', ephemeral: true });
        return;
    }

    const shoTamRole = guild?.roles.cache.find(role => role.name === 'SHOTAM');
    const deTamRole = guild?.roles.cache.find(role => role.name === 'DETAM');

    if (!shoTamRole || !deTamRole) {
        await interaction.reply({ content: 'Roles not found', ephemeral: true });
        return;
    }

    const inOrOut = (interaction.options as CommandInteractionOptionResolver).getString('in_or_our');
    
    if (inOrOut === 'in') {
        await moveIn(hostChannel, shoTamChannel, deTamChannel, shoTamRole, deTamRole);
    } else if (inOrOut === 'out'){
        await moveOut(hostChannel, shoTamChannel, deTamChannel, shoTamRole, deTamRole);
    } else {
        await interaction.reply({ content: 'Please provide a valid option (in or out)', ephemeral: true });
        return;
    }

    await interaction.reply({ content: 'All users are moved', ephemeral: true });
}

async function moveIn(hostChannel: GuildChannel, shoTamChannel: GuildChannel, deTamChannel: GuildChannel, shoTamRole: Role, deTamRole: Role) {
    const usersInShoTamChannel = shoTamChannel.members as Collection<string, GuildMember>;
    usersInShoTamChannel.forEach(async (member: GuildMember) => {
        await member.voice.setChannel(hostChannel as any);
    });

    const usersInDeTamChannel = deTamChannel.members as Collection<string, GuildMember>;
    usersInDeTamChannel.forEach(async (member: GuildMember) => {
        await member.voice.setChannel(hostChannel as any);
    });
}

async function moveOut(hostChannel: GuildChannel, shoTamChannel: GuildChannel, deTamChannel: GuildChannel, shoTamRole: Role, deTamRole: Role) {
    const usersInChannel = hostChannel.members as Collection<string, GuildMember>;
    usersInChannel.forEach(async (member: GuildMember) => {
        if (member.roles.cache.has(shoTamRole.id)) {
            await member.voice.setChannel(shoTamChannel as any);
        } else if (member.roles.cache.has(deTamRole.id)) {
            await member.voice.setChannel(deTamChannel as any);
        }
    });
}

