CREATE TABLE user_(
 user_id VARCHAR(255) PRIMARY KEY,
 user_name VARCHAR(16),
 type_ VARCHAR(16),
 email VARCHAR(255),
 image_url VARCHAR(255)
);

CREATE TABLE track(
 track_id VARCHAR(22) PRIMARY KEY,
 track_name VARCHAR(255),
 artist_name VARCHAR(255),
 duration VARCHAR(5),
 image_url VARCHAR(255),
 track_user_id VARCHAR(255) REFERENCES user_(user_id)
);

CREATE TABLE artist(
 artist_id VARCHAR(22) PRIMARY KEY,
 artist_name VARCHAR(255),
 image_url VARCHAR(255),
 artist_user_id VARCHAR(255) REFERENCES user_(user_id)
);

CREATE TABLE album(
 album_id VARCHAR(22) PRIMARY KEY,
 album_name VARCHAR(255),
 album_release_date VARCHAR(22),
 total_tracks SMALLINT,
 image_url VARCHAR(255),
 artist_name VARCHAR(255),
 album_user_id VARCHAR(255) REFERENCES user_(user_id)
)

DROP TABLE track
DROP TABLE artist
DROP TABLE album
DROP TABLE user_

SELECT * FROM track
SELECT * FROM artist
SELECT * FROM album
SELECT * FROM user_

ALTER SEQUENCE user_user_id_seq RESTART WITH 1