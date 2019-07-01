const { levels, defaults: defaultOpts, colors } = require('../../config');
const {	isTrue, inspect, colorize } = require('../utils');

const BR = require('../classes/BR');
const Title = require('../classes/Title');
const Secret = require('../classes/Secret');
const Timers = require('../classes/Timers');
const Levels = require('../classes/Levels');

const levels = new Levels(levels.filter(({ level }) => (!!level)));
var defaultInterface;

function load({
    mode = 'separate',
    disableColors = false,
    maxLevel
}){
    var printFunction;
    switch (mode) {
        case 'sync':
            printFunction = ({ value, ...opts }) => {

            }; 
            break;
        case 'async':
            printFunction = async ({ value, ...opts }) => {
                
            }; 
            break;
        case 'separate':
        default:
            this._seed = require('child_process').fork(path.join(__dirname, 'logger.js'), [], {
                stdio: ['ipc', 1, 1]
            });
            this._seed.unref();
            process.on('beforeExit', () => {
                this._seed.kill();
            });
            printFunction = (opts) => {
                this._seed.send(opts);
            };
    }
    this.log = (...value) => {
        printFunction({
            level: null,
            emitter,
            value
        });
    };
    levels.forEach(({ level, color, error }, index) => {
        if (index <= maxLevel) {
            this[level] = (...value) => {
                printFunction({
                    index,
                    level,
                    color: disableColors ? false : color,
                    error,
                    emitter,
                    value
                });
            }
        } else {
           this[level] = () => {};
        }
    });
}

class Interface {
    constructor (options = {}){
        this.apply = (options) => {
            const _opts = {...defaultOpts, ...options};
            this.mode = ['sync','async','separate'].indexOf(_opts.mode) !== -1 ? _opts.mode : 'separate';
            load.call(this, {
                mode: this.mode,
                disableColors: isTrue(_opts.disableColors),
                defaultTransporter: {
                    stdout: options.stdout,
                    stderr: options.stderr,
                    output: options.output,
                    level: options.level
                },
                transporters: options.transporters
            });
            this.secret = (value, {
                mask = _opts.secretMask,
                level = _opts.secretLevel,
                maxLength = _opts.secretMaxLength
            } = {
                mask: _opts.secretMask,
                level: _opts.secretLevel,
                maxLength: _opts.secretMaxLength
            }) => {
                const hidden = this.levs.get(level) > this.printer.maxLevel;
                return new Secret(value, {
                    mask,
                    level,
                    hidden,
                    maxLength
                });
            }        
            this.new = (_options) => {
                const { transporters, ...rest } = _opts;
                return new Interface({ ...rest, ..._options });
            }
        }            
        this.inspect = inspect.bind(this);
        this.color = colorize.bind(this);
        this.title = Title.bind(this);    
        this.timers = Timers;        
        this.apply(options);
    }
    get br(){
        return new BR();
    }
}

defaultInterface = new Interface(defaultOpts);
module.exports = defaultInterface;
