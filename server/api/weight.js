const express = require("express");
const router = express.Router();
const db = require("../db");
const { check, validationResult } = require('express-validator');

router.route("/weight")
  .post((req, res) => {

    db.connect(async (err, client, release) => {
      if (err) {
        console.error("Error acquiring client", err.stack);
        return res.json(400, { errors: ["Failed to find your weight."] })
      }
      try {
        const { rows } = await client.query("select weight from weight where weight.userId = $1 order by weight.date desc limit 1;", [req.User.userId]);
        const currentWeight = rows[0].weight;
        release();
        return res.json({ currentWeight, gender: req.User.gender, goalWeight: req.User.goalWeight });
      } catch (e) {
        console.error(e);
        return res.json(400, { errors: ["Failed to find your weight."] })
      }

    });
  });

router.post("/weight/date/:date", [
  check("weight").isNumeric().toFloat().withMessage("Weight must be a Number."),
], (req, res) => {


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  db.connect(async (err, client, release) => {
    if (err) {
      console.error("Error acquiring client", err.stack);
      return res.json(400, { errors: ["Failed to update your weight."] })
    }

    try {
      const { date } = req.params;
      const { userId } = req.User;
      const { rows } = await client.query("select date from weight where date = to_date($1,'YYYYMMDD') and weight.userId = $2;", [date, userId]);
      if (rows.length > 0) {
        await client.query("delete from weight where date = to_date($1,'YYYYMMDD') and weight.userId = $2 ;", [date, userId]);
      }
      await client.query("insert into weight(userId, weight, date) values ($1, $2, to_date($3,'YYYYMMDD') );", [userId, req.body.weight, date]);
      release();
      return res.status(200).json({ msg: "Weight updated." });
    } catch (e) {
      return res.json(400, { errors: ["Failed to update your weight."] })
    }

  });
});

module.exports = router;