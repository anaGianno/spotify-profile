import { useNavigate } from "react-router-dom";

interface Props {
  // pass in text and route from login page
  children: string;
  route: string;
}

const OauthButton = ({ route, children }: Props) => {
  const navigate = useNavigate();

  const setRoute = () => {
    navigate(route);
  };

  return (
    <button className="btn btn-success" onClick={setRoute}>
      {children}
    </button>
  );
};

export default OauthButton;
