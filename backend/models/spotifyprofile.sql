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
 track_user_id VARCHAR(255) REFERENCES user_(user_id),
 track_release_date VARCHAR(22),
 track_type VARCHAR(11)
);

CREATE TABLE artist(
 artist_id VARCHAR(22) PRIMARY KEY,
 artist_name VARCHAR(255),
 image_url VARCHAR(255),
 artist_user_id VARCHAR(255) REFERENCES user_(user_id),
 genres VARCHAR[],
 followers integer,
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

CREATE OR REPLACE FUNCTION fn_merge_accounts()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$body$
BEGIN
    -- Check if there's an existing user with the same email and a different type
    IF EXISTS (
        SELECT 1 
        FROM user_
        WHERE email = NEW.email AND type_ <> NEW.type_
    ) THEN
        -- Update more values if its a google user
		IF EXISTS(
			SELECT 1 
			FROM user_
			where email = NEW.email and type_ = 'google'
		) THEN
			UPDATE user_
			SET user_id = NEW.user_id,
			user_name = NEW.user_name,
			image_url = NEW.image_url
			WHERE email = NEW.email;
		END IF;
		
        -- Update the account to include both types
        UPDATE user_
        SET type_ = 'spotify-google'
        WHERE email = NEW.email;

        -- Suppress insertion of the new row
        RETURN NULL;
    END IF;

    -- Allow the new row to be inserted if no matching email is found
    RETURN NEW;
END;
$body$;

CREATE TRIGGER tr_merge_accounts
    BEFORE INSERT
    ON user_
    FOR EACH ROW
    EXECUTE FUNCTION fn_merge_accounts();

DROP TABLE track
DROP TABLE artist
DROP TABLE album
DROP TABLE user_

SELECT * FROM track
SELECT * FROM artist
SELECT * FROM album
SELECT * FROM user_

ALTER SEQUENCE user_user_id_seq RESTART WITH 1