/**
 * Use this script to regenerate the CSV files for PostgreSQL setup
 */

const { writeFileSync } = require('fs')
const { resolve } = require('path')
const { argv } = require('yargs')

const junctionJsonDataset = require(
  resolve(__dirname, '../../data/losangeles-api-data/junction-sample.raw.json')
)
const metersJsonDataset = require(
  resolve(__dirname, '../../data/losangeles-api-data/meter-sample.raw.json')
)

// Remove every other junction to reduce dataset size, then
// create an array of junction objects with required info
const junctions = junctionJsonDataset.features
  .filter((m, idx) => idx % 2)
  .map((f, id) => {
    return {
      id,
      junction_name: f.attributes.Location,
      latitude: f.geometry.paths[0][0][1],
      longitude: f.geometry.paths[0][0][0]
    }
  })

// Remove every other meter to reduce dataset size, then
// create an array of meter objects with required info
const meters = metersJsonDataset.features
  .filter((m, idx) => idx % 2)
  .map((m, id) => {
    return {
      id,
      address: m.attributes.ADDRESS_SPACE,
      latitude: m.attributes.GPSY,
      longitude: m.attributes.GPSX
    }
  })

writeFileSync(
  resolve(__dirname, 'sync-files/junction_info.json'),
  JSON.stringify(junctions.slice(0, argv.limit))
)
writeFileSync(
  resolve(__dirname, 'sync-files/meter_info.json'),
  JSON.stringify(meters.slice(0, argv.limit))
)
