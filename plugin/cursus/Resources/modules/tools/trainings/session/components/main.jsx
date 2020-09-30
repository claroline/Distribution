import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ContentTabs} from '#/main/app/content/components/tabs'
import {ToolPage} from '#/main/core/tool/containers/page'

const SessionMain = (props) =>
  <ToolPage
    path={[{
      type: LINK_BUTTON,
      label: trans('my_courses', {}, 'cursus'),
      target: `${props.path}/registered`
    }]}
    subtitle={trans('my_courses', {}, 'cursus')}
  >
    <header className="row content-heading">
      <ContentTabs
        sections={[
          {
            name: 'current',
            type: LINK_BUTTON,
            label: trans('En cours', {}, 'cursus'),
            target: `${props.path}/current`
          }, {
            name: 'ended',
            type: LINK_BUTTON,
            label: trans('Terminées', {}, 'cursus'),
            target: `${props.path}/ended`
          }, {
            name: 'pending',
            type: LINK_BUTTON,
            label: trans('Inscriptions en attente', {}, 'cursus'),
            target: `${props.path}/pending`
          }
        ]}
      />
    </header>

  </ToolPage>

SessionMain.propTypes = {
  path: T.string.isRequired
}

export {
  SessionMain
}
