# RHTE 2019 RHMI Hackathon IoT Data Generator

## About

### Strategy

1. Once per minute an "update" function is executed
1. This updates the state of each parking meter and junction
1. The new state is flushed to a "transport"

Currently this generates a large volume of data. We can revise this to reduce
the total number of meters, junctions, and the update frequency.

### Data Structures

Generates Meter and Junction payloads that conform to the spec
described [at this link](https://github.com/evanshortiss/rhte-2019-hackathon-on-rhmi/tree/master/data/hackathon-data-structures#iot-sensor-data-inputs-amq-streams).

The parking meter "status" field in payloads are weighted such that the
following states and probabilities are possible for meters:

* ~50% occupied
* ~20% available
* ~20% unknown
* ~10% out-of-service

Similarly, junctions are assigned a weight on initialisation to simulate the
idea that some intersections are busier than others.

### Transports

Data can be written to the following:

* Kafka Topics
* PostgreSQL Tables
* AMQP (provided by AMQ Online)
* stdout/console (default)

Configure this by setting a `TRANSPORT_MODE` environment variable.

## Requirements

* Node.js 10+
* Docker 18+

## Configuration

* `TRANSPORT_MODE` - Set to `kafka`, `psql`, `amqp` or `console`. Defaults to
`console`.
* `PG_CONNECTION_STRING` - If `TRANSPORT_MODE` is set to `psql` this will be
used to connect to PostgreSQL. Defaults to `postgresql://rhte-admin:changethistosomethingelse@postgresql.city-of-losangeles.svc:5432/city-info`

## Run Locally with Node.js

Run the following from this directory (the one containing a *package.json*):

```bash
npm install
npm start
```

The generator will begin to print data on the console by default.

## Deploy to OpenShift
Running the following will deploy the project into the `city-of-losangeles`
namespace.

```bash
oc login $CLUSTER_HOST -u admin
npm install
npm run nodeshift
```

## Docker Build & Run

```
export TAGNAME=rhte-2019-rhmi-iot-datagen

docker build . -t $TAGNAME

docker run rhte-2019-rhmi-iot-datagen:latest 
```
