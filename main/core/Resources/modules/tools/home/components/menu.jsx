import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {Button} from '#/main/app/action/components/button'
import {LINK_BUTTON} from '#/main/app/buttons'

const HomeMenu = (props) => {
  if (0 !== props.tabs.length) {
    return (
      <div className="list-group">
        {props.tabs.map(tab =>
          <Button
            key={tab.id}
            className="list-group-item"
            type={LINK_BUTTON}
            icon={tab.icon ? `fa fa-fw fa-${tab.icon}` : undefined}
            label={tab.title}
            target={`${props.basePath}/tab/${tab.id}`}
            activeStyle={{
              borderColor: get(tab, 'display.color')
            }}
          />
        )}
      </div>
    )
  }

  return null
}

HomeMenu.propTypes = {
  basePath: T.string.isRequired,
  tabs: T.arrayOf(T.shape({
    // TODO : tab types
  }))
}

HomeMenu.defaultProps = {
  tabs: []
}

export {
  HomeMenu
}
