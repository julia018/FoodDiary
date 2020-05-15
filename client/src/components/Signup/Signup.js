import React from "react";
import "../../static/styles/signup.css";
import male from "../../static/images/app.svg";
import female from "../../static/images/dogwoman.svg";
import submitForm from "../../helpers/Form";
import CalorieSlider from "../CalorieSlider/CalorieSlider"



class Signup extends React.Component {
  activityCoeffs = {
    "min": 1.2,
    "small": 1.375,
    "mid": 1.46,
    "midhigh": 1.55,
    "increased": 1.64,
    "high": 1.72,
    "veryhigh": 1.9
  }
  constructor(props) {
    super(props);
    this.slider = React.createRef();
    this.time = React.createRef();
    this.state = {
      genderSelected: "Male",
      firstName: "",
      lastName: "",
      email: "",
      age: 0,
      password: "",
      activity: "min",
      weight: 0,
      height: 0,
      goalWeight: 0,
      calorieGoal: 1900,
      calorieNorm: 0,
      calorieMin: 0,
      calorieMax: 0,
      progress: 0,
      options:
        [
          "min",
          "small",
          "mid",
          "midhigh",
          "increased",
          "high",
          "veryhigh"
        ]
    };
  }

  async changeCalorieNorm() {
    await this.getCalorieNorm();
  }



