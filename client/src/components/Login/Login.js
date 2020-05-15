import React from "react";
import "../../static/styles/login.css";
import { Link } from "react-router-dom";
import submitForm from "../../helpers/Form";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email : "",
      password : ""
    };
  }

  render() {
    return(
      <main id="login">

        <form onSubmit={
          async (e) => await submitForm(
            e, "POST", "/login",
            { 'Content-Type': 'application/json'},
            true, "/food",
            this.props.history,
            {email:this.state.email , password:this.state.password},
            this.props.updateErrors,
            (result) => {}
          )
        } id="loginForm">

          <h2 id="loginHeading">Login</h2>
          <div className="inputField">
            <label className="inputFieldLabel">Email</label>
            <input required type="email" onChange={(e) => this.setState({email: e.target.value})} name="email" placeholder="Email" />
          </div>

          <div className="inputField">
            <label className="inputFieldLabel">Password</label>
            <input required type="password" onChange={(e) => this.setState({password:e.target.value})} name="password" placeholder="Password"  autoComplete="on" />
          </div>
          <Link to="/" id="forgotPassword">Forgot Password?</Link>
          <input type="submit" value="Login" className="loginSubmit" />
        </form>
      </main>
    );
  }

}


export default Login
