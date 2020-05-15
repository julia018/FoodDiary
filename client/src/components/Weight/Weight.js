import React from "react";
import male from "../../static/images/app.svg";
import female from "../../static/images/dogwoman.svg";
import "../../static/styles/weight.css";
import {setTodaysDate} from "../../helpers/Date";
import submitForm from "../../helpers/Form";

class Weight extends React.Component {

  constructor(props) {
    super(props);
    const date = setTodaysDate();
    this.state = {
      goalWeight: 180,
      currentWeight: 190,
      weight: 190,
      isMale: true,
      date
    };
  }


  async componentDidMount() {
    const res = await fetch("/weight", { method: "POST" });
    const weight = await res.json();
    const gender = weight.gender === "Male" ? true : false;
    this.setState({
      currentWeight: weight.currentWeight,
      weight: weight.currentWeight,
      goalWeight: weight.goalWeight,
      isMale: gender,
      date: setTodaysDate()
    })
  }

  /*
  @name isMale,
  @type Function : HTML || JSX,
  @description : Returns gender image based on profile data.
  */

  isMaleFunc = () => {
    if (this.state.isMale) {
      return <img alt="" src={male} id="weightImage" height="100" width="120" />
    } else {
      return <img alt="" src={female} id="weightImage" height="100" width="120" />
    }
  }

  render() {
    return (
      <main id="weight">
        <div id="currentWeight">
          <h3 id="currentGoalWeight">Goal Weight: {this.state.goalWeight} lbs </h3>
          <h3 id="currentWeightHeading"> Current Weight:{this.state.currentWeight} lbs </h3>
        </div>

        <form onSubmit={async (e) => await submitForm(
          e,
          "POST",
          `/weight/date/${this.state.date}`,
          { 'Content-Type': 'application/json' },
          false,
          "/weight",
          this.props.history,
          {weight: this.state.weight},
          this.updateErrors,
          (result) => {
            this.setState({currentWeight:this.state.weight})
          }
        )}
              id="newWeightContainer">


          <div id="personContainer">
            <h4 id="currentWeightLabel">{this.state.currentWeight} lbs</h4>
            {this.isMaleFunc()}
          </div>

          <div id="newWeight">
            <label htmlFor="newWeightInput">Enter A New Weight</label>
            <input id="newWeightInput" name="weight" onChange={(e) => this.setState({weight: e.target.value})} required type="number" step="0.1" min="90" max="700" placeholder={`${this.state.currentWeight - 5} lbs`} />
          </div>
          <input type="submit" value="Add Weight" id="newWeightSubmit" />
        </form>
      </main>
    )
  }

}

export default Weight;
