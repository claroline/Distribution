import React from 'react'

import {PropTypes as T, implementPropTypes} from '#/main/core/scaffolding/prop-types'
import {DataSearch as DataSearchTypes} from '#/main/core/data/prop-types'

const EnumPlusSearch = () => {
  return (
    <span className="enum-filter">

    </span>
  )
}

implementPropTypes(EnumPlusSearch, DataSearchTypes, {
  choices: T.array.isRequired
})

export {
  EnumPlusSearch
}
