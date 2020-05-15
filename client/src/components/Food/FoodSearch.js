import React from "react";
import "../../static/styles/foodsearch.css";
import { Link } from "react-router-dom";
import submitForm from "../../helpers/Form";

class FoodSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mealType: this.props.match.params.mealtype,
      date :this.props.match.params.date,
      foods : [],
      query : ""
    };
  }

  /*
    @name displayFood
    @type Function : HTML || JSX,
    @description : Returns list of food from the FoodCentral API.
*/
  displayFood = () => {
    return (
      this.state.foods.map((food, index) => {
        return (
          <div key={index} className="food">
            <Link key={index * 50 * parseInt(food.fdcId)} className={`${food.fdcId.toString()} foodItem`} to={`/food/fooditem/${food.fdcId.toString()}/mealtype/${this.state.mealType}/date/${this.state.date}`}>{food.description}</Link>
          </div>
        )
      })
    )
  }
  render() {
    return (
      <div id="foodSearchContainer">

        <form onSubmit={async (e) => await submitForm(
          e, "POST",  `/food/searchfood/${this.state.query === "" ? "User entered nothing in the query." : this.state.query}`,
          { 'Content-Type': 'application/json' },
          false, "/",
          this.props.history,
          {},
          this.props.updateErrors,
          async (result) => {
            const { foods } = result;
            await this.setState({ foods});
          }
        )

        } id="searchContainer">



          <label htmlFor="foodQuery">Search Food</label>
          <input type="search" name="query" id="foodQuery" placeholder="Search Food" onChange={(e) => this.setState({ query: e.target.value })} />
          <button id="search" type="submit">Search</button>
        </form>
        <main id="foodsearch">
          {this.displayFood()}
        </main>
      </div>
    );
  }


}


export default FoodSearch;