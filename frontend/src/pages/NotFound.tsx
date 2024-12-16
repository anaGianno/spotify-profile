import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col gap-2">
      404 Not Found
      <br></br>
      {/* Non Native link which does not full page refresh */}
      <Link to="/">Return to homepage</Link>
    </div>
  );
};

export default NotFoundPage;
