require('make-promises-safe')

const log = require('barelog')
const csv = require('csvtojson')
const weightedRandom = require('weighted-random')
const { resolve } = require('path')
const getTransport = require('./lib/transport')

// These will be assigned JSON by "main" and "getTransport"
let junctionList
let meterList
let transport

const meterStates = [
  {
    weight: 0.5,
    text: 'occupied'
  },
  {
    weight: 0.2,
    text: 'available'
  },
  {
    weight: 0.2,
    text: 'unknown'
  },
  {
    weight: 0.1,
    text: 'out-of-service'
  }
]

main()

async function main () {
  junctionList = await csv().fromFile(
    resolve(__dirname, './data/junction_info.csv')
  )
  meterList = await csv().fromFile(
    resolve(__dirname, './data/meter_info.csv')
  )
  transport = await getTransport()

  // Assign random weights to junctions on startup
  assignJunctionWeights()
  // Set initial meter and junction states
  performUpdates()

  // Simulate flushing sensors every minute
  setInterval(performUpdates, 60 * 1000)
}

function performUpdates () {
  const start = Date.now()

  updateJunctions()
  updateMeters()

  log(`Meter and junction updates generated in ${Date.now() - start}ms`)
}

function updateJunctions () {
  const timestamp = Date.now()

  junctionList.forEach((j) => {
    // Junctions should meet a minimum threshold of 20% of their weight
    // so they appear to be consistently busy if they have a heavy weight
    const min = j.weight * 0.20
    const junctionId = j.id
    const counts = {
      ew: Math.round(Math.max(min, Math.random() * j.weight)),
      ns: Math.round(Math.max(min, Math.random() * j.weight))
    }

    transport.insertJunctionUpdate(junctionId, timestamp, counts.ew, counts.ns)
  })
}

/**
 * Update meters per our planned paramaters
 */
function updateMeters () {
  const timestamp = Date.now()

  meterList.forEach(m => {
    const status = getWeightedRandomMeterStatus().text
    const meterId = m.id

    // For convenient logging. This is not written in the db
    m.status = status

    transport.insertMeterUpdate(meterId, timestamp, status)
  })

  const counts = meterList.reduce((memo, cur) => {
    if (memo[cur.status]) {
      memo[cur.status]++
    } else {
      memo[cur.status] = 1
    }

    return memo
  }, {})

  log('Meter Status Summary:\n', JSON.stringify(counts, null, 2))
}

function getWeightedRandomMeterStatus () {
  const selectionIdx = weightedRandom(meterStates.map(val => val.weight))
  return meterStates[selectionIdx]
}

/**
 * We need to weight junctions in batches to simulate traffic hotspots
 * This function will assign a weight of W to N junctions repeatedly
 * until all junctions have a weight
 */
function assignJunctionWeights () {
  let i = 0

  while (i < junctionList.length) {
    // Number of junctions for this batch. Using a random range creates
    // busy and not so busy clusters of junctions
    const n = getRandomInt(25, 75)
    // Scale for weight, or "busyness" of junctions
    const w = getRandomInt(2, 75)

    for (let j = 0; j <= n; j++) {
      if (junctionList[i + j]) {
        junctionList[i + j].weight = w
      }
    }

    i += n
  }
}

/**
 * Return an integer in the given range
 * @param {Number} min
 * @param {Number} max
 */
function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min + 1)) + min
}
