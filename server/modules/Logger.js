'use strict';

let util  = require('util');
let chalk = require('chalk');

class Logger {

    constructor(namespace, config) {
        if (namespace.length < 21) {
            namespace += ' '.repeat(21 - namespace.length);
        }

        this.namespace = namespace;
        if (config && config.environment.verbose) {
            this.debug = true
        } else {
            this.debug = false;
        }
    }

    _log(color, message) {
        console.log(chalk[color](chalk.bold(this.namespace) + ' ' + message));
    }

    error(message, error) {
        this._log('red', message);
        if (error) {
            this._log('red', error);
        }
    }

    info(message, object) {
        this._log('cyan', message);
        if (object && this.debug) {
            this._log('grey', util.inspect(object));
        }
    }

    success(message) {
        this._log('green', message);
    }

    verbose(message) {
        if (this.debug) {
            this._log('grey', message);
        }
    }

    warning(message) {
        this._log('yellow', message);
    }

};

module.exports = Logger;