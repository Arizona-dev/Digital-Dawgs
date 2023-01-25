import { connection } from './model/index';

connection
    .sync({
        force: false,
    })
    .then(() => {
        console.log('Database synced');
        connection.close();
    }).finally(() => {
        process.exit(0);
    });