  getCalorieNorm = async () => {
    console.log("HHH" + this.state.height);
    console.log("Gender " + this.state.genderSelected)
    const res = await fetch(`/calorieNorm`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        height: this.state.height,
        weight: this.state.weight,
        activity: this.state.activity,
        age: this.state.age,
        gender: this.state.genderSelected,
        goalWeight: this.state.goalWeight
      })
    }
    )
      .then(res => res.json())
      .then((res) => {
        console.log("All " + res);
        console.log("Norm " + res.norm);
        console.log("Delta " + res.dela);
        this.setState({
          calorieNorm: res.norm,
          progress: res.progress
        }, function () {
          this.setCalorieValue()
          console.log("Progress changed" + this.state.progress)
        });
      });

  }

  setCalorieDisabled = (cond) => {
    this.slider.current.changeDisabled(cond);
    console.log(this.state.height);
    if (cond === false) this.changeCalorieNorm();
  }

  setCalorieValue = () => {
    console.log("Setting calorie value for slider!!!")
    let cnorm = this.state.calorieNorm;
    this.slider.current.configureSlider(this.state.calorieNorm, 5, this.state.calorieNorm - 250, this.state.calorieNorm + 250,
      {
        [cnorm]: {
          style: {
            color: 'red',
          },
          label: <strong>{Math.round(cnorm)}</strong>,
        }
      });

    this.setTime()
  }

  setIsMaleSelected = () => {
    this.setState({ genderSelected: this.state.genderSelected === "Male" ? "Female" : "Male" }, () => {
      console.log("Gender selected " + this.state.genderSelected)
      this.setStateValue(null, null);
    });

  }

  setStateValue = (e, fieldName) => {
    if (fieldName) {
      this.setState({ [fieldName]: e.target.value }, function () {
        this.setCalorieDisability();
      });
      //console.log("Set state" + e.target.value + "   " + fieldName);
    } else {
      this.setCalorieDisability()
    }
  };

  setgoalWeight = (goalWeight) => {
    this.setState({ goalWeight }, this.setTime)
  }

  setTime = () => {
    console.log("Check time")
    console.log("goalweight " + this.state.goalWeight)
    console.log("progress " + this.state.progress)

    if (this.state.goalWeight && this.state.progress) {
      console.log("Check time +++")
      let time = this.calculateTime()
      console.log("Time " + time)
      this.time.current.value = time;
    } else {
      this.time.current.value = 0;
    }
  }

  calculateTime() {
    let delta = Math.abs(this.state.weight - this.state.goalWeight);
    let weekProgress = this.state.weight * this.state.progress;
    return Math.round(delta / weekProgress)
  }

  setCalorieDisability() {

    if (this.state.height && this.state.weight && this.state.age) {
      this.setCalorieDisabled(false);

    } else {
      this.setCalorieDisabled(true);
      this.slider.current.setNull();
      this.setState({progress: undefined});
    }
  }

  render() {
    const maleSelected = this.state.genderSelected === "Male" ? { background: "#b9f2ff", padding: "15px" } : { background: "white", padding: "0px" };
    const femaleSelected = this.state.genderSelected === "Female" ? { background: "lightpink", padding: "15px" } : { background: "white", padding: "0px" };
    return (

      <form method="POST" onSubmit={async (e) => await submitForm(
        e,
        "POST",
        "/signup",
        { 'Content-Type': 'application/json' },
        true,
        "/food",
        this.props.history,
        {
          genderSelected: this.state.genderSelected,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email,
          age: this.state.age,
          password: this.state.password,
          weight: this.state.weight,
          height: this.state.height,
          goalWeight: this.state.goalWeight,
          calorieGoal: this.state.calorieGoal
        },
        this.props.updateErrors,
        (result) => { }
      )} id="signup" >


        <h2 id="signupHeading">Sign Up</h2>
        <div className="inputField">
          <label className="inputFieldLabel">First Name</label>
          <span ><input onChange={(e) => this.setState({ firstName: e.target.value })} required name="firstName" type="text" placeholder="First Name" /></span>
        </div>

        <div className="inputField">
          <label className="inputFieldLabel">Last Name</label>
          <input onChange={(e) => this.setState({ lastName: e.target.value })} required type="text" placeholder="Last Name" name="lastName" />
        </div>

        <div className="inputField">
          <label className="inputFieldLabel">Email</label>
          <input onChange={(e) => this.setState({ email: e.target.value })} required type="email" name="email" placeholder="Email" />
        </div>

        <div className="inputField">
          <label className="inputFieldLabel">Password</label>
          <input onChange={(e) => this.setState({ password: e.target.value })} required type="password" name="password" placeholder="Password" autoComplete="on" />
        </div>

        <div id="tap">Tap or Click To Choose</div>

        <div id="inputFieldSpecial">
          <div className="flex-inner-wrapper">
            <div id="maleCheck" style={maleSelected} onClick={() => this.setIsMaleSelected()}>
              <span id="maleLabel">Male</span>
              <input type="radio" name="gender" id="male" />
              <img alt="" src={male} width="100" id="maleImage" />
            </div>
            <div id="genderMiddle">
              <div id="or">or</div>
            </div>
            <div id="femaleCheck" style={femaleSelected} onClick={() => this.setIsMaleSelected()}>
              <span id="femaleLabel">Female</span>
              <input type="radio" name="gender" id="female" />
              <img alt="" src={female} width="80" id="femaleImage" />
            </div>
          </div>
        </div>

        <div className="inputField">
          <label className="inputFieldLabel">Age</label>
          <input onChange={(e) => this.setStateValue(e, "age")} required type="number" min="16" step="1" name="age" placeholder="Age" />
        </div>

        <div className="inputField">
          <label className="inputFieldLabel">Weight (kg)</label>
          <input onChange={(e) => this.setStateValue(e, "weight")} required type="number" step="0.1" min="40" max="300" name="weight" placeholder="Weight" />
        </div>

        <div className="inputField">
          <label className="inputFieldLabel">Height (cm)</label>
          <input
            onChange={(e) => this.setStateValue(e, "height")} required type="number" step="1" min="140" max="250" name="heigth" placeholder="Height" />
        </div>

        <div className="inputField">
          <label className="inputFieldLabel">Activity</label>
          <select onChange={(e) => this.setStateValue(e, "activity")}>{this.state.options.map((option, idx) => <option key={idx}>{option}</option>)}</select>
        </div>


        <div className="inputField">
          <label className="inputFieldLabel">Goal Weight(kg)</label>
          <input onChange={(e) => this.setStateValue(e, "goalWeight")} required type="number" step="1" min="40" max="300" name="goalWeight" placeholder="Goal Weight" />
        </div>


        {/*<div className="inputField">
          <label className="inputFieldLabel">Calorie Goal</label>
          <input onChange={(e) => this.setState({calorieGoal:e.target.value}) } required type="number" step="50" min="1000" max="20000" name="calorieGoal" placeholder="Calorie Goal" />
      </div>*/}

        {/*<div id="slider" className="inputField" style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
          <CalorieSlider ref={this.slider} />
    </div>*/}

        <div className="inputField">
          <label className="inputFieldLabel">Calorie Goal</label>
          <CalorieSlider className="slider" ref={this.slider} onChange={(e) => this.setState({ calorieGoal: e.target.value })} />
        </div>

        <div className="inputField">
          <label className="inputFieldLabel">Estimated time</label>
          <input name="Time" placeholder="0" readOnly ref={this.time} />
        </div>

        <input type="submit" value="Sign Up" className="signupSubmit" />
      </form>
    );
  }

}


export default Signup;