require('make-promises-safe')

const log = require('barelog')
const csv = require('csvtojson')
const weightedRandom = require('weighted-random')
const { resolve } = require('path')
const getTransport = require('./lib/transport')

const SEND_INTERVAL_MS = 10 * 1000
const SEND_COUNT_MIN = 50
const SEND_COUNT_MAX = 100

// These will be assigned JSON by "main" and "getTransport"
let junctionList
let meterList
let transport

// These are the states that a meter can be in. They also have a weight
// assigned that's used to create a distribution of states
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

;(async function main () {
  log('starting data generator')

  let meterIdx = 0
  let junctionIdx = 0

  junctionList = await csv().fromFile(
    resolve(__dirname, './data/junction_info.csv')
  )
  meterList = await csv().fromFile(
    resolve(__dirname, './data/meter_info.csv')
  )
  transport = await getTransport()

  // Assign random weights to junctions on startup
  assignJunctionWeights()

  // Update a batch of junctions every SEND_INTERVAL_MS
  setInterval(() => {
    const batchSize = getRandomInt(SEND_COUNT_MIN, SEND_COUNT_MAX)
    const junctions = junctionList.slice(junctionIdx, junctionIdx + batchSize)
    junctionIdx += batchSize

    log(`updating ${batchSize} junctions in this run`)

    if (junctionIdx >= junctionList.length) {
      junctionIdx = 0
    }

    junctions.forEach((j) => {
      const state = generateStateForJunction(j)

      log('sending junction update', state)

      transport.insertJunctionUpdate(
        state.junctionId, state.timestamp, state.counts.ew, state.counts.ns
      )
    })
  }, SEND_INTERVAL_MS)

  // Update a batch of meters every SEND_INTERVAL_MS
  setInterval(() => {
    const batchSize = getRandomInt(SEND_COUNT_MIN, SEND_COUNT_MAX)
    const meters = meterList.slice(meterIdx, meterIdx + batchSize)
    meterIdx += batchSize

    log(`updating ${batchSize} meters in this run`)

    if (meterIdx >= meterList.length) {
      meterIdx = 0
    }

    meters.forEach(m => {
      const { timestamp, status, meterId } = generateStateForMeter(m)

      // For convenient logging. This is not written in the db
      m.status = status

      log('sending meter update', {
        meterId, timestamp, status
      })

      transport.insertMeterUpdate(meterId, timestamp, status)
    })
  }, SEND_INTERVAL_MS)
})()

/**
 * Generate a state update for the given junction
 * @param {Object} j
 */
function generateStateForJunction (j) {
  const min = j.weight * 0.20
  const timestamp = getTimestamp()
  const junctionId = parseInt(j.id)
  const counts = {
    ew: Math.round(Math.max(min, Math.random() * j.weight)),
    ns: Math.round(Math.max(min, Math.random() * j.weight))
  }

  return {
    junctionId, timestamp, counts
  }
}

/**
 * Generate a state update for the given meter
 * @param {Object} m
 */
function generateStateForMeter (m) {
  const timestamp = getTimestamp()
  const status = getWeightedRandomMeterStatus().text
  const meterId = parseInt(m.id)

  // A side-effect, yuck!
  m.status = status

  return { timestamp, status, meterId }
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

/**
 * Returns seconds since epoch timestamps
 */
function getTimestamp () {
  return Math.round(Date.now() / 1000)
}
