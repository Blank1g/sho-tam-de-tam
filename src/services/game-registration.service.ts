import { ButtonInteraction, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, GuildMemberRoleManager, User, Guild, GuildChannel, Role } from "discord.js";
import { generateEmbeded } from "./game-view.service";

export async function removeRolesForAllUsers(interaction: CommandInteraction) {
    const guild = interaction.guild;
    const allMembers = guild?.members.cache;
    
    const roles = await getGameRollesAndChannels(interaction);

    if (!roles) {
        return;
    }

    allMembers?.forEach(async (member) => {
        if (member.roles.cache.has(roles.hostRole.id)) {
            await member.roles.remove(roles.hostRole);
        } else if (member.roles.cache.has(roles.shoTamRole.id)) {
            await member.roles.remove(roles.shoTamRole);
        } else if (member.roles.cache.has(roles.deTamRole.id)) {
            await member.roles.remove(roles.deTamRole);
        }
    });
}

export async function getGameRollesAndChannels(interaction: CommandInteraction): Promise<{ hostRole: Role, shoTamRole: Role, deTamRole: Role, hostChannel: GuildChannel, shoTamChannel: GuildChannel, deTamChannel: GuildChannel } | null>{
    const guild = interaction.guild;
    const hostChannel = guild?.channels.cache.find(channel => channel.name === 'Sho Tam? De Tam?') as GuildChannel;
    const shoTamChannel = guild?.channels.cache.find(channel => channel.name === 'Sho Tam?') as GuildChannel;
    const deTamChannel = guild?.channels.cache.find(channel => channel.name === 'De Tam?') as GuildChannel;

    const hostRole = guild?.roles.cache.find(role => role.name === 'SHOTAMDETAM');
    const shoTamRole = guild?.roles.cache.find(role => role.name === 'SHOTAM');
    const deTamRole = guild?.roles.cache.find(role => role.name === 'DETAM');

    if (!hostChannel || !shoTamChannel || !deTamChannel || !hostRole || !shoTamRole || !deTamRole) {
        await interaction.reply({ content: 'Voice channels or roles not found, try to `/init` settings again', ephemeral: true });
        return null;
    }

    return { hostChannel, shoTamChannel, deTamChannel, shoTamRole, deTamRole, hostRole };

}

export async function registerPlayers(colInteraction: ButtonInteraction, players: any, interaction: CommandInteraction, embed: EmbedBuilder, row: ActionRowBuilder<ButtonBuilder>) {
    const guild = colInteraction.guild;
    const member = colInteraction.member;
    const user = colInteraction.user;
    const roles = member?.roles as GuildMemberRoleManager;
    let alreadyMessage!: string;
    let roleName!: string;
    let joinMessage!: string;

    if (colInteraction.customId === 'host') {
        alreadyMessage = 'You are already a host';
        roleName = 'SHOTAMDETAM';
        joinMessage = 'Joined as a host';
    }

    if (colInteraction.customId === 'sho_tam') {
        alreadyMessage = 'You are already in the Sho Tam team';
        roleName = 'SHOTAM';
        joinMessage = 'Joined to Sho Tam team';
    }

    if (colInteraction.customId === 'de_tam') {
        alreadyMessage = 'You are already in the De Tam team';
        roleName = 'DETAM';
        joinMessage = 'Joined to De Tam team';
    }

    await addToTeam(roleName, alreadyMessage, joinMessage, guild, colInteraction, roles, players, user, embed, interaction, row)
}

async function addToTeam(roleName: string, alreadyMessage: string, joinMessage: string, guild: Guild | null, colInteraction: ButtonInteraction, roles: GuildMemberRoleManager, players: any, user: User, embed: EmbedBuilder, interaction: CommandInteraction, row: ActionRowBuilder<ButtonBuilder>) {

    const role = guild?.roles.cache.find(role => role.name === roleName);
    if (!role) {
        colInteraction.reply({ content: `${roleName} role not found`, ephemeral: true });
    } else {
        const hasRole = roles.cache.has(role.id);
        if (hasRole) {
            colInteraction.reply({ content: alreadyMessage, ephemeral: true });
        } else {
            roles.add(role).then(async () => {
                await changeRoles(players, colInteraction.customId, user, roles, colInteraction)
                await colInteraction.reply({ content: joinMessage, ephemeral: true });
                await interaction.editReply({ components: [row], embeds: [generateEmbeded(embed, players)] })
            }).catch(async () => {
                await colInteraction.reply({ content: 'I have no permission to change roles, try to additional Admin role for me', ephemeral: true });
            });
        }
    }

}

async function changeRoles(players: any, role: string, user: User, roles: GuildMemberRoleManager, colInteraction: ButtonInteraction) {

    if (role === 'host' && players.host && players.host.id) {
        await colInteraction.reply({ content: 'Host is already exist', ephemeral: true });
        return false;
    }
    
    removePlayer(user, players);

    if (role === 'host') {
        players.host = user;
    } else { 
        if (players[role] && players[role].team) {
            players[role].team.push(user);
        } else {
            players[role] = { team: [user] };
        }
    }



    const rolesToRemove = roles.cache.filter(role => role.name === 'SHOTAM' || role.name === 'DETAM' || role.name === 'SHOTAMDETAM');
    
    rolesToRemove.forEach(async (role) => {
        if (role) {
            await roles.remove(role);
        }
    });

    return true;
}

function removePlayer(user: User, players: any) {

    if (players.host && players.host.id === user.id) {
        delete players.host;
    }

    if (players.sho_tam && players.sho_tam.team) {
        const index = players.sho_tam.team.findIndex((player: User) => player.id === user.id);
        if (index !== -1) {
            players.sho_tam.team.splice(index, 1);
        }
    }

    if (players.de_tam && players.de_tam.team) {
        const index = players.de_tam.team.findIndex((player: User) => player.id === user.id);
        if (index !== -1) {
            players.de_tam.team.splice(index, 1);
        }
    }
}