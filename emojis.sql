drop table if exists emojis;
create table emojis (
  emoji_id serial,
  id varchar,
  emoji varchar,
  manifest varchar,
  restaurant varchar,
  res_address varchar,
  res_city varchar,
  res_state varchar,
  res_zip varchar,
  res_phone varchar
);
