\c city-info;

-- Create a readonly role for users we'll create later
CREATE ROLE readaccess;
GRANT USAGE ON SCHEMA public TO readaccess;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readaccess;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO readaccess;
REVOKE ALL ON SCHEMA public FROM public;

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
