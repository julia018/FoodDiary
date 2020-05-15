const express = require("express");
const router = express.Router();
const db = require("../db");
const fetch = require("node-fetch");
const uuid = require("uuid");
const { check, validationResult } = require('express-validator');

// Get Food for Food Page (separate quest needed for variety of item dates)
router.post("/food", (req, res) => {
  db.connect(async (err, client, release) => {
    if (err) {
      console.error("Error acquiring client", err.stack);
      return res.json(400, {errors:["Failed to get your food."]});
    }
   
    try {
    let foods = [];
    const foodsQuery = await client.query("select * from food where date = to_date($1, 'YYYYMMDD') and userId = $2 ;", [req.body.time, req.User.userId]);
    
    for(let i = 0; i < foodsQuery.rows.length; i++) {
      foods.push({id: uuid.v4(), foodName: foodsQuery.rows[i].foodname, calories: foodsQuery.rows[i].calories, fdcId: foodsQuery.rows[i].fdcId,mealType: foodsQuery.rows[i].mealtype });
    }
    release();
    return res.json({foods, calorieGoal:req.User.calorieGoal});
   } catch(e) {
       return res.json(400, {errors:["Failed to get your food."]});
   }

  });
});

// Query Search For Food
router.post("/food/searchfood/:query" ,async (req, res) => {
  if(req.params.query === "User entered nothing in the query.") {
    return res.status(422).json({ errors: ["Please enter a food name."] });
  }
  try {
    const foodQuery = await fetch(`https://api.nal.usda.gov/fdc/v1/search?api_key=${process.env.apiKey}&generalSearchInput=${req.params.query}`);
    const foodResult = await foodQuery.json();
    return res.json(foodResult);
  } catch(e) {
      return res.json(404, {errors:["Failed to find any food"]});
  }
});

// Get Food Item
router.post("/food/fooditem/:fdcId/mealtype/:mealType/date/:date", async (req, res) => {
  try {
    const foodQuery = await fetch(`https://api.nal.usda.gov/fdc/v1/${req.params.fdcId}?api_key=${process.env.apiKey}`);
    const foodResult = await foodQuery.json();

    const foodName = foodResult.description;
    const fdcId = foodResult.fdcId;
    const foodPortions = foodResult.foodPortions;
    const foodNutrients = foodResult.foodNutrients;
    
    // Init and set default values so no errors are possible on template engine init.
    let formattedFood = {
      foodName,
      fdcId,
      foodPortions: [],
      calories : 0.0,
      protein: [0.0, "g"],
      totalFat: [0.0, "g"],
      saturatedFat: [0.0, "g"],
      monoFat: [0.0, "g"],
      polyFat: [0.0, "g"],
      transFat: [0.0, "g"],
      cholesterol: [0.0, "g"],
      sodium: [0.0, "g"],
      potassium: [0.0, "g"],
      dietaryFiber: [0.0, "g"],
      sugar: [0.0, "g"],
    };
    
    // Assign nutrients to corresponding formattedFood value.
    for(const item in foodNutrients) {
      if(foodNutrients[item].nutrient.id == 1008) {//kcal - 1008
        formattedFood.calories = foodNutrients[item].amount;
      }

      if(foodNutrients[item].nutrient.id == 1003) { // total protein
        formattedFood.protein = [foodNutrients[item].amount, foodNutrients[item].nutrient.unitName];
      }

      if(foodNutrients[item].nutrient.id == 1004) { // total fat
        formattedFood.totalFat = [foodNutrients[item].amount, foodNutrients[item].nutrient.unitName];
      }

      if(foodNutrients[item].nutrient.id == 1258) {  // "Fatty acids, total saturated" 
        formattedFood.saturatedFat = [foodNutrients[item].amount, foodNutrients[item].nutrient.unitName];
      }

      if(foodNutrients[item].nutrient.id == 1292) { //"Fatty acids, total monounsaturated" - 1292
        formattedFood.monoFat =[foodNutrients[item].amount, foodNutrients[item].nutrient.unitName];

      } 

      if(foodNutrients[item].nutrient.id == 1293) { //"Fatty acids, total polyunsaturated" - 1293
        formattedFood.polyFat = [foodNutrients[item].amount, foodNutrients[item].nutrient.unitName];
      }

      if(foodNutrients[item].nutrient.id == 1257) { //"Fatty acids, total transfat - 1293
        formattedFood.transFat = [foodNutrients[item].amount, foodNutrients[item].nutrient.unitName];
      }

      if(foodNutrients[item].nutrient.id == 1253) { // Cholesterol - 1253
        formattedFood.cholesterol = [foodNutrients[item].amount, foodNutrients[item].nutrient.unitName];
      }

      if(foodNutrients[item].nutrient.id == 1093) { //"Sodium, Na" - 1093
        formattedFood.sodium = [foodNutrients[item].amount, foodNutrients[item].nutrient.unitName];
      }

      if(foodNutrients[item].nutrient.id == 1092) { //Potassium, K" - 1092
        formattedFood.potassium = [foodNutrients[item].amount, foodNutrients[item].nutrient.unitName];
      } 

      if(foodNutrients[item].nutrient.id == 1079) { //Fiber, total dietary - 1079
        formattedFood.dietaryFiber = [foodNutrients[item].amount, foodNutrients[item].nutrient.unitName];
      }

      if(foodNutrients[item].nutrient.id == 2000) { //"Sugars, total including NLEA" - 2000
        formattedFood.sugar = [foodNutrients[item].amount, foodNutrients[item].nutrient.unitName];
      }
  }

  formattedFood.foodPortions.push(["Default", 100.0]); // All default calorie measurements are calculated from the default 100g.
  
  for(const item in foodPortions) {
      if(foodPortions[item].portionDescription != "Quantity not specified") formattedFood.foodPortions.push([foodPortions[item].portionDescription, foodPortions[item].gramWeight]); 
  }
    return res.json({
      formattedFood
    });
  } catch(e) {
      return res.json(400, {errors:["Failed to get your food."]})
  }
  
  
})

