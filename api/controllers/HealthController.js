/**
 * HealthController
 *
 * @description :: Server-side logic for handling health check requests
 */
 const os = require('os'),

 HealthRepository = require('../repository/HealthRepository'),
 TransactionService = require('../services/TransactionService');

module.exports = {
 /**
 * Used to do sanity for db/cache connections
 *
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
 check: async function (req, res) {
   let transaction;

   try {
     transaction = await TransactionService.start();

     const healthRecord = await HealthRepository.findAll({ attributes: ['id'] });

     if (!healthRecord || healthRecord.length === 0) {
       await HealthRepository.create({
         id: 1,
         createdAt: Date.now(),
         updatedAt: Date.now()
       }, transaction);
     }
     else {
       const healthRecordId = healthRecord && healthRecord[0] && healthRecord[0].id;

       await HealthRepository.update({
         data: { updatedAt: Date.now() },
         where: { id: healthRecordId }
       }, transaction);
     }

     await TransactionService.commit(transaction);

     return res.send({ success: true });
   }

   catch (e) {
     TransactionService.rollback(transaction);

     return res.status(500).send({
       statusCode: 500,
       error: e,
       message: 'HealthController~check: failed'
     });
   }
 },

 /**
 * This is a function to respond to api calls on root
 *
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
 status: function (req, res) {
   let applicationVersion = require('../../package.json').version,
     uptime = -1,
     mem = -1,
     load = [];

   try {
     mem = os.freemem() / os.totalmem();
     load = os.loadavg();
     uptime = os.uptime();
   }

   catch (err) {
     // Add error handling here
   }

   res.send({
     version: applicationVersion,
     uptime: uptime,
     mem: mem,
     load: load
   });
 }
};
