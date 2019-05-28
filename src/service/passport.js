import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import constants from '../config/constants';
import Employee from '../module/employee/employee.model';
import Admin from '../module/admin/admin.model';

const localOpts = {
  usernameField: 'username',
};
const localStrategy = new LocalStrategy(localOpts, async (username, password, done) => {
  try {
    let user = await Employee.findOne({ username, isRemoved: false });
    user = (!user) ? await Admin.findOne({ username, isRemoved: false }) : user;

    if (!user) {
      return done(null, false);
    } else if (!user.validatePassword(password)) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});
passport.use(localStrategy);

//------------------------------------

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromHeader('token'),
  ]),
  secretOrKey: constants.JWT_SECRET,
};

const jwtStrategy = new JWTStrategy(jwtOpts, async (payload, done) => {
  try {
    const user = (payload.role) ?  await Employee.findOne({ _id: payload._id, isRemoved: false }) :
      await Admin.findOne({ _id: payload._id, isRemoved: false });
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

passport.use(jwtStrategy);

export const authLocal = passport.authenticate('local', { session: false });
export const authJwt = passport.authenticate('jwt', { session: false });
