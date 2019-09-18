# Lab Setup Scripts

This folder contains scripts that lab administrators must run to setup the shared
infrastructure for the lab:

* *db-setup/* - provisions a PostgreSQL for attendees to use
* *amq-streams-setup* - creates AMQ Streams topics that the generator sends data to
* *iot-data-generator/* - provisions a service that simulates real-time traffic
and parking meter information

## Requirements

* Node.js 10+
* npm 6+ (bundled with Node.js 10+)
* [OpenShift CLI(`oc`)](https://github.com/openshift/origin/releases/tag/v3.11.0)
* [jq CLI](https://stedolan.github.io/jq/)

## Usage

Start by creating the database, then AMQ Streams topics, and finally deploy the
IoT data generator.

```
# PostgreSQL setup for the db and tables with permissions and data
cd db-setup/
./db-setup.sh

# Create AMQ Streams topics 
cd amq-streams-setup/
oc apply -f topic-junctions.yaml
oc apply -f topic-meters.yaml

# IoT data generator setup
cd iot-data-generator/
npm install
npm run nodeshift
```

By default the IoT data is not placed on the AMQ Streams topics, but is instead
logged to `stdout`. Set a `TRANSPORT_MODE=kafka` environment variable on the
generator Deployment Config to start sending data to the AMQ Stream topics.
