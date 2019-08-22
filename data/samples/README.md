## Traffic/Parking Sample Data

This data has been fetched from LA City APIs for inspiration:

* http://geohub.lacity.org/datasets/traffic-counts
* http://geohub.lacity.org/datasets/parking-meter-sensors

You can fetch and format the data samples using `curl` and `jq`. For example:

```
curl https://maps.lacity.org/lahub/rest/services/LADOT/MapServer/16/query\?where\=1%3D1\&outFields\=\*\&outSR\=4326\&f\=json | jq > data/samples/parking-sample.formatted.json  
```

## File Types

* `*.db.json` are representations of the data we'll have in the database where `*` is the table name.
* `*.sample.json` are the dataset collected from LA City GeoHub.
