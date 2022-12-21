import app from './app.js';
import http from 'http';
import * as config from './utils/config.js';

const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log('Server is listening at port ', config.PORT);
});