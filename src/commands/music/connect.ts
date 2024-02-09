import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, Collection, Embed } from 'discord.js';
import { Music } from '../../music';

module.exports = {
    data: new SlashCommandBuilder().setName('연결').setDescription('봇을 음성 채널로 초대해요!'),
    private: false,
    type: 'music',
    async execute(music: Music, interaction: CommandInteraction) {
        const guild = interaction.guild;
        if (guild) {
            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (member) {
                if (member.voice && member.voice.channelId) {
                    try {
                        music.connect(member.voice.channelId);

                        const embed = new EmbedBuilder()
                            .setTitle('보이스 채널 입장 완료!')
                            .setAuthor({ name: '성공', iconURL: 'attachment://success.png' });

                        await interaction.editReply({ embeds: [embed], files: ['images/success.png'] });
                    } catch (error) {
                        const err = String(error);
                        let embed: EmbedBuilder | undefined;

                        if (err.includes('M2')) {
                            embed = new EmbedBuilder()
                                .setTitle('Error Code: M2')
                                .setDescription('음성 채널이 존재하지 않아요..')
                                .setAuthor({ name: '실패', iconURL: 'attachment://failure.png' });
                        } // } else if (err.includes('M3')) {
                        //     embed = new EmbedBuilder()
                        //         .setTitle('Error Code: M3')
                        //         .setDescription('봇이 음성 채널에 없어요..')
                        //         .setAuthor({ name: '실패', iconURL: 'attachment://failure.png' });
                        // }

                        if (embed) await interaction.editReply({ embeds: [embed], files: ['images/failure.png'] });
                    }
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle('Error Code: MC3')
                        .setDescription('음성 채널에 들어가 있지 않아요..')
                        .setAuthor({ name: '실패', iconURL: 'attachment://failure.png' });

                    await interaction.editReply({ embeds: [embed], files: ['images/failure.png'] });
                }
            } else {
                const embed = new EmbedBuilder()
                    .setTitle('Error Code: MC2')
                    .setDescription('유저 정보가 존재하지 않아요... 버그가 발생한 거 같아요..')
                    .setAuthor({ name: '실패', iconURL: 'attachment://failure.png' });

                await interaction.editReply({ embeds: [embed], files: ['images/failure.png'] });
            }
        } else {
            const embed = new EmbedBuilder()
                .setTitle('Error Code: MC1')
                .setDescription('길드에서만 사용가능한 메시지에요')
                .setAuthor({ name: '실패', iconURL: 'attachment://failure.png' });

            await interaction.editReply({ embeds: [embed], files: ['images/failure.png'] });
        }
    },
};
