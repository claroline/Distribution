import React from 'react'

const Loader = () =>
  <div className="api-loader">
    <span className="fa fa-circle-o-notch fa-spin fa-lg fa-fw"></span>
    <span className="sr-only">Loading...</span>
  </div>

export {Loader}
