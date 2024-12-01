import { useNavigate } from "react-router-dom";

interface Props {
  children: string;
  route: string;
  color?: "success" | "light" | "primary";
}

const OauthButton = ({ route, children, color = "primary" }: Props) => {
  const setRoute = () => {
    navigate(route);
  };

  const navigate = useNavigate();
  return (
    <button className={"btn btn-" + color} onClick={setRoute}>
      {children}
    </button>
  );
};

export default OauthButton;
