import React from "react";
import "../../static/styles/navbar.css";
import profile from "../../static/images/profile.svg";
import {Link} from "react-router-dom";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isProfileMenuOpen : false,
      isMenuOpen : false,
      isAuth: this.props.isAuthenticated
    };
  }

  async componentDidMount() {
    window.onresize = () => {
      this.setState({isProfileMenuOpen: false, isMenuOpen: false});
    }
    this.setState({ isAuth: this.props.isAuthenticated });
  }

  componentDidUpdate(prevProps) {
    if (this.props.isAuthenticated !== prevProps.isAuthenticated) this.setState({ isAuth: this.props.isAuthenticated });
  }



  /*
   @name isLoggedIn,
   @type Function : HTML || JSX,
   @description : Returns appropriate view depending on user privilege.
  */
  isLoggedIn = () => {
    if(this.state.isAuth) {
      // CSS style for profile menu.
      const showProfileMenuStyle = this.state.isProfileMenuOpen ? {display:"flex"} : {display:"none"};
      return (
        <div id="userDropdown">
          <img alt="" id="userDropdownButton" src={profile} onClick={() => this.setState({isProfileMenuOpen: !this.state.isProfileMenuOpen}) }   />
          <ul id="dropdownContent" style={showProfileMenuStyle}>
            <Link to="/user/settings" onClick={() => this.setState({isMenuOpen:false})} >Settings</Link>

            <form onSubmit={ async (e) =>  {
              e.preventDefault();
              await fetch("/user/logout", {
                method: "POST"
              });

              window.location.href = "/";
            }}

            >
              <input type="submit" value="Log Out" />
            </form>

          </ul>
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <Link to="/signup" className="signup"  onClick={() => this.setState({isMenuOpen:false})}>Sign Up</Link>
          <Link to="/login" className="login"  onClick={() => this.setState({isMenuOpen:false})}>Login</Link>
        </React.Fragment>
      );
    }
  }


  render() {
    // CSS style for mobile nav.
    const showMenuStyle = this.state.isMenuOpen ? {display:"flex"} : {display:"none"};
    return(
      <nav id="nav">
        <h2 id="navHeading"><Link to="/" onClick={() => this.setState({isMenuOpen:false})} >Food Diary</Link></h2>
        <div id="navLinks">
          <Link to="/" className="navLink">Home</Link>
          <Link to="/food" className="navLink">Food</Link>
          <Link to="/weight" className="navLink">Weight</Link>
          <Link to="/progress" className="navLink">Progress</Link>
          {this.isLoggedIn()}
        </div>

        <div id="navMobileButton" onClick={() => this.setState({isMenuOpen:!this.state.isMenuOpen})} > { this.state.isMenuOpen ?  "X" : "\u2630" }</div>
        <div id="navMobileLinks" style={showMenuStyle}>
          {this.isLoggedIn()}
          <Link to="/" className="navMobileLink" onClick={() => this.setState({isMenuOpen:false})} >Home</Link>
          <Link to="/food" className="navMobileLink" onClick={() => this.setState({isMenuOpen:false})}>Food</Link>
          <Link to="/weight" className="navMobileLink" onClick={() => this.setState({isMenuOpen:false})}>Weight</Link>
          <Link to="/progress" className="navMobileLink" onClick={() => this.setState({isMenuOpen:false})}>Progress</Link>        
        </div>
      </nav>
    );
  }
}

export default Navbar;









