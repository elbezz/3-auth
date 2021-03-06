const router = require("express").Router();
const User = require("../model/User");

//Validation
const Joi = require('@hapi/joi')
const schema = Joi.object({
  name: Joi.string().min(6).required(),
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  password: Joi.string().min(6).required(),
});

router.post("/register", async (req, res) => {

    //let's validate the data befor saving
    // const validation = schema.validate(req.body)
    //  res.send(validation);
    const {error} = schema.validate(req.body);
    if(error){
return res.status(400).send(error.details[0].message)
    }
 
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try{
const savedUser = await user.save()
res.send(savedUser)
  }catch(err){
      res.status(400).send(err)
  }
});

module.exports = router;
