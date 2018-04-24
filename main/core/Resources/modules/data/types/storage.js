import {trans} from '#/main/core/translation'
import {chain, number, inRange} from '#/main/core/validation'

import {StorageGroup} from '#/main/core/layout/form/components/group/storage-group'

const STORAGE_TYPE = 'storage'

/**
 * Storage definition.
 * Manages storage size values.
 */
const storageDefinition = {
  meta: {
    type: STORAGE_TYPE,
    creatable: false,
    icon: 'fa fa-fw fa fa-database',
    label: trans('storage'),
    description: trans('storage_desc')
  },

  //parse: (display) => parseFloat(display),

  /**
   * Displays a number value.
   * NB. trans typing to string permits to avoid React interpret 0 value as falsy and display nothing.
   *
   * @param {number}  raw
   * @param {options} options
   *
   * @return {string}
   */
  //render: (raw, options) => raw || 0 === raw ? raw + (options.unit ? ' ' + options.unit : '') : null,

  /**
   * Validates a number value.
   *
   * @param {mixed}  value   - the value to validate
   * @param {object} options - the current number options
   *
   * @return {string} - the first error message if any
   */
  //validate: (value, options) => chain(value, options, [number, inRange]),

  /**
   * Custom components for numbers rendering.
   */
  components: {
    form: StorageGroup
  }
}

export {
  STORAGE_TYPE,
  storageDefinition
}
