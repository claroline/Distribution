import React from 'react'
import {trans} from '#/main/core/translation'

const Success = success => {
  return(
    <pre>
      {success.log}
    </pre>
  )
}

  Success.propTypes = {
  }

export {Success}
