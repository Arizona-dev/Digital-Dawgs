import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';
import { User } from '../model/index';

export async function getUser(req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect(process.env.FRONT_URL + '/login');
    }
    if (!req.user && !req.user.dataValues.email) {
      return res.json({ message: 'User not authenticated' });
    }
    const user = await User.findOne({
      where: {
        email: {
          [Op.eq]: req.user.dataValues.email,
        },
      },
    });
    user.password = undefined;
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

export async function logout(req, res) {
  req.logout();
  res.redirect('http://localhost:3000/');
}
