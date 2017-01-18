GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO PUBLIC;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO PUBLIC;

drop table if exists users;
create table users (
  id serial,
  email varchar,
  name varchar,
  address varchar,
  city varchar,
  state varchar(2),
  zipcode int,
  phone varchar(11),
  twilio varchar (12)
);
