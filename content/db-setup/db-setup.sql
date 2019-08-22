\c city-info;

CREATE TABLE street_info (
   id serial NOT NULL PRIMARY KEY,
   street_name text NOT NULL,
   geometry point[] NOT NULL
);

CREATE TABLE meter_info (
   id serial NOT NULL PRIMARY KEY,
   address text NOT NULL,
   geometry point NOT NULL,
   status text NOT NULL,
   sensor_id text NOT NULL
);
