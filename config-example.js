module.exports = {

 debug: false,

 capture_versions: false,

 db: {
   elastic: {
     host: 'localhost:9200',
     log: [{
       type: 'stdio',
       levels: ['error', 'warning']
     }]
   }
 },

 service_providers: [
   './Epa/EpaServiceProvider.js'
 ]

}