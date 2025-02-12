import "../style.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Searchbar from "../components/Searchbar";
import Header from "../components/Header";

const Home = () => {
  return (
    <>
      <Header user_name={""} image_url={""} profile_id={""} section={"home"} />
      <div className="home-parent">
        <p className="home-text">Spotify Profile</p>
        <Searchbar homepage={true} />
      </div>
    </>
  );
};

export default Home;
