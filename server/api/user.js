const express = require("express");
const router = express.Router();
const db = require("../db");
const { check, validationResult } = require('express-validator');

router.post("/user/settings", (req, res) => {
  db.connect( async (err, client, release) => {
    
    try {
      if (err) { console.error("Error acquiring client", err.stack); return res.json(400, {errors:["Failed to get your settings."]}); }
      const dataRow = await client.query("select email, last_name from \"user\" where \"user\".userId = $1 limit 1;", [req.User.userId] );
      const email = dataRow.rows[0].email;
      const lastName = dataRow.rows[0].last_name;
      release();
      return res.json({lastName,email, firstName:req.User.firstName, calorieGoal:req.User.calorieGoal, weightGoal:req.User.goalWeight});
    }
    catch(e) {
      console.log(e.message);
      return res.json(400, {errors:["Failed to get your settings."]});
    }

  });
});

router.post("/user/settings/update", [
  check("goalWeight").isNumeric().toFloat().withMessage("Goal Weight must be a Number."),
  check("calorieGoal").isNumeric().toInt().withMessage("Calorie Goal must be a Integer"),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorArray = errors.array();
    let tmpArray = [];
    for(let i = 0; i < errorArray.length; i++ ) {
      tmpArray.push(errorArray[i].msg);
    }
    return res.status(422).json({ errors: [...tmpArray] });
  }
  
  db.connect( async (err, client, release) => {
    const {goalWeight, calorieGoal} = req.body;
    if (err) { console.error("Error acquiring client", err.stack);  return res.json(400, {errors:["Failed to update your settings."]});}
    try {
      await client.query("update \"user\" set goalWeight = $1, calorieGoal = $2 where userId = $3 ;", [parseFloat(goalWeight), parseFloat(calorieGoal), req.User.userId] );
      req.User.goalWeight = parseFloat(goalWeight);
      req.User.calorieGoal = parseFloat(calorieGoal);
      release();
      return res.json({msg: "Success"});
    } catch(e) {
        console.error(e.message);
        return res.json(400, {errors:["Failed to update your settings."]});
    }

  });
});

router.post("/user/logout", (req, res) => {
  req.User = {};
  res.clearCookie("User");
  return res.redirect("/");
});

module.exports = router;