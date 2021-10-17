const router = require("express").Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validate } = require("../model/User");

router.post("/register", async (req, res) => {
  //Validation (this is before exporting it to validation .js)
  //-------------------------------------------------------------------
  //let's validate the data before saving
  // const validation = schema.validate(req.body)
  //  res.send(validation);
  //   const { error } = schema.validate(req.body);
  //   if (error) {
  //     return res.status(400).send(error.details[0].message);
  //   }
  //-------------------------------------------------------------------

  //Validation
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //check if the user already in database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("email already exists");
  }
  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  // create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    // res.send(savedUser);
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  //let's validate the data
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //check if the user exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("email doesn't exists");
  }
  //   check if passwor is right
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).send("Invalid password !");
  }
  //create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token)
//   res.send("SUCCESS-Logged in!");
});
module.exports = router;
