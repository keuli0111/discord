import { Client, Collection, Events, GatewayIntentBits, Interaction, REST, Routes } from 'discord.js';
import * as path from 'path';
import { readdirSync } from 'fs';

export class CLIENT extends Client {
    public commands = new Collection();

    constructor(token: string, guildId: string, clientId: string, logId: string, errorLogId: string) {
        super({ intents: [GatewayIntentBits.Guilds] });

        /* Command Handling */
        let guild = [];
        let global = [];

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
                } else {
                    console.log('올바르지 않은 command가 존재해요. commands 폴더를 확인해주세요');
                }
            }
        }

        /* Slash Command Deploy */
        // Construct and prepare an instance of the REST module
        const rest = new REST().setToken(token);

        // and deploy your commands!
        (async () => {
            try {
                // The put method is used to fully refresh all commands in the guild with the current set
                let d: any = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: guild });
                console.log(`${d.length} 만큼의 길드 커맨드 등록을 완료했어요!`);

                d = await rest.put(Routes.applicationCommands(clientId), { body: global });
                console.log(`${d.length} 만큼의 공용 커맨드 등록을 완료했어요!`);
            } catch (error) {
                // And of course, make sure you catch and log any errors!
                console.error(error);
            }
        })();

        /* Event Handling */
        const eventsPath = path.join(__dirname, '..', 'events');
        const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.ts'));

        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            if (event.once) {
                this.once(event.name, (...args) => event.execute(...args));
            } else {
                this.on(event.name, (...args) => event.execute(...args));
            }
        }

        /* InteractionCreate Event Handling */
        this.on(Events.InteractionCreate, async (interaction: Interaction) => {
            if (!interaction.isCommand()) return;

            const command: any = this.commands.get(interaction.commandName);

            if (!command) {
                console.error(`${interaction.commandName}의 핸들을 만들지 않았어요!`);
                return;
            }

            await interaction.deferReply({});
            //await interaction.deferReply({ ephemeral: true });

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);

                await interaction.editReply({ content: '핸들링하지 않은 오류가 발생했어요!' });
            }
        });
    }
}
