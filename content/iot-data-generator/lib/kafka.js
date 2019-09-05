'use strict'

module.exports = async function getKafkaTransport () {
  throw new Error('kafka transport not yet implemented')

  // return {
  //   /**
  //    * Sends a meter status update to the topic
  //    * @param {Number} meterId
  //    * @param {Number} timestamp
  //    * @param {String} status
  //    */
  //   insertMeterUpdate: async (meterId, timestamp, status) => {
  //     // TODO
  //   },

  //   /**
  //    * Send a junction status update to the topic
  //    * @param {Number} junctionId
  //    * @param {Number} timestamp
  //    * @param {Number} status
  //    * @param {Number} status
  //    */
  //   insertJunctionUpdate: async (junctionId, timestamp, ns, ew) => {
  //     // TODO
  //   }
  // }
}
