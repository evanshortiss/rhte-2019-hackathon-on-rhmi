# Lab Setup Scripts

This folder contains scripts that lab administrators must run to setup the shared
infrastructure for the lab:

* *db-setup/* - provisions a PostgreSQL for attendees to use
* *amq-streams-setup* - creates AMQ Streams topics that the generator sends data to
* *iot-data-generator/* - provisions a service that simulates real-time traffic
and parking meter information

## Usage

```
# Postgres setup
cd db-setup
npm install
./db-setup.sh

# data generator setup
cd ../iot-data-generator
npm install
npm run nodeshift
```
