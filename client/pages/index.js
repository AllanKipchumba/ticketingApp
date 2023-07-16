import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  console.log(req.headers);
  if (typeof window === "undefined") {
    //we are on the server
    //requests should be made to 'http://ingress-ingnx-...'
    //cross namespace service communication
    try {
      const { data } = await axios.get(
        "http://ingress-nginx.ingress-nginx.svc.cluster.local/api/users/currentuser",
        {
          headers: req.headers,
        }
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  } else {
    //we are on the browser
    //requests can be made with a base url of ''
    const { data } = await axios.get("/api/users/currentuser");
    return data;
  }
  return {};
};

export default LandingPage;
