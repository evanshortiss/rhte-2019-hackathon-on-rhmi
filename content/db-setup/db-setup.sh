OC_USER=$(oc whoami)
OC_PROJECT="city-of-pawnee"

if [ $OC_USER != "admin" ]
then
  echo "please run \"oc login -u admin\" before using this script"
  exit 1
fi

# Delete old project if it exists
oc delete project $OC_PROJECT
echo "Waiting 30 seconds for old namespace resources to delete"
sleep 30

# Setup postgres in an openshift namespace
oc new-project $OC_PROJECT

oc new-app postgresql-persistent \
--param=POSTGRESQL_DATABASE=city-info \
--param=VOLUME_CAPACITY=1Gi \
--param=POSTGRESQL_VERSION=9.6 \
--param=POSTGRESQL_USER=rhte-admin \
--param=POSTGRESQL_PASSWORD=changethistosomethingelse

echo "\nWaiting 90 seconds for PostgreSQL to start"
sleep 60

# Generate data in JSON format, then convert to CSV and delete JSON
echo "Generating street_info and meter_info CSV from JSON"
node generate-meters.js
node generate-streets.js
npx json2csv -i sync-files/meter_info.json -o sync-files/meter_info.csv
npx json2csv -i sync-files/street_info.json -o sync-files/street_info.csv
rm sync-files/*.json

# Get the postgres pod ID
POSTGRES_POD=$(oc get pods -o json | jq -r '.items[0].metadata.name')

# Should probably create a custom volume for these next bits:
# Create a new dir, copy files, run db-setup
echo "Create /var/lib/pgsql/data/setup-files directory"
oc exec $POSTGRES_POD mkdir /var/lib/pgsql/data/setup-files
echo "oc rsync db setup script and CSV files"
oc rsync sync-files/ $POSTGRES_POD:/var/lib/pgsql/data/setup-files
echo "Run db-setup.sql"
oc exec $POSTGRES_POD -- bash -c 'psql -U postgres -f /var/lib/pgsql/data/setup-files/db-setup.sql'
echo "Run create-users.sh"
oc exec $POSTGRES_POD -- bash -c 'sh /var/lib/pgsql/data/setup-files/create-users.sh'

echo "\nFinished!\n"
