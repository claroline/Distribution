import merge from 'lodash/merge'
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

export {
  createFormDefinition
}
