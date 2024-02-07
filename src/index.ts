import { token, guildId, clientId, logId, errorLogId } from './config.json';
import { CLIENT } from './client';

const client = new CLIENT(token, guildId, clientId, logId, errorLogId);
client.login(token)