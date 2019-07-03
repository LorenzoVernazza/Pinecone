import BR from '../classes/BR';
import Ellipsis from '../classes/Ellipsis';
import Group from '../classes/Group';
import LevelsContructor from '../classes/Levels';
import Secret from '../classes/Secret';
import Timers from '../classes/Timers';
import Title from '../classes/Title';
import { inspect } from '../utils';

/**
 * Logger main class.
 */
declare class Interface {
    apply = (newOptions) => this;
    inspect = inspect;
    ellipsis = (new Ellipsis(_opts.ellipsisAt)).trim;
    secret = (value, {
                mask = _opts.secretMask,
                level = _opts.secretLevel,
                maxLength = _opts.secretMaxLength
            }) => Secret;

    constructor (options = {}){
            _opts = loadOptions(newOptions, _opts);
            loadLevels.call(this, _opts);

            this.
            this.
            this.new = (_options) => {
                const { transporters, ...rest } = _opts;
                return new Interface({ ...rest, ..._options });
            }
            this.newGroup = (...members) => {
                return new Group({
                    inspect: this.inspect,
                    ellipsis: this.ellipsis,
                    secret: this.secret,
                    color: colorize,
                    title: Title,
                    timers: Timers,
                }, levels, this, members)
            }
            Object.seal(this);
            return this;
        }
        this.color = colorize;
        this.title = Title;    
        this.timers = Timers;        
        Object.defineProperty(this, 'level', {
            get: () => (_opts.level.name)
        });
        Object.defineProperty(this, '_opts', {
            get: () => (_opts)
        });
        this.apply(options);
    }
    get br(){
        return new BR();
    }
}

export = Interface