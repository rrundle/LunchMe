drop table if exists order_status;
create table order_status (
  id int,
  order_id int,
  status_id serial,
  sms_update_body varchar,
  order_status varchar,
  status_timestamp timestamp default current_timestamp
);
