import { Client, Collection, EmbedBuilder, Events, GatewayIntentBits, Interaction, REST, Routes } from 'discord.js';
import * as path from 'path';
import { readdirSync } from 'fs';
import { Log } from '../log';
import { Music } from '../music';

export class CLIENT extends Client {
    public commands = new Collection();
    public musics = new Collection();
    public log: Log | undefined;

    constructor(token: string, guildId: string, clientId: string, logId: string, errorLogId: string) {
        super({ intents: [GatewayIntentBits.Guilds] });

        this.login(token).then(() => {
            this.log = new Log(this, guildId, logId, errorLogId);

            /* Command Handling */
            let guild = [];
            let global: any[] = [];

            const foldersPath = path.join(__dirname, '..', 'commands');
            const commandFolders = readdirSync(foldersPath);

            for (const folder of commandFolders) {
                const commandsPath = path.join(foldersPath, folder);
                const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));
                for (const file of commandFiles) {
                    const filePath = path.join(commandsPath, file);
                    const command = require(filePath);
                    // 구조 검증
                    if ('data' in command && 'private' in command && 'type' in command && 'execute' in command) {
                        if (command.private) guild.push(command.data.toJSON());
                        else global.push(command.data.toJSON());
                        this.commands.set(command.data.name, command);
                    } else this.log.error('올바르지 않은 command가 존재해요. commands 폴더를 확인해주세요');
                    //console.log('올바르지 않은 command가 존재해요. commands 폴더를 확인해주세요');
                }
            }

            /* Slash Command Deploy */
            // Construct and prepare an instance of the REST module
            const rest = new REST().setToken(token);
            try {
                rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: guild }).then(
                    (guildCommands: any) => {
                        this.log?.info(`${guildCommands.length}만큼의 길드 커맨드 등록을 완료했어요!`);
                        rest.put(Routes.applicationCommands(clientId), { body: global }).then((globlaCommands: any) => {
                            this.log?.info(`${globlaCommands.length}만큼의 공용 커맨드 등록을 완료했어요!`);
                        });
                    }
                );
            } catch (error) {
                this.log.error(String(error));
            }

            /* Event Handling */
            const eventsPath = path.join(__dirname, '..', 'events');
            const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.ts'));

            for (const file of eventFiles) {
                const filePath = path.join(eventsPath, file);
                const event = require(filePath);
                if (event.once) {
                    this.once(event.name, (...args) => event.execute(this.log, ...args));
                } else {
                    this.on(event.name, (...args) => event.execute(this.log, ...args));
                }
            }

            /* InteractionCreate Event Handling */
            this.on(Events.InteractionCreate, async (interaction: Interaction) => {
                if (!interaction.isCommand()) return;

                const command: any = this.commands.get(interaction.commandName);
                if (!command) {
                    this.log?.error(`${interaction.commandName}의 핸들을 만들지 않았어요!`);
                    return;
                }

                this.log?.info(
                    `(${interaction.guild?.name}) ${interaction.user.globalName} - /${interaction.commandName}`
                );
                await interaction.deferReply({});
                //await interaction.deferReply({ ephemeral: true });

                try {
                    switch (command.type) {
                        case 'test':
                            await command.execute(interaction);
                        case 'music':
                            const music = this.musics.get(interaction.guildId);
                            if (music) await command.execute(music, interaction);
                            else {
                                const music = new Music(this, interaction.guildId!);
                                this.musics.set(interaction.guildId, music);

                                await command.execute(music, interaction);
                            }
                    }
                } catch (error) {
                    this.log?.error(String(error));

                    const embed = new EmbedBuilder()
                        .setTitle('Error Code: xxx')
                        .setAuthor({ name: '실패', iconURL: 'attachment://failure.png' });

                    await interaction.editReply({ embeds: [embed], files: ['images/failure.png'] });
                }
            });
        });
    }
}
