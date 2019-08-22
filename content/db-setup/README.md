## DB Setup

### Step 1 - Generate Reference Data
Run the scripts using Node.js 10+ like so:

```
node scripts/generate-meters.js
node scripts/generate-streets.js
```


### Step 2 - Deploy PostgreSQL

```
oc login -u admin
oc new-project city-of-pawnee
oc new-app postgresql-persistent \
--param=POSTGRESQL_DATABASE=city-info \
--param=VOLUME_CAPACITY=1Gi \
--param=POSTGRESQL_VERSION=9.6 \
--param=POSTGRESQL_USER=rhte-admin \
--param=POSTGRESQL_PASSWORD=changethistosomethingelse
```

### Step 3 - Create Tables

```
# TODO
oc port-forward etc.
```
