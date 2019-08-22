/**
 * This script will read our sample LA City data and write it to
 * a format we can use and import into our SQL database
 *
 * Run using Node.js
 */

const { writeFileSync } = require('fs')
const { resolve } = require('path')

const dataset = require(
  resolve(__dirname, '../../../data/samples/traffic-count-sample.raw.json')
)

const meters = dataset.features.map((m, id) => {
  return {
    id,
    location_name: f.attributes.Location,
    geometry: f.geometry.paths[0]
  }
})

writeFileSync(
  resolve(__dirname, '../streets.json'),
  JSON.stringify(meters, null, 2)
)
