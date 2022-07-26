-- Delete data from tables only
DELETE FROM transactions;
DELETE FROM users_token;
DELETE FROM users_auth;
DELETE FROM users;

-- Drop the whole schema
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS users_token;
DROP TABLE IF EXISTS users_auth;
DROP TABLE IF EXISTS users;
