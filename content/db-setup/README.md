## Reference Data PostgreSQL Setup

## Requirements

* Node.js 10+
* npm 6+ (usually comes with Node.js 10)
* [OpenShift CLI(`oc`)](https://github.com/openshift/origin/releases/tag/v3.11.0)
* [jq CLI](https://stedolan.github.io/jq/)

### Setup

Run the `db-setup.sh` file in this directory to:

1. Create the city namespace on the RHMI cluster
2. Create a persistent PostgreSQL deployment
3. Create CSV files containing the junction and meter data
4. Copy `.csv` and `.sql` files to the container
5. Run the `.sql` file to setup the database
6. Create database users that correspond to RHMI users

## Verify the Install
Connect to the database Pod on OpenShift:

```bash
POSTGRES_POD=$(oc get pods -o json | jq -r '.items[0].metadata.name')
oc rsh $POSTGRES_POD
```

Use the following to test the database from the rsh session:

```bash
# Connect to postgres as an evals user, password is "Password1"
psql -U evals01 -d city-info -W
```

Query and try update the database. Update should return an error.

```sql
-- Should list results with id, name, lat, and long
select * from junction_info;

-- Should list results with id, address, lat, and long
select * from meter_info;

-- Should fail since evals users do not have write access to the city-info db
UPDATE meter_info SET address='oops' WHERE id=0;
```
