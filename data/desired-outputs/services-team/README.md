# Services Team Data Samples/Requirements

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
