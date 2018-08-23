import React from 'react'

import {trans} from '#/main/core/translation'
import {HtmlText} from '#/main/core/layout/components/html-text'

const Editor = () =>
  <div className="editor-content alert alert-info">
    {trans('no_configuration_for_resource', {}, 'icap_lesson')}
  </div>

export {
  Editor
}