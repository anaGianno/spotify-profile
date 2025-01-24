interface Props {
  src: string;
}

const ProfilePicture = ({ src }: Props) => {
  // console.log("Profile picture src: " + src);
  return (
    <img
      src={src}
      className="img-fluid"
      alt="profile-picture"
      style={{
        // border: "10px solid rgb(0, 243, 143, 1)",
        boxShadow: "0px 0px 40px rgba(0, 0, 0, 0.5)",
        borderRadius: "50%",
        display: "block",
        position: "absolute",
        top: "10%",
        left: "5%",
      }}
    ></img>
  );
};

export default ProfilePicture;
