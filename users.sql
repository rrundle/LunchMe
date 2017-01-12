drop table if exists users;
create table users (
  id serial,
  username varchar,
  password varchar,
  name varchar,
  address varchar,
  apt varchar,
  city varchar,
  state varchar,
  zipcode varchar
);
