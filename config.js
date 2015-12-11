module.exports = {

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
