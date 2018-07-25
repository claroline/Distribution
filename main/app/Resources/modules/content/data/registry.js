/**
 * Data registry.
 *
 * It contains all the data types declared in the application.
 */
import {checkPropTypes} from 'prop-types'

import {declareRegistry} from '#/main/app/registry'
import {DataType} from '#/main/app/content/data/prop-types'

// declares a new registry to grab data types
const registry = declareRegistry('dataTypes')
  /**
   * Add default values to a data type when it's registered.
   */
  .setDefaults((entry) => Object.assign(DataType.defaultProps, entry))

  /**
   * Validate a data type when it's registered.
   */
  .validate((entry) => checkPropTypes(DataType.propTypes, entry, 'prop', 'DATA_TYPE'))

export {
  registry
}
