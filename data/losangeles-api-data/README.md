## Traffic/Parking Sample Data

This hackathon uses data scraped for the LA City APIs for traffic and parking.
Our PostgreSQL database setup uses this data.

## Explanation of File Names

* `*.db.json` are representations of the data we'll have in the database where
`*` is the table name. These are generated from the `sample` files in this
folder using the `generate-junctions.js` and `generate-meters.js` scripts in
the *db-setup* folder in this repo.
* `*-sample.formatted.json` is data collected from LA City GeoHub and formatted nicely.
* `*-sample.raw.json` is data collected from LA City GeoHub that has not been formatted.

## Fetching the Data

This data has been fetched from LA City APIs for inspiration:

* http://geohub.lacity.org/datasets/traffic-counts
* http://geohub.lacity.org/datasets/parking-meter-sensors

You can fetch and format the data samples using `curl` and `jq`. For example:

```
curl https://maps.lacity.org/lahub/rest/services/LADOT/MapServer/16/query\?where\=1%3D1\&outFields\=\*\&outSR\=4326\&f\=json | jq > data/samples/parking-sample.formatted.json  
```

