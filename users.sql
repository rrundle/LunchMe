GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO PUBLIC;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO PUBLIC;

drop table if exists users;
create table users (
  id serial,
  email varchar,
  name varchar,
  address varchar,
  city varchar,
  state varchar(3),
  zipcode varchar(6),
  phone varchar(11),
  twilio varchar (12),
  peps_manifest varchar,
  panda_manifest varchar,
  fila_manifest varchar,
  innout_manifest varchar,
  chipotle_manifest varchar,
  ten_manifest varchar,
  tokio_manifest varchar,
  pho_manifest varchar,
  ikes_manifest varchar,
  cvs_manifest varchar
);
