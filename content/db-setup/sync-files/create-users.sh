for NUM in {1..50}
do
  USER_USERNAME=$(printf "evals%02d\n" $NUM)
  USER_PASSWORD=Password1
  echo "Creating user $USER_USERNAME with password \"$USER_PASSWORD\""
  psql -d city-info -c "CREATE USER $USER_USERNAME WITH LOGIN ENCRYPTED PASSWORD '$USER_PASSWORD';"
  psql -d city-info -c "GRANT readaccess TO $USER_USERNAME;"
done
