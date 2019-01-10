import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {chain, string} from '#/main/core/validation'

import {HtmlGroup} from '#/main/core/layout/form/components/group/html-group'
import {HtmlCell} from '#/main/app/data/html/components/table'
import {HtmlText} from '#/main/core/layout/components/html-text'

const dataType = {
  name: 'html',
  meta: {
    creatable: true,
    icon: 'fa fa-fw fa fa-code',
    label: trans('html'),
    description: trans('html_desc')
  },
  // nothing special to do
  parse: (display) => display,
  render: (raw) => {
    const htmlRendered = React.createElement(HtmlText, {}, raw)

    return htmlRendered
  },
  validate: (value, options) => chain(value, options, [string]),
  components: {
    table: HtmlCell,
    form: HtmlGroup
  }
}

export {
  dataType
}
