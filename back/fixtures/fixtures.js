import * as justNeedToImportOtherwiseSequelizeDontRecognizeModelsAndRelations from '../src/model/index';
import { Room } from '../src/model/index';

const rooms = [
    {
        title: 'Room 1',
        description: 'Room 1 description',
        maxParticipants: 10,
        closed: false,
    },
    {
        title: 'Room 2',
        description: 'Room 2 description',
        maxParticipants: 10,
        closed: false,
    },
    {
        title: 'Room 3',
        description: 'Room 3 description',
        maxParticipants: 10,
        closed: true,
    },
];

const fixtures = async function () {
    await Room.bulkCreate(rooms);
};

fixtures().then(() => {
    console.log('Fixtures created');
}).catch((err) => {
    console.log(err);
}).finally(() => {
    process.exit(0);
});
