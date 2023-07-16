import axios from "axios";

const LandingPage = ({ currentUser }) => {
  //console.log(currentUser);
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async () => {
  if (window === "undefined") {
    //we are on the server
    //requests should be made to 'http://ingress-ingnx-ingress-nginx'
  } else {
    //we are on the browser
    //requests can be made with a base url of '
  }
  return {};
};

export default LandingPage;
