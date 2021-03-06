# Data Structures

This section contains samples of data that is generated by the parking meter
and junction sensors and sent to AMQ Streams. Hackathon teams need to consume
this data, persist it in PostgreSQL and use it in their HTTP API responses,
as detailed later in this document.

## IoT Sensor Data inputs AMQ Streams

These are the data payloads that will be available via AMQ Streams for
processing.

### Junction/Traffic Sensors

Junction sensors flush their counters every minute. Flushing a counter means
they reset their internal count to 0, and send a JSON payload to an AMQ Streams
broker. 

The JSON payload is as follows:

```js
{
  // The meter identifier. The junctionId corresponds to those in the city's
  // meter_info table in the city-info database
  "junctionId": 35,
  
  // When the payload was sent from this sensor
  "timestamp": 1566432096257,

  // How many cars passed east-west and north-south directions at this
  // junction in the last minute
  "counts": {
    "ew": 2,
    "ns": 5
  }
}
```

### Parking Sensors

Parking sensors send their state once every minute. The JSON payload is as
follows:

```js
{
  // The meter identifier. The meterId corresponds to those in the city's
  // meter_info table in the city-info database
  "meterId": 62,
  
  // When the payload was sent from this sensor
  "timestamp": 1566432096257,

  // Can be "available", "occupied", "unknown", or "out-of-service"
  "status": "available"
}
```

## Desired API Structure

Hackathon teams need to create a HTTP API that exposes the following
endpoints and data.

### GET /realtime/parking/meters/
Should return information for all parking meters.

```js
[
  {
    "meter_id": Integer,
    "last_updated": Timestamp,
    "address": String,
    "latitude": Float,
    "longitude": Float,

    // Can be "available", "occupied", "unknown", or "out-of-service"
    "status": String
  },
  {
    "meter_id": Integer,
    "last_updated": Timestamp,
    "address": String,
    "latitude": Float,
    "longitude": Float,

    // Can be "available", "occupied", "unknown", or "out-of-service"
    "status": String
  },
  // etc.
}
```

### GET /realtime/parking/meters/{meter-id} 
Should return the latest live information for the given parking `meter-id`.

```js
{
  "meter_id": Integer,
  "last_updated": Timestamp,
  "address": String,
  "latitude": Float,
  "longitude": Float,

  // Can be "available", "occupied", "unknown", or "out-of-service"
  "status": String
}
```

### GET /realtime/parking/meters?status={status}
Should return IDs for all parking meters that are currently in the given `status`.

```js
{
  "meter_ids": [
    234,
    943,
    12,
    213,
    474,
    14
  ]
}
```

### GET /realtime/traffic/junctions/{junction-id}
Should return latest conditions for the given junction:

```js
{
  "junction_id": Integer,
  "last_updated": Timestamp,
  "prev_east_west_count": Integer,
  "prev_north_south_count": Integer,
  "24_hr_total_north_south_count": Integer,
  "24_hr_total_east_west_count": Integer
}
```

### GET /realtime/traffic/junctions
Should return information for all junctions:

```js
[
  {
    "junction_id": Integer,
    "last_updated": Timestamp,
    "prev_east_west_count": Integer,
    "prev_north_south_count": Integer,
    "24_hr_total_north_south_count": Integer,
    "24_hr_total_east_west_count": Integer
  },
  {
    "junction_id": Integer,
    "last_updated": Timestamp,
    "prev_east_west_count": Integer,
    "prev_north_south_count": Integer,
    "24_hr_total_north_south_count": Integer,
    "24_hr_total_east_west_count": Integer
  },
  // etc.
]
```
