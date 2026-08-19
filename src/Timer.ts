// Remanxnce's Timer System (For Simple Timers!) Ported to TypeScript by BlueIceCrown
// Author: AG Remanxnce
// Project: Timer Class
//-------------------------------------------------------------------------

export type TimeMeasurement =
    | "milliseconds" | "ms"
    | "seconds" | "sec"
    | "minutes" | "min"
    | "hours" | "hour"
    | "days" | "day"
    | "weeks" | "week";

export interface TimerObject {
    initialTime: number;
    initalMeasurement: TimeMeasurement;
    began: number;
    changed: number | null;
    expiration: Date | number;
    frozen?: boolean;
    frozenExpiration?: Date | number | null;
}

export interface TimeBreakdown {
    rawTime: number;
    weeks: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}

/**
 * Create a timer to be used in-game.
 */
class Timer {
    /**
     * Create a timer.
     * @example
     * Timer.set(10, "sec");
     * Timer.set(10, "ms");
     * Timer.set(5);
     * Timer.set(30, "min");
     * Timer.set(1, "day");
     * let timeHolder = Timer.set(1, "hour");
     */
    static set(time: number, measurement: TimeMeasurement = 'sec'): TimerObject {
        this.#validate(time, measurement);
        const timeEnd = new Date();
        this.#handler(timeEnd, time, measurement);
        return {
            initialTime: time,
            initalMeasurement: measurement,
            began: Date.now(),
            changed: null,
            expiration: timeEnd
        };
    }

    /**
     * Increase the duration of an existing timer.
     * @example
     * let timeHolder = Timer.set(1, "hour");
     * Timer.add(timeHolder, 10, "minutes");
     * Timer.add(timeHolder, 5, "hours");
     * Timer.add(timeHolder, 1, "week");
     */
    static add(timer: TimerObject, time: number, measurement: TimeMeasurement = 'sec'): TimerObject {
        this.#validate(time, measurement, timer);
        const timeEnd = new Date(timer.expiration);
        this.#handler(timeEnd, time, measurement);
        return {
            ...timer,
            changed: Date.now(),
            expiration: timeEnd
        };
    }

    /**
     * Decrease the duration of an existing timer.
     * @example
     * let timeHolder = Timer.set(1, "hour");
     * Timer.remove(timeHolder, 30, "minutes");
     * Timer.remove(timeHolder, 10, "seconds");
     * Timer.remove(timeHolder, 1, "hour");
     */
    static remove(timer: TimerObject, time: number, measurement: TimeMeasurement = 'sec'): TimerObject {
        this.#validate(time, measurement, timer);
        const timeEnd = new Date(timer.expiration);
        this.#handler(timeEnd, -Math.abs(time), measurement);
        return {
            ...timer,
            changed: Date.now(),
            expiration: timeEnd
        };
    }

    /**
     * Completely change a timer while still retaining other information.
     * @example
     * let timeHolder = Timer.set(1, "hour");
     * Timer.overwrite(timeHolder, 1, "Minute");
     * Timer.overwrite(timeHolder, 10, "ms");
     * Timer.overwrite(timeHolder, 1, "weeks");
     */
    static overwrite(timer: TimerObject, time: number, measurement: TimeMeasurement = 'sec'): TimerObject {
        this.#validate(time, measurement, timer);
        const timeEnd = new Date();
        this.#handler(timeEnd, time, measurement);
        return {
            ...timer,
            changed: Date.now(),
            expiration: timeEnd
        };
    }

    /**
     * Restore a timer back to the original time it was given.
     * @example
     * let timeHolder = Timer.set(1, "hour");
     * Timer.overwrite(timeHolder, 1, "Minute");
     * Timer.reset(timeHolder);
     */
    static reset(timer: TimerObject): TimerObject {
        if (typeof timer !== 'object') throw new Error(`timer must be object type`);
        return this.overwrite(timer, timer.initialTime, timer.initalMeasurement);
    }

    /**
     * Check if a certain amount of time has passed within a timer.
     * @example
     * let exTime = Timer.set(10, `sec`)
     * system.runInterval(() => {
     *   console.warn(Timer.hasPassed(exTime, 3, `seconds`)),
     * }, 20)
     */
    static hasPassed(timer: TimerObject, time: number, measurement: TimeMeasurement = 'sec'): boolean {
        this.#validate(time, measurement, timer);
        const checkTime = new Date(timer.changed ?? timer.began);
        this.#handler(checkTime, time, measurement);
        return new Date() >= checkTime;
    }

    /**
     * Check if a timer object has reached the end.
     * @example
     * let test = Timer.set(3, `sec`);
     * system.runInterval(() => {
     *   console.warn(Timer.hasExpired(test)),
     * }, 20);
     */
    static hasExpired(timer: TimerObject): boolean {
        const currentTime = Date.now();
        const expirationTime = new Date(timer.expiration).getTime();
        return currentTime >= expirationTime;
    }

    /**
     * Check if a timer object has been modified after creation.
     * @example
     * let newTimer = Timer.set(10);
     * Timer.hasChanged(newTimer); //false
     * newTimer = Timer.overwrite(newTimer, 3, `day`);
     * Timer.hasChanged(newTimer); //true
     */
    static hasChanged(timer: TimerObject): boolean {
        return timer.changed ? true : false;
    }

    /**
     * Check how much time has passed since changing or creating a timer.
     * @example
     * let newTimer = Timer.set(1, "minute");
     * system.runInterval(() => {
     *   let format = Timer.elapsed(newTimer)
     *   console.warn(format.minutes)
     *   console.warn(format.seconds)
     * }, 20);
     */
    static elapsed(timer: TimerObject): TimeBreakdown {
        const started = timer.changed ?? timer.began;
        let elapsedTime = Date.now() - started;

        if (elapsedTime < 0) {
            elapsedTime = 0;
        }

        return this.#format(elapsedTime);
    }

