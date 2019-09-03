\c city-info;

ALTER USER "rhte-admin" WITH SUPERUSER;

CREATE TABLE junction_info (
   id serial NOT NULL PRIMARY KEY,
   junction_name text NOT NULL,
   latitude real NOT NULL,
   longitude real NOT NULL
);

CREATE TABLE meter_info (
   id serial NOT NULL PRIMARY KEY,
   address text NOT NULL,
   latitude real NOT NULL,
   longitude real NOT NULL
);

COPY junction_info(id,junction_name,latitude,longitude) FROM '/var/lib/pgsql/data/setup-files/junction_info.csv' DELIMITER ',' CSV HEADER;
COPY meter_info(id,address,latitude,longitude) FROM '/var/lib/pgsql/data/setup-files/meter_info.csv' DELIMITER ',' CSV HEADER;
