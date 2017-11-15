import React from 'react'
import {trans} from '#/main/core/translation'

export const Menu = () =>
  <span>
    <a
      href="#/my/drop"
      className="btn btn-default"
    >
      {trans('my_drop', {}, 'dropzone')}
    </a>
  </span>