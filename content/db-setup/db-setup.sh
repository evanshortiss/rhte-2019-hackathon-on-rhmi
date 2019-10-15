# Exits if any commands fail
set -e

# The name we'll give our PostgreSQL project
OC_PROJECT="city-of-losangeles"

echo "Performing requirements checks"

if ! [ -x "$(command -v oc)" ]
then
  echo 'please install the openshift (oc) CLI' >&2
  exit 1
fi

if ! [ -x "$(command -v node)" ]
then
  echo 'please install node.js v10 or newer' >&2
  exit 1
fi

if ! [ -x "$(command -v jq)" ]
then
  echo 'please install jq' >&2
  exit 1
fi

echo "Installing npm dependencies"
npm install

echo "Checking for existing project named $OC_PROJECT"
OC_PROJECT_EXISTS=$(oc projects | grep $OC_PROJECT || true)

# Delete old project if it exists
if [ "$OC_PROJECT_EXISTS" != "" ]
then
  echo "Deleting existing project"
  oc delete project $OC_PROJECT
  echo "Waiting 90 seconds for old namespace resources to delete. Current time is $(date)"
  sleep 90
fi

# Setup postgres in an openshift namespace
oc new-project $OC_PROJECT

oc new-app postgresql-persistent \
--param=POSTGRESQL_DATABASE=city-info \
--param=VOLUME_CAPACITY=10Gi \
--param=POSTGRESQL_VERSION=9.6 \
--param=POSTGRESQL_USER=rhte-admin \
--param=POSTGRESQL_PASSWORD=changethistosomethingelse

echo "\nWaiting 90 seconds for PostgreSQL to start. Current time is $(date)"
sleep 90

# Generate data in JSON format, then convert to CSV and delete JSON
echo "Generating junction_info and meter_info CSV from JSON"
node generate-csv.js
npx json2csv -i sync-files/meter_info.json -o sync-files/meter_info.csv
npx json2csv -i sync-files/junction_info.json -o sync-files/junction_info.csv
cp sync-files/junction_info.csv ../iot-data-generator/data/junction_info.csv
cp sync-files/meter_info.csv ../iot-data-generator/data/meter_info.csv
rm sync-files/*.json

# Get the postgres pod ID
POSTGRES_POD=$(oc get pods -o json | jq -r '.items[0].metadata.name')

# Should probably create a custom volume for these next bits:
# Create a new dir, copy files, run db-setup
echo "Create /var/lib/pgsql/data/setup-files directory"
oc exec $POSTGRES_POD -- bash -c 'mkdir /var/lib/pgsql/data/setup-files'
echo "oc rsync db setup script and CSV files"
oc rsync sync-files/ $POSTGRES_POD:/var/lib/pgsql/data/setup-files
echo "Run db-setup.sql"
oc exec $POSTGRES_POD -- bash -c 'psql -U postgres -f /var/lib/pgsql/data/setup-files/reference-data-db-setup.sql'
echo "Run create-users.sh"
oc exec $POSTGRES_POD -- bash -c 'sh /var/lib/pgsql/data/setup-files/create-users-and-dbs.sh'

# Allow more than the default 100 connections to postgresql
oc set env dc/orders-db -n city-of-losangeles POSTGRESQL_MAX_CONNECTIONS=500

# Enables evals users to setup a port forward for local dev with postgresql
oc create -f ./port-forward-role.yaml

for NUM in {1..50}
do
  USER_USERNAME=$(printf "evals%02d\n" $NUM)
  oc adm policy add-cluster-role-to-user allow-port-forward $USER_USERNAME -n city-of-losangeles
done

echo "\nFinished!\n"