    /**
     * Freeze the timer, stopping it from counting down/up.
     * @example
     * let timer = Timer.set(10, "sec");
     * Timer.freeze(timer);
     */
    static freeze(timer: TimerObject): TimerObject {
        if (!timer || typeof timer !== 'object') throw new Error('Invalid timer object');
        if (timer.frozen) throw new Error('Timer is already frozen');

        return {
            ...timer,
            frozen: true,
            frozenExpiration: timer.expiration
        };
    }

    /**
     * Check if a timer is frozen.
     * @example
     * let timer = Timer.set(10, "sec");
     * Timer.freeze(timer);
     * console.log(Timer.isFrozen(timer)); // true
     * timer = Timer.unfreeze(timer);
     * console.log(Timer.isFrozen(timer)); // false
     */
    static isFrozen(timer: TimerObject): boolean {
        if (!timer || typeof timer !== 'object') throw new Error('Invalid timer object');
        return timer.frozen === true;
    }

    /**
     * Unfreeze the timer, resuming the countdown/up from where it was paused.
     * @example
     * let timer = Timer.set(10, "sec");
     * timer = Timer.freeze(timer);
     * Timer.unfreeze(timer);
     */
    static unfreeze(timer: TimerObject): TimerObject {
        if (!timer || typeof timer !== 'object') throw new Error('Invalid timer object');
        if (!timer.frozen) throw new Error('Timer is not frozen');

        const currentTime = Date.now();
        const frozenTime = new Date(timer.frozenExpiration!).getTime();
        const elapsedFrozenTime = currentTime - frozenTime;

        const newExpiration = new Date(timer.frozenExpiration!).getTime() + elapsedFrozenTime;

        return {
            ...timer,
            frozen: false,
            frozenExpiration: null,
            expiration: newExpiration
        };
    }

    /**
     * Check how long until a timer expires.
     * @example
     * let newTimer = Timer.set(1, "minute");
     * system.runInterval(() => {
     *   let format = Timer.remaining(newTimer)
     *   console.warn(format.minutes)
     *   console.warn(format.seconds)
     * }, 20);
     */
    static remaining(timer: TimerObject): TimeBreakdown {
        const expiration = new Date(timer.expiration).getTime();
        let remainingTime = expiration - Date.now();

        if (remainingTime < 0) {
            remainingTime = 0;
        }

        return this.#format(remainingTime);
    }

    /**
     * Check how long has passed since a given timestamp.
     * @example
     * world.setDynamicProperty(`timer`, Date.now());
     * system.runInterval(() => {
     *   let format = world.getDynamicProperty(`timer`)
     *   console.warn(Timer.get(format).seconds)
     * }, 20);
     */
    static get(timeStamp: number | Date): TimeBreakdown {
        const stamp = timeStamp instanceof Date ? timeStamp.getTime() : timeStamp;
        if (!Number.isInteger(stamp)) throw new Error(`Timestamp must be integer type`);
        return this.#format(Date.now() - stamp);
    }

    /**
     * Check the amount of time inbetween two timestamps.
     * @example
     * world.setDynamicProperty(`timer`, Date.now());
     * world.setDynamicProperty(`timer2`, Date.now() + 4000);
     * system.runInterval(() => {
     *   let timer1 = world.getDynamicProperty(`timer`)
     *   let timer2 = world.getDynamicProperty(`timer2`)
     *   console.warn(Timer.difference(timer1, timer2))
     * }, 20);
     */
    static difference(time1: number, time2: number): TimeBreakdown {
        return this.#format(time1 - time2);
    }

    static #format(value: number): TimeBreakdown {
        const isNegative = value < 0;
        value = Math.abs(value);

        const weeks = Math.floor(value / (1000 * 60 * 60 * 24 * 7));
        const days = Math.floor(value / (1000 * 60 * 60 * 24));
        const hours = Math.floor((value / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((value / (1000 * 60)) % 60);
        const seconds = Math.floor((value / 1000) % 60);
        const milliseconds = Math.floor(value % 1000);

        return {
            rawTime: isNegative ? -value : value,
            weeks: isNegative ? -weeks : weeks,
            days: isNegative ? -days : days,
            hours: isNegative ? -hours : hours,
            minutes: isNegative ? -minutes : minutes,
            seconds: isNegative ? -seconds : seconds,
            milliseconds: isNegative ? -milliseconds : milliseconds
        };
    }

    static #handler(date: Date, time: number, measurement: TimeMeasurement): void {
        switch (measurement.toLowerCase()) {
            case 'weeks':
            case 'week':
                date.setDate(date.getDate() + (time * 7));
                break;
            case 'days':
            case 'day':
                date.setDate(date.getDate() + time);
                break;
            case 'hours':
            case 'hour':
                date.setHours(date.getHours() + time);
                break;
            case 'minutes':
            case 'min':
                date.setMinutes(date.getMinutes() + time);
                break;
            case 'seconds':
            case 'sec':
                date.setSeconds(date.getSeconds() + time);
                break;
            case 'milliseconds':
            case 'ms':
                date.setMilliseconds(date.getMilliseconds() + time);
                break;
            default:
                throw new Error('Unsupported time measurement');
        }
    }

    static #validate(time: number, measurement: TimeMeasurement, timer: TimerObject | 'Ignored' = 'Ignored'): void {
        if (timer !== 'Ignored' && (typeof timer !== 'object' || timer == null)) {
            throw new Error('Timer must be an object type');
        }
        if (!Number.isInteger(time)) throw new Error('Time must be integer type');
        if (typeof measurement !== 'string' || measurement == null) {
            throw new Error(`Measurement must be string type`);
        }
    }
}

export default Timer;