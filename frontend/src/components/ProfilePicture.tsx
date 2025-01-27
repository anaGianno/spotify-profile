interface Props {
  src: string;
}

const ProfilePicture = ({ src }: Props) => {
  // console.log("Profile picture src: " + src);
  return (
    <img
      src={src}
      className="img-fluid profile-top-picture"
      alt="profile-top-picture"
    ></img>
  );
};

export default ProfilePicture;
