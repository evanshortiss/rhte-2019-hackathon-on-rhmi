'use strict'

const log = require('barelog')

module.exports = async function getConsoleTransport () {
  return {
    /**
     * Logs a meter status update
     * @param {Number} meterId
     * @param {Number} timestamp
     * @param {String} status
     */
    insertMeterUpdate: async (meterId, timestamp, status) => {
      log(
        'junction status update:',
        JSON.stringify({
          meterId, timestamp, status
        })
      )
    },

    /**
     * Logs a junction status update
     * @param {Number} junctionId
     * @param {Number} timestamp
     * @param {Number} status
     * @param {Number} status
     */
    insertJunctionUpdate: async (junctionId, timestamp, ns, ew) => {
      log(
        'junction status update:',
        JSON.stringify({
          junctionId, timestamp, counts: { ns, ew }
        })
      )
    }
  }
}
