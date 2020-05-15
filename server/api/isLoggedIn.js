const express = require("express");
const router = express.Router();

router.post("/api/isLoggedIn", (req, res) => {
  if(req.User.userId) {
    return res.json({isLoggedIn:true});
  } else {
    return res.json({isLoggedIn:false});
  }
});

module.exports = router;