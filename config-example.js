module.exports = {

 debug: false,

 capture_versions: false,

 max_limit: 100,

 db: {
   elastic: {
     host: 'localhost:9200',
     log: [{
       type: 'stdio',
       levels: ['error', 'warning']
     }]
   }
 }
 
}
