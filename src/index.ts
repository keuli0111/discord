import { token, guildId, clientId, logId, errorLogId } from './config.json';
import { CLIENT } from './client';

new CLIENT(token, guildId, clientId, logId, errorLogId);