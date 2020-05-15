import React from "react";
import "../../static/styles/notfound.css"

class NotFound extends React.Component {

  async componentDidMount() {
    await this.props.isAuthenticated(); // For Navbar
  }

  render() {
    return(
      <main id="ErrorPage">
        <h2 id="error404">404</h2>
        <h3 id="errorPageNotFound">Page Not Found!</h3>
      </main>
    );
  }

}

export default NotFound;