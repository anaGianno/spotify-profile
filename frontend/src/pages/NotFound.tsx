import { Link } from "react-router-dom";
import Header from "../components/Header";

const NotFoundPage = () => {
  return (
    <>
      <Header user_name={""} image_url={""} profile_id={""} page={"notFound"} />
      <div className="flex flex-col gap-2">
        {/* non native link which does not full page refresh */}
        <div className="home-parent">
          <p className="home-text">Sorry, this page isnt available</p>
          <Link to="/">Return to homepage</Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
