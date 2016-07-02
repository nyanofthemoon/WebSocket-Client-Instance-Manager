'use strict';

module.exports = {

    environment: {
        name:      process.env.NODE_ENV   || 'development',
        host:      process.env.HOSTNAME   || 'localhost',
        port:      process.env.PORT       || 8000,
        verbose:   process.env.VERBOSE    || true
    }

}