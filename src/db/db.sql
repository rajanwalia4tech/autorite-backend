CREATE DATABASE autorite;
CREATE USER autorite IDENTIFIED WITH mysql_native_password BY "autorite@123";
GRANT ALL PRIVILEGES ON autorite.* TO autorite;
FLUSH PRIVILEGES;
use autorite;
CREATE TABLE users(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(200) NOT NULL,
  password varchar(100) NOT NULL,
  role ENUM("user", "admin") DEFAULT "user",
  isEmailVerified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE tokens(
  id INT PRIMARY KEY AUTO_INCREMENT,
  token VARCHAR(300) NOT NULL,
  user_id INT NOT NULL,
  type ENUM ("refresh", "resetPassword", "verifyEmail"),
  expires TIMESTAMP NOT NULL,
  blacklisted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE generate_usecases(
  id smallint PRIMARY KEY AUTO_INCREMENT,
  usecase_id smallint NOT NULL,
  name VARCHAR(300) NOT NULL,
  model varchar(100) NOT NUll,
  temperature float NOT NULL,
  max_tokens smallint NOT NULL,
  top_p float NOT NULL,
  frequency_penalty float NOT NULL,
  presence_penalty float NOT NULL,
  stop_sequence varchar(50) DEFAULT "###",
  pre_prompt varchar(500) DEFAULT "",
  prompt varchar(5000) DEFAULT "",
  post_prompt varchar(500) DEFAULT "",
  fields JSON default NULL,
  n_value smallint DEFAULT 1,
  outputs smallint DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- DROP TABLE generate_usecases;

INSERT INTO generate_usecases (usecase_id,name,model,temperature,max_tokens,top_p,frequency_penalty,presence_penalty)
values(2,"Generate headings","text-curie-001",0.8,222,1,1,2);