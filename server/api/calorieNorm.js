const express = require("express");
const bodyParser = require('body-parser')
const router = express.Router();
let activityCoeffs = {
    "min": 1.2,
    "small": 1.375,
    "mid": 1.46,
    "midhigh": 1.55,
    "increased": 1.64,
    "high": 1.72,
    "veryhigh": 1.9
  }

  let calorieCoeffsMale = {
    0.16:  0.15,
    0.25: 0.25,
    0.26: 0.5
  }  
  let weightCoeffs = {
    0:  0.005,
    1: 0.01,
    2: 0.02
  } 
  let calorieCoeffsFemale = {
    0.25:  0.15,
    0.34: 0.25,
    0.35: 0.5
  } 

  let fatPercentsValues = {
      female: {
        13: 13.5,
        14: 15,
        15: 16.5,
        16: 18,
        17: 19.5,
        18: 21,
        19: 22.5,
        20: 24,
        21: 25.5,
        22: 27,
        23: 28.5,
        24: 30,
        25: 31.5,
        26: 33,
        27: 34.5,
        28: 36,
        29: 37.5,
        30: 39,
        31: 40.5,
        32: 42,
        33: 43.5,
        34: 45,
        35: 46.5,
        36: 48,
        37: 49.5,
        38: 51,
        39: 52.5,
        40: 54
      },
      male: {
        16: 5,
        17: 6.5,
        18: 8,
        19: 9.5,
        20: 11,
        21: 12.5,
        22: 14,
        23: 15.5,
        24: 17,
        25: 18.5,
        26: 20,
        27: 21.5,
        28: 23,
        29: 24.5,
        30: 26,
        31: 27.5,
        32: 29,
        33: 30.5,
        34: 32,
        35: 33.5,
        36: 35,
        37: 36.5,
        38: 38,
        39: 39.5,
        40: 41
      }
  }
router.route("/calorieNorm")
router.post("/calorieNorm", (req, res) => {
    console.log("BMP");
    let body = req.body
    console.log(body)
    let height = body.height
    let weigth =  body.weight
    let activity = body.activity
    let age = body.age
    let gender = body.gender
    let goalWeight = body.goalWeight
    let IMT = countIMT(weigth, height)
    let norms = getDayCalorieNorms(weigth, height, age, activity, gender);   
    console.log("Delta " + norms.delta)
    return res.status(200).json({ "norm": norms.norm, "delta": norms.delta, "progress": norms.progress});
});


function countIMT(weight, height) {
    let IMT = weight / (height * height * 0.0001);
    console.log("IMT inside"+IMT)
    return Math.round(IMT);
}

function getDayCalorieNorms(weight, height, age, activityName, gender) {
    let activityCoeff = activityCoeffs[activityName]
    console.log("Act coeff "+activityCoeff)
    //BMR - basal metabolic rate = 9,99 * weight(kg) + 6,25 * height(cm) – 4,92 * age + adjustment
    let adjustment
    let male = true
    if (gender == "Male") {
        adjustment = 5
    } else {
        //"Female"
        adjustment = -161
        male = false
    }
    let BMR = 9.99 * weight + 6.25 * height - 4.92 * age + adjustment
    let calorieKeep = BMR * activityCoeff
    let  fatPercents = 0;
    let calorieCoeffsObject;
    console.log("weight "+weight)
    console.log("weight "+height)
    let IMT = countIMT(weight, height)
    console.log("IMT "+ IMT)
    if(male) {
        fatPercents = fatPercentsValues["male"][IMT];
        calorieCoeffsObject = calorieCoeffsMale;
    } else {
        fatPercents = fatPercentsValues["female"][IMT];
        calorieCoeffsObject = calorieCoeffsFemale;
    }
    console.log("Fat perc " + fatPercents)
    let min = 0;
    let max = 0;
    let delta = 0;
    let index = 0;
    if(fatPercents !== 0) {        
        let fatPart = fatPercents/100;
        for (let entry of Object.entries(calorieCoeffsObject)) {
            console.log("Entry "+entry)
            if( fatPart <= entry[0]) {
                delta = entry[1];
                break;
            }
            index++;
        }
    }

    //return (BMR * activityCoeff)
    let progress = weightCoeffs[index];
    console.log("Progress "+progress)
    let result = {"norm": calorieKeep, "delta": delta, "progress": progress}
    return result
}

module.exports = router;