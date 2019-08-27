/**
 * This script will read our sample LA City data and write it to
 * a format we can use and import into our SQL database
 */

const { writeFileSync } = require('fs')
const { resolve } = require('path')
const { argv } = require('yargs')

const dataset = require(
  resolve(__dirname, '../../data/samples/meter-sample.raw.json')
)

const meters = dataset.features.map((m, id) => {
  return {
    id,
    address: m.attributes.ADDRESS_SPACE,
    latitude: m.attributes.GPSY,
    longitude: m.attributes.GPSX
  }
})

writeFileSync(
  resolve(__dirname, 'sync-files/meter_info.json'),
  JSON.stringify(meters.slice(0, argv.limit || meters.length))
)
