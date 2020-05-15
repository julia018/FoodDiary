import React from "react";
import "../../static/styles/settings.css";
import submitForm from "../../helpers/Form";

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "firstName",
      lastName: "lastName",
      email: "email",
      calorieGoal:2000,
      goalWeight: 150
    };
  }
  async componentDidMount() {
    const res = await fetch("/user/settings", { method: "POST" });
    const settings = await res.json();
    this.setState({
      firstName: settings.firstName,
      lastName: settings.lastName,
      email: settings.email,
      calorieGoal: settings.calorieGoal,
      goalWeight: settings.weightGoal
    });
  }

  render() {
    return(
      <main id="settings">
        <h2 id="settingsHeading">Settings</h2>

        <form onSubmit={async (e) => await submitForm(
          e,
          "POST",
          "/user/settings/update",
          { 'Content-Type': 'application/json' },
          true,
          "/food",
          this.props.history,
          {goalWeight:this.state.goalWeight, calorieGoal:this.state.calorieGoal},
          this.props.updateErrors,
          (result) => {

          }
        )}
              id="settingsForm">

          <label htmlFor="firstName">First Name</label>
          <input id="firstName" type="text" readOnly value={this.state.firstName} />
          <br />
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" type="text" readOnly value={this.state.lastName} />
          <br />
          <label htmlFor="email">Email</label>
          <input id="email" type="email" readOnly value={this.state.email} />
          <br />
          <label htmlFor="goalWeight">Goal Weight</label>
          <input onChange={ (e) => this.setState({goalWeight: e.target.value}) } name="goalWeight" required step="0.1" min="90" max="700" id="goalWeight" type="number" placeholder={this.state.goalWeight} />
          <br />
          <label htmlFor="calorieGoal">Calorie Goal</label>
          <input onChange={ (e) => this.setState({calorieGoal: e.target.value}) } name="calorieGoal" required  step="50" min="1000" max="50000" id="calorieGoal" type="number" placeholder={this.state.calorieGoal} />
          <input id="settingsSubmit" type="submit" value="Update" />
        </form>
      </main>
    );
  }

}

export default User;