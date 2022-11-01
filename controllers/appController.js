const bcrypt = require("bcryptjs");

const User = require("../models/User");

exports.landing_page = (req, res) => {
  res.render("landing");
};

//----------------------------verify
exports.verify_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("verify", { err: error });
};
/*---------*/

exports.verify_post = async (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'youremail@address.com',
           pass: 'yourpassword'
       }
   });
   const mailOptions = {
     from: 'sender@email.com', // sender address
     to: 'faresnaoui2@gmail.com', // list of receivers
     subject: 'Subject of your email', // Subject line
     html: '<p>Your html lkjlkjlkmljlhere</p>'// plain text body
   };
   transporter.sendMail(mailOptions, function (err, info) {
      if(err)
        console.log(err)
      else
        console.log(info);
   });
};


/*------------*/



exports.login_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("login", { err: error });
};

exports.login_post = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    req.session.error = "Invalid Credentials";
    return res.redirect("/login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    req.session.error = "Invalid Credentials";
    return res.redirect("/login");
  }

  req.session.isAuth = true;
  req.session.username = user.username;
  res.redirect("/dashboard");
};

exports.register_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("signup", { err: error });
};

exports.register_post = async (req, res) => {
  const { username, password ,confirm_password} = req.body;

  let user = await User.findOne({ username });

  if (user) {
    req.session.error = "User already exists";
    return res.redirect("/signup");
  }
  if(password!=confirm_password){
    req.session.error = "Check password";
    return res.redirect("/signup");

  }
  const hasdPsw = await bcrypt.hash(password, 12);

  user = new User({
    username,
    password: hasdPsw,
  });

  await user.save();
  res.redirect("/login");
};

exports.dashboard_get = (req, res) => {
  const username = req.session.username;
  res.render("dashboard", { name: username });
};

exports.logout_post = (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
};
