//create interface to describe expected data from API
interface UserProfile {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: { spotify: string };
  followers: { href: string; total: number };
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}

interface Image {
  url: string;
  height: number;
  width: number;
}

interface Artist {
  artistId: string;
  artistName: string;
  imageUrl: string;
}

interface Track {
  trackId: string;
  trackName: string;
  artistName: string;
  duration: string;
  imageUrl: string;
}

interface Album {
  albumId: string;
  albumName: string;
  albumReleaseDate: string;
  totalTracks: string;
  imageUrl: string;
  artistName: string;
}

// CREATE TABLE track(
//   track_id VARCHAR(22) PRIMARY KEY,
//   track_name : string;
//   artist_name VARCHAR(255),
//   duration VARCHAR(5),
//   image_url VARCHAR(255),
//   track_user_id VARCHAR(255) REFERENCES user_(user_id)
//  );

//  CREATE TABLE artist(
//   artist_id VARCHAR(22) PRIMARY KEY,
//   artist_name VARCHAR(255),
//   image_url VARCHAR(255),
//   artist_user_id VARCHAR(255) REFERENCES user_(user_id)
//  );

//  CREATE TABLE album(
//   album_id VARCHAR(22) PRIMARY KEY,
//   album_name VARCHAR(255),
//   album_release_date VARCHAR(22),
//   total_tracks SMALLINT,
//   image_url VARCHAR(255),
//   artist_name VARCHAR(255),
//   album_user_id VARCHAR(255) REFERENCES user_(user_id)
//  )
