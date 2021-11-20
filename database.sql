

CREATE DATABASE TakeMeOutDB;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS friends;
DROP TABLE IF EXISTS tags;


CREATE TABLE users(
  user_id INT GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  phone_number INT,
  city VARCHAR(255),
  PRIMARY KEY (user_id)
);

CREATE TABLE posts(
  post_id INT GENERATED ALWAYS AS IDENTITY,
  user_id INT,
  post_title VARCHAR(255),
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

CREATE TABLE friends(
  user1 INT NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
  user2 INT NOT NULL REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE tags(
  user INT NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
  post INT NOT NULL REFERENCES posts (post_id) ON DELETE CASCADE
);


