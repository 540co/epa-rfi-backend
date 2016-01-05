# Air Hound

[![Build Status](https://travis-ci.org/540co/epa-rfi-backend.svg?branch=develop)](https://travis-ci.org/540co/epa-rfi-backend)
[![Test Coverage](https://codeclimate.com/github/540co/epa-rfi-backend/badges/coverage.svg)](https://codeclimate.com/github/540co/epa-rfi-backend/coverage)
[![Code Climate](https://codeclimate.com/github/540co/epa-rfi-backend/badges/gpa.svg)](https://codeclimate.com/github/540co/epa-rfi-backend)

Back end development for the EPA RFI (Air Hound).

## Getting started

Clone repo.

#### Install dependencies

From within the cloned folder `epa-rfi-backend` run:

Node dependencies

```
npm install
```

#### Configuration

From within the cloned folder `epa-rfi-backend` create a *config.json* file:

```
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
  }
}

```

#### Database

Air Hound API requires an Elasticsearch instance running at the host as configured in config.json.  For example, the config above has designated an Elasticsearch db at config.db.elastic.host.

Elasticsearch should contain the TRI Basic Data under a 'epa-release' index and 'records' type.

#### Starting Server

```
npm start
```

#### Testing

```
npm test
```
