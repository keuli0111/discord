import { Client, Events } from 'discord.js';
import { Log } from '../log';

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(log: Log, client: Client) {
        log.info(`봇이 ${client.user?.tag} 계정으로 로그인했어요!`);
    },
};
