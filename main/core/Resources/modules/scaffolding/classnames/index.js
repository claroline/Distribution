import {uniq} from 'lodash'
/**
 * Parses array of classes to classes e.g. ['class1', 'class2'] -> 'class1 class2'
 * @param classes
 * @param array
 */
function parseArray(classes, array) {
  for (let i = 0; i < array.length; i++) {
    parse(classes, array[i])
  }
}

/**
 * Parse numbers to classes e.g 123 -> '123'
 * @param classes
 * @param num
 */
function parseNumber(classes, num) {
  classes.push(num)
}

/**
 * Parse object keys to classes if key value is true e.g. {myClass: true} -> 'myClass'
 * @param classes
 * @param object
 */
function parseObject(classes, object) {
  for (let k in object) {
    if (object[k]) {
      classes.push(k)
    }
  }
}

/**
 * Parses string to classes
 * @param classes
 * @param str
 */
function parseString(classes, str) {
  let array = str.split(/\s+/)
  for (let i = 0; i < array.length; i++) {
    classes.push(array[i])
  }
}

/**
 * Parse argument to classes
 * @param classes
 * @param arg
 */
function parse(classes, arg) {
  if (!arg) {
    return
  }
  
  if (Array.isArray(arg)) {
    parseArray(classes, arg)
    return
  }
  
  switch (typeof arg) {
    case 'string':
      parseString(classes, arg)
      break
    case 'object':
      parseObject(classes, arg)
      break
    case 'number':
      parseNumber(classes, arg)
      break
    default:
      break
  }
}

const classNames = (...args) => {
  let classes = []
  parseArray(classes, args)
  classes = uniq(classes)
  
  return classes.join(' ')
}

export {
  classNames
}
