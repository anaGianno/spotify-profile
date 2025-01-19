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
        borderRadius: "50%",
        border: "1px solid rgb(0, 243, 143, 0.25)",
      }}
    ></img>
  );
};

export default ProfilePicture;
