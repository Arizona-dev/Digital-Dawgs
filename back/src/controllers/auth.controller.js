/* eslint-disable no-param-reassign */
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User } from '../model/index';
import passport from 'passport';

export async function googleAuth(req, res) {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
}

export async function googleAuthCallback(req, res, next) {
  passport.authenticate('google', {
    successRedirect: '/api/auth/success',
    failureRedirect: '/api/auth/failed',
  })(req, res, next);
}

export async function authSuccess(req, res) {
  try {
    const user = await User.findOne({
      where: {
        email: {
          [Op.eq]: req.user.emails[0].value,
        },
      },
    });

    if (!user) {
      const email = req.user.emails[0].value;
      const username = req.user.displayName;
      const avatar = req.user.photos[0].value;
      const googleId = req.user.id;
      const active = true;

      user = await User.create({
        email,
        username,
        avatar,
        googleId,
        active,
        role: 'ROLE_USER',
      });
    }
    jwt.sign(
      { user: { ...user } },
      process.env.JWT_SECRET,
      { expiresIn: "3h" },
      (err, token) => {
        if (err) {
          return res.redirect('http://localhost:3000/login');
        }
        res.redirect(`http://localhost:3000/login?token=${token}`);
      }
    );
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

export async function authFailed(req, res) {
  res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not authenticated' });
}