// Add Food Item
router.post("/food/addfood/:fdcId/mealtype/:mealType/date/:date", [
  check("foodName").isString(),
  check("calories").isInt(),
  check("numberOfServings").isFloat(),
  check("servingSize").isInt()
],(req, res) => { 
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorArray = errors.array();
    let tmpArray = [];
    for(let i = 0; i < errorArray.length; i++ ) {
      tmpArray.push(errorArray[i].msg);
    }
    return res.status(422).json({ errors: [...tmpArray] });
  }

  try {
    db.connect(async (err, client, release) => {
      if (err) {
        console.error("Error acquiring client", err.stack);
        return res.status(422).json({ errors: ["Failed to add your food."] });
      }
      const {fdcId, mealType, date} = req.params;
      const {foodName, calories, numberOfServings, servingSize} = req.body;
      const addFoodQuery = await client.query("insert into food (userId, foodName, calories, \"fdcId\", mealType, date, numberOfServings, servingSize) values ($1, $2, $3, $4, $5, to_date($6,'YYYYMMDD'), $7, $8 );",
      [req.User.userId, foodName, parseFloat(calories), fdcId, mealType, date, parseFloat(numberOfServings), parseFloat(servingSize)]);
      release();
      return res.status(422).json({ msg: ["Added your food."] });
    });
  } catch(e) {
      return res.status(422).json({ errors: ["Failed to add your food."] });
  }

  
})

router.post("/food/editfood/:fdcId/mealtype/:mealType/date/:date/calories/:calories", (req, res) => { 
  try {
    db.connect(async (err, client, release) => {
      if (err) {
       console.error("Error acquiring client", err.stack);
        return res.status(422).json({ errors: ["Failed to get food info."] });
      }
      const {fdcId, mealType, date, calories} = req.params;
      const selectFoodQuery = await client.query("select * from food where userId = $1 and \"fdcId\" = $2 and mealType = $3 and date = to_date($4, 'YYYYMMDD') and calories = $5 limit 1;",
      [req.User.userId, parseInt(fdcId), mealType, date, parseInt(calories) ]);
      
      let food = [];

      for(let i = 0; i < selectFoodQuery.rows.length; i++) {
        food.push({calories: selectFoodQuery.rows[i].calories, servingSize:selectFoodQuery.rows[i].servingsize, numberOfServings:selectFoodQuery.rows[i].numberofservings });
      }
      release();
      return res.json(food);
    });
  }
  catch(e) {
    return res.status(422).json({ errors: ["Failed to get food info."] });
  }

})

router.put("/food/editfood/:fdcId/mealtype/:mealType/date/:date", [
  check("foodName").isString(),
  check("calories").isInt(),
  check("numberOfServings").isFloat(),
  check("servingSize").isInt(),
  check("originalCalories").isInt(),
  check("originalNumberOfServings").isNumeric(),
  check("originalServingSize").isInt()
],(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorArray = errors.array();
    let tmpArray = [];
    for(let i = 0; i < errorArray.length; i++ ) {
      tmpArray.push(errorArray[i].msg);
    }
    return res.status(422).json({ errors: [...tmpArray] });
  }

  try {
    db.connect(async (err, client, release) => {
      if (err) {
        console.error("Error acquiring client", err.stack);
        return res.status(422).json({ errors: ["Failed to update food info."] });
      }
      const {fdcId, mealType, date} = req.params;
      const {foodName, calories, numberOfServings, servingSize, originalCalories, originalNumberOfServings, originalServingSize} = req.body;
      const modifyFoodQuery = await client.query
      ("update food set calories = $1, numberOfServings = $2, servingSize = $3 where userId = $4 and date = to_date($5, 'YYYYMMDD') and calories = $6 and servingSize = $7 and numberOfServings = $8 and \"fdcId\" = $9 and mealType = $10 ;",
      [parseInt(calories), parseFloat(numberOfServings), parseInt(servingSize), req.User.userId, date, parseInt(originalCalories), parseInt(originalServingSize), parseFloat(originalNumberOfServings), parseInt(fdcId), mealType]);
      release();
      return res.json({msg: "Item edited."});
    });
 } catch(e) {
    return res.status(422).json({ errors: ["Failed to update food info."] });
 }
 
})

// Delete Food Item
router.delete(("/food/deletefood/:fdcId/mealtype/:mealType/date/:date"), [check("calories").isInt()],(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorArray = errors.array();
    let tmpArray = [];
    for(let i = 0; i < errorArray.length; i++ ) {
      tmpArray.push(errorArray[i].msg);
    }
    return res.status(422).json({ errors: [...tmpArray] });
  }
  try {
    db.connect(async (err, client, release) => {
      if (err) {
        console.error("Error acquiring client", err.stack);
        return res.status(422).json({ errors: ["Failed to delete food item."] });
      }


      const {date, mealType, fdcId} = req.params;
      const deleteFoodQuery = await client.query("delete from food where ctid in (select ctid from food where userId = $1 and date = to_date($2 ,'YYYYMMDD') and calories = $3 and mealType = $4 and \"fdcId\" = $5 limit 1);",
      [req.User.userId, date, parseFloat(req.body.calories), mealType, fdcId ]);
        release();
        return res.json({"msg": "Item Deleted."})
    });
} catch(e) {
    return res.status(422).json({ errors: ["Failed to delete food item."] });
}

});

module.exports = router;