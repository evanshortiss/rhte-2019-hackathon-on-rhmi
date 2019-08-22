/**
 * This script will read our sample LA City data and write it to
 * a format we can use and import into our SQL database
 *
 * Run using Node.js
 */

const { writeFileSync } = require('fs')
const { resolve } = require('path')
const { argv } = require('yargs')

const dataset = require(
  resolve(__dirname, '../../data/samples/traffic-count-sample.raw.json')
)

const streets = dataset.features.map((f, id) => {
  return {
    id,
    street_name: f.attributes.Location,
    latitude: f.geometry.paths[0][0][1],
    longitude: f.geometry.paths[0][0][0]
  }
})

writeFileSync(
  resolve(__dirname, 'sync-files/street_info.json'),
  JSON.stringify(streets.slice(0, argv.limit || streets.length))
)
