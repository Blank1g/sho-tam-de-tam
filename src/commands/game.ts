import { CommandInteraction, SlashCommandBuilder, ComponentType, CommandInteractionOptionResolver } from "discord.js";
import { generateButtons, generateEmbeded } from "../services/game-view.service";
import { getGameRollesAndChannels, registerPlayers, removeRolesForAllUsers } from "../services/game-registration.service";

export const data = new SlashCommandBuilder()
    .setName("game")
    .setDescription("Starts a game, where all users can join and play together!")
    .addStringOption((option) => 
        option.setName('code')
        .setDescription('Set the room code for the game'));

export async function execute(interaction: CommandInteraction) {
    const roomCode = (interaction.options as CommandInteractionOptionResolver).getString('code');

    if (!roomCode) {
        await interaction.reply({ content: 'Please provide a room code', ephemeral: true });
        return;
    }
    
    if(!await getGameRollesAndChannels(interaction)) {
        return;
    }

    await removeRolesForAllUsers(interaction)

    const players = {};

    const embed = generateEmbeded();
    const buttons = generateButtons();

    const response = await interaction.reply({ components: [buttons], embeds: [embed] });
    
    const collector = response.createMessageComponentCollector({ 
        componentType: ComponentType.Button
    });

    collector.on('collect', async (colInteraction) => {
        await registerPlayers(colInteraction, players, interaction, embed, buttons);
    });
}