'use strict';

var Container = require('./bootstrap.js');

Container.app.listen(process.env.PORT || 3000);
