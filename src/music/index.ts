import { VoiceConnection, joinVoiceChannel } from '@discordjs/voice';
import { Channel } from 'diagnostics_channel';
import { ChannelType, Client, Guild, GuildBasedChannel, VoiceChannel } from 'discord.js';

export class Music {
    /*
    Error Code
    M1 - 길드가 존재하지 않아요
    M2 - 채널이 존재하지 않아요
    M3 - 봇이 음성 채널에 들어가 있지 않아요
    */

    private client: Client;
    private guild: Guild;
    private channel: VoiceChannel | undefined;
    private connection: VoiceConnection | undefined;

    constructor(client: Client, guildId: string) {
        this.client = client;
        //channelId: string
        //
        const guild: Guild | undefined = this.client.guilds.cache.get(guildId);
        if (!guild) throw new Error('M1');

        this.guild = guild;

        // const channel: GuildBasedChannel | undefined = guild.channels.cache.get(channelId);
        // if (!channel || channel.type !== ChannelType.GuildVoice) throw new Error('M2');
    }

    public connect(channelId: string) {
        const channel: GuildBasedChannel | undefined = this.guild.channels.cache.get(channelId);
        if (!channel || channel.type !== ChannelType.GuildVoice) throw new Error('M2');

        this.channel = channel
        this.connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
    }

    public disconnect() {
        if (!this.channel) throw new Error('M2');
        if (!this.connection) throw new Error('M3');

        this.connection.disconnect();
        this.connection.destroy();

        this.channel, (this.connection = undefined);
    }
}
