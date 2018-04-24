import React from 'react'
import {trans} from '#/main/core/translation'

const Error = error => {
  console.log(error)
  return(<pre>
    <div>{trans('line')}: {error.line}</div>
    {Object.keys(error.value).map(key => <div>{error.value[key].path}: {error.value[key].message}</div>)}
  </pre>
  )
}

  Error.propTypes = {
  }

export {Error}
