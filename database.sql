

CREATE DATABASE TakeMeOutDB;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS friends;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS interests;
DROP TABLE IF EXISTS user_interests;
DROP TABLE IF EXISTS post_interests;

CREATE TABLE users(
  user_id INT GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(255),
  city VARCHAR(255),
  image VARCHAR(255),
  user_posts INT[],
  PRIMARY KEY (user_id)
);

CREATE TABLE posts(
  post_id INT GENERATED ALWAYS AS IDENTITY,
  user_id INT,
  post_title VARCHAR(255),
  post_interest VARCHAR(255),
  post_location VARCHAR(255),
  image VARCHAR(255),
  text TEXT,
  PRIMARY KEY(post_id),
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
      REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE comments(
  comment_id INT GENERATED ALWAYS AS IDENTITY,
  commenter_id INT REFERENCES users (user_id),
  post_id INT,
  text TEXT,
  CONSTRAINT fk_post
    FOREIGN KEY (post_id)
      REFERENCES posts(post_id)
        ON DELETE CASCADE
);

CREATE TABLE interests(
  interest_id INT GENERATED ALWAYS AS IDENTITY,
  interest_name VARCHAR(255),
  rating integer;
  PRIMARY KEY (interest_id)
);

CREATE TABLE friends(
  user1 INT NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
  user2 INT NOT NULL REFERENCES users (user_id) ON DELETE CASCADE
  rating integer;
);

/*posts user tagged in and vice versa (interested in)*/
CREATE TABLE tags(   
  user_id INT NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
  post_id INT NOT NULL REFERENCES posts (post_id) ON DELETE CASCADE
);

/*users interests*/
CREATE TABLE user_interests(   
  user_id INT NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
  interest_id INT NOT NULL REFERENCES interests (interest_id) ON DELETE CASCADE
);

CREATE TABLE post_interests(   
  user INT NOT NULL REFERENCES posts (post_id) ON DELETE CASCADE,
  post INT NOT NULL REFERENCES interests (interest_id) ON DELETE CASCADE
);
