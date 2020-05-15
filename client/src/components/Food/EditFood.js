import React from "react";
import "../../static/styles/fooditem.css";
import { CircularProgressbar } from 'react-circular-progressbar';
import {Link} from "react-router-dom";
import submitForm from "../../helpers/Form";

class EditFood extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date : "20200204",
      calories:1200,
      cholesterol : [ 0, "mg" ],
      dietaryFiber: [ 0, "mg"],
      fdcId: 170456,
      foodName: "Tomatoes, green, raw",
      foodPortions : [ 0, "mg" ],
      monoFat : [ 0.03, "g" ],
      polyFat : [ 0.081, "g" ],
      potassium : [ 204, "mg" ],
      protein : [ 1.2, "g" ],
      saturatedFat : [ 0.028, "g" ],
      sodium : [ 13, "mg" ],
      sugar :[ 0, "mg"],
      totalFat : [ 0, "mg"],
      transFat : [ 0, "mg"],
      servingSize :100,
      numberOfServings : 1
    };

    this.nutrientAmounts = {nutrientAmounts:[]};
    this.calorieBasis = {calorieBasis:120};
    this.servingSizeBasis = {servingSizeBasis:100};
    this.originalCaloriesSent = 0;
    this.originalNumberOfServingsSent = 0;
    this.originalServingSizeSent = 0;
  }

  async componentDidMount() {
    await this.getFood(); // Get food info for a basis.
    await this.getFoodToEdit(); // Get their food data and update it to reflect their food.
  }

  updateFoodValues = async () => {

    await this.setState({
      calories: Math.round( (this.calorieBasis.calorieBasis * (this.state.servingSize / 100) * this.state.numberOfServings) )
    });

    const formula = parseFloat((this.state.servingSize / 100) * this.state.numberOfServings).toFixed(2);
    const nutrientAmount = this.nutrientAmounts.nutrientAmounts;

    await this.setState({
      cholesterol: [nutrientAmount[0][0] * formula, nutrientAmount[0][1]],
      dietaryFiber: [nutrientAmount[1][0] * formula, nutrientAmount[1][1]],
      monoFat: [nutrientAmount[2][0] * formula, nutrientAmount[2][1] ] ,
      polyFat: [nutrientAmount[3][0] * formula, nutrientAmount[3][1] ],
      potassium: [nutrientAmount[4][0] * formula, nutrientAmount[4][1] ],
      protein: [nutrientAmount[5][0] * formula, nutrientAmount[5][1] ],
      saturatedFat: [nutrientAmount[6][0] * formula, nutrientAmount[6][1] ],
      sodium: [nutrientAmount[7][0] * formula, nutrientAmount[7][1] ],
      sugar: [nutrientAmount[8][0] * formula, nutrientAmount[8][1] ],
      totalFat: [nutrientAmount[9][0] * formula, nutrientAmount[9][1] ],
      transFat: [nutrientAmount[10][0] * formula, nutrientAmount[10][1] ]
    });
  }

  /*
    @name getFood,
    @type Function : Void,
    @description : Get users extended food info from FoodCentral API.
 */
  getFood = async () => {
    await submitForm(
      undefined,
      "POST",
      `/food/fooditem/${this.props.match.params.fdcId}/mealtype/${this.props.match.params.mealType}/date/${this.props.match.params.date}`,
      { 'Content-Type': 'application/json' },
      false,
      "/",
      this.props.history,
      {},
      this.props.updateErrors,
      async (res) => {
        const food = await res;
        const {
          calories,
          cholesterol,
          dietaryFiber,
          fdcId,
          foodName,
          foodPortions,
          monoFat,
          polyFat,
          potassium,
          protein,
          saturatedFat,
          sodium,
          sugar,
          totalFat,
          transFat
        } = food.formattedFood;

        this.calorieBasis = { calorieBasis: Math.round(calories) };
        this.servingSizeBasis = { servingSizeBasis: 100 };

        await this.setState({
          calories: Math.round(calories),
          cholesterol,
          dietaryFiber,
          fdcId,
          foodName,
          foodPortions,
          monoFat,
          polyFat,
          potassium,
          protein,
          saturatedFat,
          sodium,
          sugar,
          totalFat,
          transFat
        });

        this.nutrientAmounts = {nutrientAmounts:[
            cholesterol,
            dietaryFiber,
            monoFat,
            polyFat,
            potassium,
            protein,
            saturatedFat,
            sodium,
            sugar,
            totalFat,
            transFat
          ]};

      });

  }

  /*
    @name getFoodToEdit,
    @type Function : Void,
    @description : Get users food that needs to be edited. Updates all corresponding state.
 */
  getFoodToEdit = async () => {

    await submitForm(
      undefined,
      "POST",
      `/food/editfood/${this.props.match.params.fdcId}/mealtype/${this.props.match.params.mealType}/date/${this.props.match.params.date}/calories/${this.props.match.params.calories}`,
      { 'Content-Type': 'application/json'},
      false,
      "/",
      this.props.history,
      {},
      this.props.updateErrors,
      async (res) => {
        const food = await res;
        const originalCalories = food[0].calories;
        const originalServingSize = food[0].servingSize;
        const originalNumberOfServings = food[0].numberOfServings;

        this.originalCaloriesSent = food[0].calories;
        this.originalNumberOfServingsSent = food[0].numberOfServings;
        this.originalServingSizeSent = food[0].servingSize;

        await this.setState( {
          calories: Math.round(originalCalories),
          servingSize: originalServingSize,
          numberOfServings: originalNumberOfServings
        });
        await this.updateFoodValues();
      }
    )
  }

  /*
    @name numberOfServingsOnChange,
    @type Function : Void,
    @description : update number of servings state and update state that should be effected by this update.
 */
  numberOfServingsOnChange = async (e) => {
    await this.setState({numberOfServings: parseFloat(e.target.value)});
    await this.updateFoodValues();
  }

  /*
     @name servingSizeAmountOnChange,
     @type Function : Void,
     @description : update serving size amount state and update state that should be effected by this update.
  */
  servingSizeAmountOnChange = async (e) => {
    await this.setState({
      numberOfServings: 1,
      servingSize: parseInt(e.target.value)
    });
    await this.updateFoodValues();
  }

  render() {
    return(
      <main id="container" className=" mealType">

        <div id="addFoodContainer" className={this.state.fdcId}>
          <div id="actionBar">
            <Link to="/food" id="goBack">Go Back</Link>

            <form

              onSubmit ={  async (e) => {
                let originalCalories = this.originalCaloriesSent;
                let originalNumberOfServings = this.originalNumberOfServingsSent;
                let originalServingSize = this.originalServingSizeSent;
                await submitForm(
                  e,
                  "PUT",
                  `/food/editfood/${this.props.match.params.fdcId}/mealtype/${this.props.match.params.mealType}/date/${this.props.match.params.date}`,
                  { 'Content-Type': 'application/json' },
                  true,
                  "/food",
                  this.props.history,
                  {
                    numberOfServings : this.state.numberOfServings,
                    servingSize : this.state.servingSize,
                    calories : this.state.calories,
                    foodName : this.state.foodName,
                    originalCalories,
                    originalNumberOfServings,
                    originalServingSize
                  },
                  this.props.updateErrors,
                  (res) => {
                  }
                )
              }
              }
              id="addFood">



              <input hidden id="inputNumberOfServings" step="any" name="numberOfServings"  onChange={()=> {}} type="number" value={this.state.numberOfServings} />
              <input hidden id="inputServingSize" step="any" name="servingSize"  onChange={()=> {}} type="number" value={this.state.servingSize} />
              <input hidden id="inputCalories" step="any" name="calories"  onChange={()=> {}} type="number" value={this.state.calories} />
              <input hidden name="foodName" type="text" onChange={()=> {}} value={this.state.foodName} />

              <input id="addFoodSubmit" type="submit" value="Confirm Changes" />
            </form>
          </div>
          <div id="foodName">{this.state.foodName}</div>
          <hr />
          <div id="numberOfServings">
            <div id="numberOfServingLabel">Number of Servings</div>
            <input type="number" min="0" step="any" id="numberOfServingAmount" value={this.state.numberOfServings} onChange={(e) => this.numberOfServingsOnChange(e)} />
          </div>

          <div id="servingSize" className="dropdown">
            <div id="servingSizeLabel">Serving Size</div>
            <select id="servingSizeAmount" value={this.state.servingSize} onChange={(e) => this.servingSizeAmountOnChange(e)}>
              {this.state.foodPortions.map( (food) => <option key={food.toString()} className="dropdownItem" value={food[1]}> {`${food[0]}`} ( {food[1]}g ) </option>)}
            </select>
          </div>

          <hr />
          <div id="foodCalories">Calories : {Math.round(this.state.calories)} cals </div>

          <div id="macronutrientContainer">

            <div className="macronutrient">
              <span>Carbs</span>
              <div id="circle1">

                <CircularProgressbar
                  value={((this.state.calories - (this.state.protein[0] * 4 + this.state.totalFat[0] * 9) ) ).toFixed(2)}
                  maxValue={this.state.calories}
                  text={Math.round((this.state.calories - (this.state.protein[0] * 4 + this.state.totalFat[0] * 9) ) ) + " cals"}


                  styles={{
                    // Customize the root svg element
                    root: {},
                    // Customize the path, i.e. the "completed progress"
                    path: {
                      // Path color
                      stroke:"#0FE34B",
                      // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                      strokeLinecap: 'butt',
                      // Customize transition animation
                      transition: 'stroke-dashoffset 0.5s ease 0s',
                    },
                    // Customize the circle behind the path, i.e. the "total progress"
                    trail: {
                      // Trail color
                      stroke: '#f2f2f2',
                      strokeLinecap: 'butt',
                    },
                    text: {
                      fill: "black",
                      fontSize: '0.8em',
                    }
                  }}

                />

              </div>
            </div>

            <div className="macronutrient">
              <span>Fats</span>
              <div id="circle2">


                <CircularProgressbar
                  value={(this.state.totalFat[0] * 9).toFixed(2)} maxValue={this.state.calories}
                  text={Math.round(this.state.totalFat[0] * 9) + " cals"}


                  styles={{
                    // Customize the root svg element
                    root: {},
                    // Customize the path, i.e. the "completed progress"
                    path: {
                      // Path color
                      stroke:"#FF5F5F",
                      // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                      strokeLinecap: 'butt',
                      // Customize transition animation
                      transition: 'stroke-dashoffset 0.5s ease 0s',
                    },
                    // Customize the circle behind the path, i.e. the "total progress"
                    trail: {
                      // Trail color
                      stroke: '#f2f2f2',
                      strokeLinecap: 'butt',
                    },
                    text: {
                      fill: "black",
                      fontSize: '0.8em',
                    }
                  }}

                />

              </div>
            </div>

            <div className="macronutrient">
              <span>Proteins</span>
              <div id="circle3">

                <CircularProgressbar
                  value={(this.state.protein[0] * 4).toFixed(2)} maxValue={this.state.calories}
                  text={Math.round((this.state.protein[0] * 4)) + " cals"}


                  styles={{
                    // Customize the root svg element
                    root: {},
                    // Customize the path, i.e. the "completed progress"
                    path: {
                      // Path color
                      stroke:"#5690FF",
                      // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                      strokeLinecap: 'butt',
                      // Customize transition animation
                      transition: 'stroke-dashoffset 0.5s ease 0s',
                    },
                    // Customize the circle behind the path, i.e. the "total progress"
                    trail: {
                      // Trail color
                      stroke: '#f2f2f2',
                      strokeLinecap: 'butt',
                    },
                    text: {
                      fill: "black",
                      fontSize: '0.8em',
                    }
                  }}

                />



              </div>
            </div>

          </div>


          <hr />
        </div>

        <div id="foodNutrients">
          <h4 id="nutritionHeading">Nutrition Info</h4>
          <div id="totalFat" className="nutrient">
            <div id="totalFatName">Total Fat</div>
            <div id="totalFatAmount">{`${this.state.totalFat[0].toFixed(2)} ${this.state.totalFat[1]} `}</div> </div>
          <hr className="subFat" />
          <div id="saturatedFat" className="subFat nutrient">
            <div id="saturatedFatName">Saturated Fat</div> <div id="saturatedFatAmount"> {`${this.state.saturatedFat[0].toFixed(2)} ${this.state.saturatedFat[1]} `} </div>
          </div>

          <div id="polyFat" className="subFat nutrient"> <div id="polyFatName"> Polyunsaturated Fat</div> <div id="polyFatAmount">{`${this.state.polyFat[0].toFixed(2)} ${this.state.polyFat[1]} `}</div></div>


          <div id="monoFat" className="subFat nutrient"> <div id="monoFatName">Monounsaturated Fat</div> <div id="monoFatAmount">{`${this.state.monoFat[0].toFixed(2)} ${this.state.monoFat[1]} `}</div> </div>
          <div id="transFat" className="subFat nutrient"> <div id="transFatName">Trans Fat</div> <div id="transFatAmount">  {`${this.state.transFat[0].toFixed(2)} ${this.state.transFat[1]} `} </div> </div>
          <hr className="subFat" />


          <div id="cholesterol" className="nutrient">
            <div id="cholesterolName">Cholesterol</div>
            <div id="cholesterolAmount">{`${this.state.cholesterol[0].toFixed(2)} ${this.state.cholesterol[1]} `}  </div>
          </div>

          <div id="sodium" className="nutrient">
            <div id="sodiumName">Sodium</div>
            <div id="sodiumAmount">{`${this.state.sodium[0].toFixed(2)} ${this.state.sodium[1]} `} </div>
          </div>


          <div id="potassium" className="nutrient"> <div id="potassiumName">Potassium</div> <div id="potassiumAmount">{`${this.state.potassium[0].toFixed(2)} ${this.state.potassium[1]} `} </div></div>


          <div id="totalCarb" className="nutrient"> <div id="totalCarbName">Total Carbohydrate</div>  <div id="totalCarbAmount">
            {((this.state.calories - (this.state.protein[0] * 4 + this.state.totalFat[0] * 9) ) / 4  ).toFixed(2)} g </div> </div>

          <hr className="subCarb" />
          <div id="dietaryFiber" className="subCarb nutrient"> <div id="dietaryFiberName">Dietary Fiber</div> <div id="dietaryFiberAmount">{`${this.state.dietaryFiber[0].toFixed(2)} ${this.state.dietaryFiber[1]} `}  </div></div>


          <div id="sugar" className="subCarb nutrient"> <div id="sugarName">Sugar</div>  <div id="sugarAmount">{`${this.state.sugar[0].toFixed(2)} ${this.state.sugar[1]} `}</div></div>
          <hr className="subCarb" />

          <div id="protein" className="nutrient"> <div id="proteinName">Protein</div> <div id="proteinAmount"> {`${this.state.protein[0].toFixed(2)} ${this.state.protein[1]} `} </div></div>
        </div>
      </main>
    );
  }

}


export default EditFood;
