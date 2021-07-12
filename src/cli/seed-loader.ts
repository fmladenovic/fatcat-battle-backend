import * as dotenv from 'dotenv';

// Make sure dbConfig is imported only after dotenv.config

dotenv.config();
import { createSeedConfig } from '../config/database.config';

module.exports = createSeedConfig();
