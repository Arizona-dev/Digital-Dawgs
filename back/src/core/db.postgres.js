import Sequelize from 'sequelize';

const config = process.env.NODE_ENV === 'development' ? {
    newUrlParser: true,
} : {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
};

const connection = new Sequelize(process.env.DATABASE_URL, config);

connection.authenticate().then(() => {
    console.log('Postgres (with sequelize) connection open.');
}).catch((err) => {
    console.error(`Unable to connect to the database >> ${process.env.DATABASE_URL}:`, err);
});

export { connection };
