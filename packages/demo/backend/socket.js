process.env['CALLBACK_URL'] = 'http://localhost:4000/sync';
process.env['CALLBACK_OBJECTS'] = JSON.stringify({ excel: 'Map' });

// @ts-ignore
require('./node_modules/@y/websocket-server/dist/server.cjs');
