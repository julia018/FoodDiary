const express = require("express");
const router = express.Router();
const db = require("../db");
const uuid = require("uuid");
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
 

//all signup
router.route("/signup")

router.post("/signup",[

  check("email").isEmail({min: 6, max:60}).withMessage("Email must be a minium length of 6 chars and a max of 60 chars."),
  check("password").isLength({min:6, max:50}).withMessage("Password must be a minium length of 6 chars and a max of 50 chars."),
  check("firstName").isString(),
  check("lastName").isString(),
  check("genderSelected").isString(),
  check("age").isInt().withMessage("Age must be an Integer"),
  check("weight").isNumeric().toFloat().withMessage("Weight must be a Number."),
  check("goalWeight").isNumeric().toFloat().withMessage("Goal Weight must be a Number."),
  check("calorieGoal").isInt().withMessage("Calorie Goal must be a Integer"),
], (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorArray = errors.array();
    let tmpArray = [];
    for(let i = 0; i < errorArray.length; i++ ) {
      tmpArray.push(errorArray[i].msg);
    }
    console.log(errors)
    return res.status(422).json({ errors: [...tmpArray] });
  }

  try {
  db.connect(async (err, client, release) => {
    if (err) {
      console.error("Error acquiring client", err.stack);
      return res.status(422).json({ errors: ["Unexpected error occurred. Please try again."] });
    }
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    let day = new Date().getDate();
    if(month < 9) { month = "0" + (month + 1).toString(); } else {month = (month+1).toString();}
    if(day < 10) { day = "0" + (day).toString() } else {day = day.toString()};
    const date = `${year}${month}${day}`;
    const {email, firstName, lastName, genderSelected, age, weight, goalWeight, calorieGoal} = req.body;

    const {rows} = await client.query("select email from \"user\" where email = $1 ;", [email]);
    if(rows.length >= 1) { release(); return res.status(422).json({ errors: ["Email already exists."] }); }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const userId = uuid.v4();

    await client.query(
      "insert into \"user\" (userId, first_name, last_name, email, password, gender, age, goalWeight, dateJoined, calorieGoal) values ($1, $2, $3, $4, $5, $6, $7, $8, to_date($9,'YYYYMMDD'), $10);", 
      [userId, firstName, lastName, email, hash, genderSelected, parseInt(age), parseFloat(goalWeight), date, parseFloat(calorieGoal) ]);

    await client.query(
      "insert into weight (userId, weight, date) values ($1, $2, to_date($3,'YYYYMMDD'));",
       [userId, parseFloat(weight), date]);

      release();
      req.User.userId = userId;
      req.User.gender = genderSelected;
      req.User.firstName = firstName;
      req.User.goalWeight = parseFloat(goalWeight);
      req.User.calorieGoal = parseFloat(calorieGoal);
      return res.json({msg: "Sign up completed."});
  });
} catch(e) {
  console.error(e);
  return res.status(422).json({ errors: ["Unexpected error occurred. Please try again."] });
}

});

module.exports = router;