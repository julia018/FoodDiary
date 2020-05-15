import React from "react";
import "../../static/styles/fooditem.css";
import { CircularProgressbar } from 'react-circular-progressbar';
import submitForm from "../../helpers/Form";

let nutrientAmounts = {nutrientAmounts:[]};
let calorieBasis = {calorieBasis:120};
let servingSizeBasis = {servingSizeBasis:100};

class AddFood extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn:false,
      date: "20200204",
      calories: 1200,
      cholesterol: [ 0, "mg" ],
      dietaryFiber: [ 0, "mg"],
      fdcId: 170456,
      foodName: "Tomatoes, green, raw",
      foodPortions: [ 0, "mg" ],
      monoFat: [ 0.03, "g" ],
      polyFat:[ 0.081, "g" ],
      potassium: [ 204, "mg" ],
      protein: [ 1.2, "g" ],
      saturatedFat: [ 0.028, "g" ],
      sodium: [ 13, "mg" ],
      sugar: [ 0, "mg"],
      totalFat: [ 0, "mg"],
      transFat:[ 0, "mg"],
      servingSize: 100,
      numberOfServings: 1,
      
    };
  }

  async componentDidMount() {
    await this.getFood();
  }

  getFood = async () => {
    const res = await fetch(`/food/fooditem/${this.props.match.params.fdcId}/mealtype/${this.props.match.params.mealType}/date/${this.props.match.params.date}`, {
      method:"POST",
      headers: { 'Content-Type': 'application/json'},
    }
    );
    const food = await res.json();
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
      transFat,
    });

    nutrientAmounts = {nutrientAmounts:[
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
    calorieBasis = {calorieBasis:Math.round(calories)};
    servingSizeBasis = {servingSizeBasis:100};

  }

  numberOfServingsOnChange = async (e) => {
    let calories = Math.round((calorieBasis.calorieBasis * this.state.servingSize / servingSizeBasis.servingSizeBasis) * parseFloat(e.target.value));

    await this.setState({
      calories,
      numberOfServings: parseFloat(e.target.value)
    });
    const formula = parseFloat((this.state.servingSize / 100) * this.state.numberOfServings).toFixed(2);
    const nutrientAmount = nutrientAmounts.nutrientAmounts;
    await this.setState({
      cholesterol: [ nutrientAmount[0][0] * formula, nutrientAmount[0][1] ],
      dietaryFiber: [ nutrientAmount[1][0] * formula, nutrientAmount[1][1]],
      monoFat: [ nutrientAmount[2][0] * formula, nutrientAmount[2][1]],
      polyFat:[nutrientAmount[3][0] * formula, nutrientAmount[3][1]],
      potassium: [ nutrientAmount[4][0] * formula, nutrientAmount[4][1] ],
      protein: [  nutrientAmount[5][0] * formula, nutrientAmount[5][1] ],
      saturatedFat: [ nutrientAmount[6][0] * formula, nutrientAmount[6][1]],
      sodium: [  nutrientAmount[7][0] * formula, nutrientAmount[7][1] ],
      sugar: [ nutrientAmount[8][0] * formula, nutrientAmount[8][1]],
      totalFat: [ nutrientAmount[9][0] * formula, nutrientAmount[9][1]],
      transFat:[  nutrientAmount[10][0] * formula, nutrientAmount[10][1]],
    
    });
  }

  servingSizeAmountOnChange = async (e) => {
    const servingSize = parseInt(e.target.value);
    await this.setState({
      numberOfServings: 1,
      calories: Math.round(calorieBasis.calorieBasis * (servingSize / 100) ),
      servingSize
    });
    const formula = parseFloat( (parseInt(servingSize) / 100 * 1)).toFixed(2);
    const nutrientAmount = nutrientAmounts.nutrientAmounts;

    await this.setState({ 
      cholesterol: [ nutrientAmount[0][0] * formula, nutrientAmount[0][1] ],
      dietaryFiber: [ nutrientAmount[1][0] * formula, nutrientAmount[1][1]],
      monoFat: [ nutrientAmount[2][0] * formula, nutrientAmount[2][1]],
      polyFat:[nutrientAmount[3][0] * formula, nutrientAmount[3][1]],
      potassium: [ nutrientAmount[4][0] * formula, nutrientAmount[4][1] ],
      protein: [  nutrientAmount[5][0] * formula, nutrientAmount[5][1] ],
      saturatedFat: [ nutrientAmount[6][0] * formula, nutrientAmount[6][1]],
      sodium: [  nutrientAmount[7][0] * formula, nutrientAmount[7][1] ],
      sugar: [ nutrientAmount[8][0] * formula, nutrientAmount[8][1]],
      totalFat: [ nutrientAmount[9][0] * formula, nutrientAmount[9][1]],
      transFat:[  nutrientAmount[10][0] * formula, nutrientAmount[10][1]],
    });
  }

  render() {
    return (
     <React.Fragment>
      <main id="container" className="mealType">
         
        <div id="addFoodContainer" className={this.state.fdcId}>
          <div id="actionBar">
            <a href={`/food/searchfood/mealtype/${this.props.match.params.mealType}/date/${this.props.match.params.date}`} id="goBack">Go Back</a>

            <form



              onSubmit ={  async (e) => {
                await submitForm(
                  e,
                  "POST",
                  `/food/addfood/${this.props.match.params.fdcId}/mealtype/${this.props.match.params.mealType}/date/${this.props.match.params.date}`,
                  { 'Content-Type': 'application/json' },
                  true,
                  "/food",
                  this.props.history,
                  {
                numberOfServings: this.state.numberOfServings,
                servingSize:this.state.servingSize,
                calories:this.state.calories,
                foodName : this.state.foodName
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
              <input id="addFoodSubmit" type="submit" value="Add Food" />
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
            <select id="servingSizeAmount" onChange={(e) => this.servingSizeAmountOnChange(e)}>
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
      </React.Fragment>

    )
  }
}

export default AddFood;