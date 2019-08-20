import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {ListData} from '#/main/app/content/list/containers/data'
import {selectors as toolSelectors} from '#/main/core/tool/store'
import issue from '#/plugin/open-badge/tools/badges/badge/actions/issue'
import {LINK_BUTTON} from '#/main/app/buttons'

import {AssertionList} from '#/plugin/open-badge/tools/badges/assertion/components/definition'

const AssertionsList = (props) => {

  return (
    <ListData
      name={props.name}
      fetch={{
        url: props.url,
        autoload: true
      }}
      primaryAction={(row) => ({
        type: LINK_BUTTON,
        target: props.path + `/badges/assertion/${row.id}`,
        label: trans('', {}, 'actions')
      })}
      definition={AssertionList.definition}
      actions={(rows) => [issue(rows)]}
      card={AssertionList.card}
    />
  )
}

AssertionsList.propTypes = {
  currentUser: T.object,
  name: T.string.isRequired,
  url: T.oneOfType([T.string, T.array]).isRequired,
  invalidate: T.func.isRequired,
  disable: T.func.isRequired,
  enable: T.func.isRequired,
  currentContext: T.object.isRequired,
  path: T.string.isRequired
}

export const Assertions = connect(
  (state) => ({
    path: toolSelectors.path(state)
  })
)(AssertionsList)
