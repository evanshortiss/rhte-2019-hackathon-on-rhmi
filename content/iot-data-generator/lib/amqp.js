'use strict'

module.exports = async function getAmqpTransport () {
  throw new Error('amqp transport not yet implemented')

  // return {
  //   /**
  //    * Sends a meter status update to the queue
  //    * @param {Number} meterId
  //    * @param {Number} timestamp
  //    * @param {String} status
  //    */
  //   insertMeterUpdate: async (meterId, timestamp, status) => {
  //     // TODO
  //   },

  //   /**
  //    * Send a junction status update to the queue
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
