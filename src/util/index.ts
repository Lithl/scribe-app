/**
 * Creates a deep copy of any value (functions, strings, and primitives will not
 * be cloned). Class objects with a no-arg constructor will be constructed
 * properly, as will the following object types with a constructor that accepts
 * a nonzero number of arguments:
 * - Map
 * - Set
 * 
 * Other class object types will produce a POJSO with the same functions and
 * properties, but they will not be an instance of the class.
 * 
 * This deep copy process will handle circular structures
 * @param obj the value to clone
 * @param [hash=new WeakMap()] a map of values in `obj` to the cloned values;
 * when calling this function, you should generally omit this parameter and
 * allow the default value to be used.
 * @returns a clone of `obj`
 */
export function deepCopy(obj: any, hash = new WeakMap()): any {
  if (typeof obj === 'function' || typeof obj !== 'object') {
    // do not clone functions, strings, or primitives
    return obj;
  }
  
  if (hash.has(obj)) {
    // circular or repeated reference
    return hash.get(obj);
  }
  
  // attempt to construct a class object
  let constructed: any;
  try {
    constructed = new obj.constructor();
  } catch (e) {
    constructed = Object.create(Object.getPrototypeOf(obj));
  }
  
  // handle strict set of standard class objects
  if (obj instanceof Map) {
    Array.from(obj, ([key, val]) =>
        constructed.set(deepCopy(key, hash), deepCopy(val, hash)));
  } else if (obj instanceof Set) {
    Array.from(obj, (key) => constructed.add(deepCopy(key, hash)));
  }
  
  // register object to handle circular structures
  hash.set(obj, constructed);
  
  // clone
  return Object.assign(constructed, ...Object.keys(obj).map((key) =>
      ({[key]: deepCopy(obj[key], hash)})));
}

function ordinalSuffix(num: number) {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

/**
 * Converts a number into a suffixed string
 * @param num the number to convert
 * @returns `num` with a suffix, eg "21st", "2nd", and so on
 */
export function nth(num: number) {
  const n = Math.floor(num);
  const suffix = ordinalSuffix(n);
  return `${n}${suffix}`;
}
