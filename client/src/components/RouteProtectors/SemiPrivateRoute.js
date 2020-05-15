import React from "react";
import { Route, Redirect } from "react-router-dom";

/**
 * @var isAuthenticated,
 * @type Function: Returns Boolean
 */

class SemiPrivateRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: false,
      loading: true
    };

  }

  async componentDidMount() {
    const authResult = await this.props.isAuthenticated();
    if(authResult) await this.setState({isAuth:true});
    if(!authResult) await this.setState({isAuth:false});
    await this.setState({loading:false});
  }


  RedirectOptions = () => {
    const {path, Component, updateErrors} = this.props;
    const {isAuth, loading} = this.state;
    const loadingStyle = { fontSize:"1.8em", height:"calc(100vh - 70px)",width:"100vw",display:"flex", justifyContent:"center" , alignItems:"center"};

    if(loading) return <span style={loadingStyle} > Loading... </span>;

    if(!isAuth) {
      return  <Route exact path={path} render={(props) => <Component updateErrors={updateErrors} {...props}  /> } />
    } else {
      return <Redirect to="/food" />
    }

  }

  render() {
    return <React.Fragment> {this.RedirectOptions()} </React.Fragment>
  }

}

export default SemiPrivateRoute;