-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id serial NOT NULL,
  email varchar(80) NOT NULL,
  first_name varchar(250) NOT NULL,
  PRIMARY KEY (email)
);

-- Create users_auth table
CREATE TABLE IF NOT EXISTS users_auth (
  user_email varchar(80) NOT NULL,
  password varchar(250) NOT NULL,
  PRIMARY KEY (user_email) --,
  /*
  CONSTRAINT fk_users
    FOREIGN KEY(user_email) 
      REFERENCES users(email)
  */
);

-- Create users_token table
CREATE TABLE IF NOT EXISTS users_token (
  user_email varchar(80) NOT NULL,
  token varchar NOT NULL,
  valid boolean NOT NULL DEFAULT true,
  PRIMARY KEY (user_email) --,
  /*
  CONSTRAINT fk_users
    FOREIGN KEY(user_email) 
      REFERENCES users(email)
  */
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id serial NOT NULL,
  user_email varchar(80) NOT NULL,
  value varchar(250) NOT NULL,
  PRIMARY KEY (id) --,
  /*
  CONSTRAINT fk_users
    FOREIGN KEY(user_email) 
      REFERENCES users(email)
  */
);
