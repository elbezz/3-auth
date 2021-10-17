const router = require("express").Router();
const verifyToken = require('../verifyToken')
router.get('/',verifyToken,(req,res)=>{
    // res.json({posts:{title:'my first post', desc:'random data'}})
    res.send(req.user)
})
module.exports = router;