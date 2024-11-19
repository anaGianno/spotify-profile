CREATE TABLE user_(
 user_id SERIAL PRIMARY KEY,
 user_name VARCHAR(16)
);

CREATE TABLE track(
 track_id VARCHAR(22) PRIMARY KEY,
 track_name VARCHAR(255),
 artist_name VARCHAR(255),
 duration VARCHAR(5),
 image_url VARCHAR(255),
 track_user_id SERIAL REFERENCES user_(user_id)
);

CREATE TABLE artist(
 artist_id VARCHAR(22) PRIMARY KEY,
 artist_name VARCHAR(255),
 image_url VARCHAR(255),
 artist_user_id SERIAL REFERENCES user_(user_id)
);

CREATE TABLE album(
 album_id VARCHAR(22) PRIMARY KEY,
 album_name VARCHAR(255),
 album_release_date VARCHAR(22),
 total_tracks SMALLINT,
 image_url VARCHAR(255),
 artist_name VARCHAR(255),
 album_user_id SERIAL REFERENCES user_(user_id)
)