'use strict';

module.exports = {

    environment: {
        name:    process.env.NODE_ENV    || 'development',
        port:    process.env.PORT        || 8888,
        verbose: process.env.VERBOSE     || true
    },

    user: {
        salt       : process.env.USER_SALT || '@perderd3rZ#',
        defaultName: 'Unnamed'
    }

}