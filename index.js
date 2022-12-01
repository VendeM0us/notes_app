import app from './app.js';
import http from 'http';
import * as config from './utils/config.js';
import * as logger from './utils/logger.js';

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info('Server is running at port ', config.PORT);
});