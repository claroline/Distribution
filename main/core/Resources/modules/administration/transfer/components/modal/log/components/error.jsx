import React from 'react'
import {trans} from '#/main/core/translation'

const Error = error => {
  return(
    <pre>
      <div>{trans('line')}: {error.line}</div>
      {typeof error.value === 'string' ?
        error.value:
        Object.keys(error.value).map(key => <div>{error.value[key].path}: {error.value[key].message}</div>)
      }
    </pre>
  )
}

  Error.propTypes = {
  }

export {Error}
