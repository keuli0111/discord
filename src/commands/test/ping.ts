import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    private: false,
    type: 'test',
    async execute(interaction: CommandInteraction) {
        const embed = new EmbedBuilder()
            .setTitle('Pong!')
            .setAuthor({ name: '성공', iconURL: 'attachment://success.png' });

        await interaction.editReply({ embeds: [embed], files: ['images/success.png'] });
    },
};
