for NUM in {1..50}
do
  USER_USERNAME=$(printf "evals%02d\n" $NUM)
  USER_PASSWORD=Password1
  USER_DB="$USER_USERNAME-db"

  echo "Creating user $USER_USERNAME with password \"$USER_PASSWORD\""
  psql -d city-info -c "CREATE USER $USER_USERNAME WITH LOGIN ENCRYPTED PASSWORD '$USER_PASSWORD';"
  psql -d city-info -c "GRANT readaccess TO $USER_USERNAME;"

  echo "Creating database \"$USER_DB\" for user $USER_USERNAME"
  psql -c "CREATE DATABASE \"$USER_DB\";";
  echo "Make rhte-admin and $USER_USERNAME superusers for $USER_DB'
  psql -d $USER_DB -c "ALTER USER \"$USER_USERNAME\" WITH SUPERUSER;"
  psql -d $USER_DB -c "ALTER USER \"rhte-admin\" WITH SUPERUSER;"
done

echo "Making rhte-admin a superuser for city-info"
psql -d city-info -c "ALTER USER \"rhte-admin\" WITH SUPERUSER;"
