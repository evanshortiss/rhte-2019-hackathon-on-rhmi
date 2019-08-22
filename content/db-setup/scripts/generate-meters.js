/**
 * This script will read our sample LA City data and write it to
 * a format we can use and import into our SQL database
 */

const { writeFileSync } = require('fs')
const { resolve } = require('path')

const dataset = require(
  resolve(__dirname, '../../../data/samples/parking-sample.raw.json')
)

const meters = dataset.features.map((m, id) => {
  return {
    id,
    address: m.attributes.ADDRESS_SPACE,
    status: m.attributes.SENSOR_STATUS,
    location: { x: m.attributes.GPSX, y: m.attributes.GPSY },
    sensorId: m.attributes.SENSOR_UNIQUE_ID
  }
})

writeFileSync(
  resolve(__dirname, '../parking-meters.json'),
  JSON.stringify(meters, null, 2)
)
