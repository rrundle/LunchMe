drop table if exists orders;
create table orders (
  id int,
  order_id serial,
  sms_body varchar,
  order_status varchar,
  order_price varchar,
  order_vendor varchar,
  order_item varchar,
  order_time timestamp default current_timestamp
);
