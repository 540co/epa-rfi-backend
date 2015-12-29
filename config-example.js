module.exports = {

 debug: true,

 capture_versions: true,

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
