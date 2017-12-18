import isObject from 'lodash/isObject'
import isEmpty from 'lodash/isEmpty'
import merge from 'lodash/merge'
import mergeWith from 'lodash/mergeWith'
import omitBy from 'lodash/omitBy'

import {DataFormSection, DataFormProperty} from '#/main/core/data/form/prop-types'

/**
 * Fills definition with missing default values.
 *
 * @param {Array} sections
 *
 * @return {Array} - the defaulted definition
 */
function createFormDefinition(sections) {
  return sections.map(section => {

    // todo add defaults to advanced section

    return merge({}, DataFormSection.defaultProps, section, {
      fields: section.fields.map(field => merge({}, DataFormProperty.defaultProps, field))
    })
  })
}

/**
 * Removes errors that are now irrelevant (aka undefined) from an error object.
 *
 * @param {object} errors    - the previous error object
 * @param {object} newErrors - the new error object (removed errors are set to `undefined`)
 */
function cleanErrors(errors, newErrors) {
  return omitBy(mergeWith({}, errors, newErrors, (objV, srcV) => {
    // recursive walk in sub objects
    return (isObject(srcV) ? cleanErrors(objV, srcV) : srcV) || null
  }), isEmpty)
}

export {
  createFormDefinition,
  cleanErrors
}
