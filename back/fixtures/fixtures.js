import * as justNeedToImportOtherwiseSequelizeDontRecognizeModelsAndRelations from '../src/model/postgres/index';

import { roles } from '../src/utils/Helpers';
import { User } from '../src/model/postgres/User.postgres';

// const adminUser = {
//     email: 'nstudio2k@gmail.com',
//     username: 'ZhenZhen',
//     password: '123123123',
//     active: true,
//     role: roles.ROLE_ADMIN,
//     shopPoints: 0,
//     lastUsernameChange: null,
// };
// create many interests
const fixtures = async function () {
    // await User.create(adminUser);
};

fixtures().then(() => {
    console.log('Fixtures created');
}).catch((err) => {
    console.log(err);
}).finally(() => {
    process.exit(0);
});
