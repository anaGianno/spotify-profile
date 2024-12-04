import { useParams } from "react-router-dom";

function Profile() {
  const params = useParams<{ profileId: string }>();
  console.log(params);
  return <div>Profile {params.profileId}</div>;
}

export default Profile;
