const router = require("express").Router();
const User = require("../model/User");
const { registerValidation } = require("../validation");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  //Validation (this is before exporting it to validation .js)
  //-------------------------------------------------------------------
  //let's validate the data befor saving
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
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
