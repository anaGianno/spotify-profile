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

//       artist_id,
//       artist_name,
//       image_url,
//       genres,
//       followers,

//       album_id,
//       album_name,
//       album_release_date,
//       total_tracks,
//       image_url,
//       artist_name,

//       track_id,
//       track_name,
//       artist_name,
//       duration,
//       image_url,
//       track_release_date,
//       album_type,
//       album_name,
