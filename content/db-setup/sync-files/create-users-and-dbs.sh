for NUM in {1..50}
do
  USER_USERNAME=$(printf "evals%02d\n" $NUM)
  USER_PASSWORD=Password1
  TABLE_JUNCTIONS="junction_status_$USER_USERNAME"
  TABLE_METERS="meter_status_$USER_USERNAME"

  echo "Creating user $USER_USERNAME with password \"$USER_PASSWORD\""
  psql -d city-info -c "CREATE USER $USER_USERNAME WITH LOGIN ENCRYPTED PASSWORD '$USER_PASSWORD';"

  echo "Creating junction and meter status tables for $USER_USERNAME"
  psql -d city-info -c "CREATE TABLE $TABLE_JUNCTIONS ( id serial NOT NULL PRIMARY KEY, junction_id serial NOT NULL references junction_info(id), count_ns int NOT NULL, count_ew int NOT NULL );"
  psql -d city-info -c "CREATE TABLE $TABLE_METERS ( id serial NOT NULL PRIMARY KEY, meter_id serial NOT NULL references meter_info(id), status_text text NOT NULL );"

  echo "Granting ALL table permissions to $USER_USERNAME for status tables"
  psql -d city-info -c "GRANT ALL ON $TABLE_METERS TO $USER_USERNAME;"
  psql -d city-info -c "GRANT ALL ON $TABLE_METERS TO $USER_USERNAME;"

  echo "Granting SELECT table permissions to $USER_USERNAME for info tables"
  psql -d city-info -c "GRANT SELECT ON junction_info TO $USER_USERNAME;"
  psql -d city-info -c "GRANT SELECT ON meter_info TO $USER_USERNAME;"
done
