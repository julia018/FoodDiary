import React from "react";
import { Link } from 'react-router-dom';
import "../../static/styles/food.css";
import arrow from "../../static/images/arrow.svg";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import submitForm from "../../helpers/Form";
import {setTodaysDate, previousDate,nextDate} from "../../helpers/Date";


class Food extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date : setTodaysDate(),
      food : [],
      caloriesConsumedValue: 0,
      calorieGoal :2000
    };
  }

  async componentDidMount() {
    await this.setState({date: setTodaysDate()});
    await this.getFood();
  }

  getFood = async () => {
    await submitForm(
      undefined,
      "POST",
      "/food",
      { 'Content-Type': 'application/json'},
      false,
      "/food",
      this.props.history,
      {time: this.state.date},
      this.props.updateErrors,
       async (res) => {
        const {foods, calorieGoal} = await res;
        await this.setState({
          food : foods,
          calorieGoal
        });
         let calorieTotal = 0;
         this.state.food.map((food) => calorieTotal += food.calories);
         this.setState({caloriesConsumedValue:calorieTotal});
      }
    )
  };


  nextDateOnClick = async () => {
    await this.setState({date: nextDate(this.state.date)});
    await this.getFood();
  }

  previousDateOnClick = async () => {
    await this.setState({date: previousDate(this.state.date)});
    await this.getFood();
  }

  createFood = (mealType) => {
    
    // Food Item
    const HTMLFoodMapper = (food) => {
      return (
        <div key={food.id}  id={food.id} className={`centerMealItem ${food.mealType}`} >
          <span className="divider" > </span>
          <div className="mealItemName" onClick={() => this.editFood(`/food/editfood/${food.fdcId}/mealtype/${food.mealType}/date/${this.state.date}/calories/${food.calories}`)}> {food.foodName} </div>
          <div className="mealItemCalories" onClick={ () => this.editFood(`/food/editfood/${food.fdcId}/mealtype/${food.mealType}/date/${this.state.date}/calories/${food.calories}`)}  > <span className="calories"> {food.calories} </span> calories </div>
          <div className="mealItemOptions">
            <span className="dropdown" onClick={(e) => this.triggerFoodMenu(e)}>{"\u22EE"}</span>
            <ul className="dropdownContent">
              <Link to={`/food/editfood/${food.fdcId}/mealtype/${food.mealType}/date/${this.state.date}/calories/${food.calories}`} className={"edit"}> Edit </Link>
              <span className="delete" onClick={() => this.deleteFood(food.id)}> Delete </span>
            </ul>
          </div>
          <span className="divider"> </span>
        </div>
      )
    };
    
    if(mealType === "breakfast") {
      return this.state.food.filter( (val ) => val.mealType === mealType).map(HTMLFoodMapper)
    }
    else if(mealType === "lunch") {
      return this.state.food.filter( (val ) => val.mealType === mealType).map(HTMLFoodMapper)
    }else if(mealType === "dinner") {
      return this.state.food.filter( (val ) => val.mealType === mealType).map(HTMLFoodMapper)
    }
    
};

  editFood = (url) => this.props.history.push(url);

  deleteFood = async (id) => {
    let tempFood = this.state.food.find( (val) => val.id === id);
    const {fdcId, calories, mealType} = tempFood;

    await submitForm(
      undefined,
      "DELETE",
      `/food/deletefood/${fdcId}/mealtype/${mealType}/date/${this.state.date}`,
      { 'Content-Type': 'application/json'},
      false,
      "/",
      this.props.history,
      {date: this.state.date, calories, fdcId, mealType},
      this.props.updateErrors,
      async (res) => {
        await this.setState({food : this.state.food.filter( (val) => val.id !== id)  });
        let calorieTotal = 0;
        this.state.food.map((food) => calorieTotal += food.calories);
        await this.setState({caloriesConsumedValue:calorieTotal});
      }

    )
  };

  triggerFoodMenu = (e) => {
    if(e.target.nextElementSibling.classList.contains("foodMenuOpen")) {
      e.target.nextElementSibling.classList.remove("foodMenuOpen");
    } else {
      e.target.nextElementSibling.classList.add("foodMenuOpen");
    }
  };

  render() {
    return (
      <div id="foodContainer">
        <div id="calorieSummary">

          <span id="tip"> Tip: Tap/Click on a food to edit the values and quantity.</span>

          <div id="datePicker">
            <img alt="" id="datePrevious" src={arrow} onClick={this.previousDateOnClick} />
            <h4 id="date">{`${this.state.date[4]}${this.state.date[5]}/${this.state.date[6]}${this.state.date[7]}/${this.state.date[0]}${this.state.date[1]}${this.state.date[2]}${this.state.date[3]}`}</h4>
            <img alt="" id="dateNext" src={arrow} onClick={this.nextDateOnClick} />
          </div>
          <span className="divider"></span>
          <div id="circles">
            <div className="calorieCircle">
              <span>Calories Consumed</span>
              <span id="circle1"> <CircularProgressbar
                value={this.state.caloriesConsumedValue} maxValue={this.state.calorieGoal}
                text={`${this.state.caloriesConsumedValue} cals`}


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
                </span>
            </div>

            <div className="calorieCircle">
              <span>Calories Remaining</span>
              <span id="circle2">
              <CircularProgressbar
                maxValue={this.state.calorieGoal} value={this.state.calorieGoal - this.state.caloriesConsumedValue}
                text={`${this.state.calorieGoal - this.state.caloriesConsumedValue} cals`}



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
                    fill: `${this.state.calorieGoal - this.state.caloriesConsumedValue < 0 ? "red" : "black"}`,
                    fontSize: '0.8em',
                  }
                }}

              />
               </span>

            </div>
          </div>
          <span className="divider"></span>
        </div>

        <main id="food">

          <div className="mealType">
            <div className="mealTitle">
              <h4 className="mealName">Breakfast</h4>
              <Link to={`/food/searchfood/mealtype/breakfast/date/${this.state.date}`} className="mealAddFood">Add Food +</Link>
            </div>

            <div className="mealItem" id="breakfast">
              {this.createFood("breakfast")}
            </div>
          </div>

          <div className="mealType">
            <div className="mealTitle">
              <h4 className="mealName">Lunch</h4>
              <Link to={`/food/searchfood/mealtype/lunch/date/${this.state.date}`} className="mealAddFood">Add Food +</Link>
            </div>

            <div className="mealItem" id="lunch">
              {this.createFood("lunch")}
            </div>
          </div>

          <div className="mealType">
            <div className="mealTitle">
              <h4 className="mealName">Dinner</h4>
              <Link to={`/food/searchfood/mealtype/dinner/date/${this.state.date}`} className="mealAddFood">Add Food +</Link>
            </div>

            <div className="mealItem" id="dinner">
              {this.createFood("dinner")}
            </div>
          </div>
        </main>
      </div>
      );
  }

}


export default Food;