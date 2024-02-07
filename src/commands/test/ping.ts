import { SlashCommandBuilder, CommandInteraction } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
    private: false,
    type: "test",
	async execute(interaction: CommandInteraction) {
		await interaction.editReply('Pong!');
	},
};