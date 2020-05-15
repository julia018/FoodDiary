import React from "react";
import "../../static/styles/index.css";
import superwoman from "../../static/images/superwoman.svg";
import overeating from "../../static/images/overeating.svg";
import man from "../../static/images/app.svg";
import progress from "../../static/images/progress.svg";
import {Link} from "react-router-dom";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: false
    };
  }

  async componentDidMount() {
    const authResult = await this.props.isAuthenticated();
    if(authResult) await this.setState({isAuth: true});
    if(!authResult) await this.setState({isAuth: false});
  }

  isLoggedIn = () => {
    if (!this.state.isAuth) {
      return (
        <div id="introPortal">
          <Link to="/signup" className="portalSignUp">Sign Up</Link>
          <span id="portalOr">or</span>
          <Link to="/login" className="portalLogin">Login</Link>
        </div>
      );
    }
  }


  render() {
    return(
      <main id="index">

        <div id="indexContainerOne">
          <div id="indexIntro">
            <h3 id="introHeading">Track Calories<br /> Lose Weight & <br /> Reach Your Goals.</h3>
            {this.isLoggedIn()}
          </div>
          <img alt="" id="indexIntroImage" src={superwoman} width="200" height="200" />
        </div>

        <div id="indexContainerTwo">
          <h3 id="introCalories">Why track calories?</h3>
          <div className="caloriesReason">
            <img alt="" className="caloriesReasonImage" src={overeating} width="200" height="200" />
            <div className="reasonContainer">
              <h4 className="caloriesReasonHeading">Prevent overeating:</h4>
              <p>By tracking your
                calories you can prevent yourself from overeating and gaining weight.</p>
            </div>
          </div>

          <div className="caloriesReason">
            <img alt="" className="caloriesReasonImage" src={progress} width="200" height="200" />
            <div className="reasonContainer">
              <h4 className="caloriesReasonHeading">View details about your food:</h4>
              <p>Viewing a foods macronutrients will allow you to see what macronutrient it's rich in.</p>
            </div>
            
          </div>

          <div className="caloriesReason">
            <img alt="" className="caloriesReasonImage" src={man} width="200" height="200" />
            <div className="reasonContainer">
              <h4 className="caloriesReasonHeading">Being conscious: </h4>
              <p>Tracking calories can take a small amount of time which will allow you to think clearly if you actually want to eat this food and why.</p>
            </div>
          </div>

        </div>
      </main>
    );
  }

}


export default Home;
