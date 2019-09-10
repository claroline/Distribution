import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ToolPage} from '#/main/core/tool/containers/page'

import {selectors} from '#/main/core/tools/parameters/store'

const ExternalTool = (props) =>
  <ToolPage
    path={[{
      type: LINK_BUTTON,
      label: trans('external', {}, 'integration'),
      target: `${props.path}/`
    }]}
    subtitle={trans('external', {}, 'integration')}
  >

  </ToolPage>

ExternalTool.propTypes = {

}

export {
  ExternalTool
}
