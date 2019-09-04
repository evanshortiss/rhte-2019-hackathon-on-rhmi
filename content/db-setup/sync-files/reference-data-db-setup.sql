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

CREATE TABLE junction_status_rhte_admin (
  id serial NOT NULL PRIMARY KEY,
  junction_id serial NOT NULL references junction_info(id),
  timestamp TIMESTAMP NOT NULL,
  count_ns int NOT NULL,
  count_ew int NOT NULL
);

CREATE TABLE meter_status_rhte_admin (
  id serial NOT NULL PRIMARY KEY,
  meter_id serial NOT NULL references meter_info(id),
  timestamp TIMESTAMP NOT NULL,
  status_text text NOT NULL
);

COPY junction_info(id,junction_name,latitude,longitude) FROM '/var/lib/pgsql/data/setup-files/junction_info.csv' DELIMITER ',' CSV HEADER;
COPY meter_info(id,address,latitude,longitude) FROM '/var/lib/pgsql/data/setup-files/meter_info.csv' DELIMITER ',' CSV HEADER;
