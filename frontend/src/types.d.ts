//create interface to describe expected data from API
interface Image {
  url: string;
  height: number;
  width: number;
}

interface Artist {
  artist_id: string;
  artist_name: string;
  image_url: string;
  genres: string[];
  followers: string;
}

interface Track {
  track_id: string;
  track_name: string;
  artist_name: string;
  duration: string;
  image_url: string;
  track_release_date: string;
  album_type: string;
  album_name: string;
}

interface Album {
  album_id: string;
  album_name: string;
  album_release_date: string;
  total_tracks: string;
  image_url: string;
  artist_name: string;
}

interface User {
  user_id: string;
  user_name: string;
  type_: string;
  email: string;
  image_url: string;
}

// CREATE TABLE user_(
//   user_id VARCHAR(255) PRIMARY KEY,
//   user_name VARCHAR(16),
//   type_ VARCHAR(16),
//   email VARCHAR(255),
//   image_url VARCHAR(255)
//  );
