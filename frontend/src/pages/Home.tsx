import Searchbar from "../components/Searchbar";
import Header from "../components/Header";

const Home = () => {
  return (
    <>
      {/* set no profile data on homepage */}
      <Header user_name={""} image_url={""} profile_id={""} page={"home"} />
      <div className="home-parent">
        <p className="home-text">Spotify Profile</p>
        <Searchbar page={"home"} />
      </div>
    </>
  );
};

export default Home;
