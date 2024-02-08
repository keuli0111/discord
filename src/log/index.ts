import { ChannelType, Client, Guild, GuildBasedChannel, TextChannel } from 'discord.js';

/*  */
export class Log {
    /* 
    L1 - 길드가 존재하지 않습니다
    L2 - log, errorLog 채널이 존재하지 않습니다
    */

    private guild: Guild | undefined;
    private log: TextChannel | undefined;
    private errorLog: TextChannel | undefined;

    constructor(client: Client, guildId: string, logId: string, errorLogId: string) {
        client.once('ready', () => {
            const guild = client.guilds.cache.get(guildId);
            if (!guild) throw new Error('L1');

            const log = guild.channels.cache.get(logId); //guild.channels.cache.find((c: GuildBasedChannel) => c.id === logId);
            if (!log || log.type !== ChannelType.GuildText) throw new Error('L2');

            const errorLog = guild.channels.cache.get(errorLogId);
            if (!errorLog || errorLog.type !== ChannelType.GuildText) throw new Error('L2');

            this.guild = guild;
            this.log = log;
            this.errorLog = errorLog;
        });
    }

    public info(content: String) {
        if (!this.log) throw new Error('L2');
        this.log.send({ content: `\`\`\`${content}\`\`\`` });
    }

    public error(content: String) {
        if (!this.errorLog) throw new Error('L2');
        this.errorLog.send({ content: `\`\`\`ansi\n[0;31m឵${content}[0m឵\`\`\`` });
    }
}
