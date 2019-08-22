# QA Team Data Samples/Requirements

## Traffic Sensors

Traffic sensors flush their counters every 30 seconds. Flushing a counter means
they reset their internal count to 0, and send a JSON payload to an AMQ Streams
broker. 

The JSON payload is as follows:

```js
{
  // The junction identifier. The IDs correspond to those in the city's
  // street records database
  "junctionId": 35,
  
  // When the payload was sent from the sensor
  "timestamp": 1566432096257,

  // How many cars passed east-west and north-south directions
  "counts": {
    "ew": 2,
    "ns": 5
  }
}
```

## Parking Sensors

Parking sensors send their state once every minute. The JSON payload is as
follows:

```js
{
  // The meter identifier. The IDs correspond to those in the city's
  // street records database
  "meterId": 62,
  
  // When the payload was sent from the sensor
  "timestamp": 1566432096257,

  // Can be "available", "occupied", "unknown", or "out-of-service"
  "status": "available"
}
```
