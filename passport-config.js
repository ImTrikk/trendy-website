import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";

LocalStrategy.Strategy

function initialize(passport, getUserByUsername, getUserById) {
  
  //function to authenticate users
  const authenticateUsers = async (username, password, done) => {

    //get user by email
    const user = getUserByUsername(username);
    if (user == null) {
      return done(null, false, { message: "No user found with that username" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password Incorrect" });
      }
    } catch (e) {
      console.log(e);
      return done(e);
    }
  };
  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUsers));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
}

export default initialize
