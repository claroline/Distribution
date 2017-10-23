import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {actions} from '#/main/core/administration/user-management/user/actions'
import {select} from '#/main/core/administration/user-management/user/selectors'

import {
  PageContainer as Page,
  PageHeader,
  PageContent,
  PageActions,
  PageAction
} from '#/main/core/layout/page/index'

import {LIST_PROP_DISPLAYED, LIST_PROP_FILTERABLE} from '#/main/core/layout/list/utils'
import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

class Users extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Page id="user-management">
        <PageHeader
          title={t('user-management')}
        >
          <PageActions>
            <PageAction
              id="user-add"
              title={t('create_user')}
              icon="fa fa-plus"
              primary={true}
              action='#'
            />

            <PageAction
              id="user-import"
              title={t('import_csv')}
              icon="fa fa-download"
              action='#'
            />
          </PageActions>
        </PageHeader>

        <PageContent>
          <DataList
            name="users"
            definition={[
              {
                name: 'name',
                type: 'string',
                label: t('name'),
                renderer: (rowData) => <a href='#'> {rowData.lastName} {rowData.firstName}</a>,
                flags: ~LIST_PROP_FILTERABLE,
                displayed: true
              },
              {
                name: 'username',
                type: 'string',
                label: t('username'),
                flags: LIST_PROP_FILTERABLE&LIST_PROP_DISPLAYED,
                displayed: true
              },
              {
                name: 'firstName',
                type: 'string',
                label: t('first_name'),
                flags: LIST_PROP_FILTERABLE&~LIST_PROP_DISPLAYED,
                displayed: true
              },
              {
                name: 'lastName',
                type: 'string',
                label: t('last_name'),
                flags: LIST_PROP_FILTERABLE&~LIST_PROP_DISPLAYED,
                displayed: true
              }
            ]}
            card={(row) => {

            }}
          />
        </PageContent>
      </Page>
    )
  }
}

Users.propTypes = {

}

function mapDispatchToProps(dispatch) {
  return {
    // modals
    showModal(modalType, modalProps) {
      dispatch(modalActions.showModal(modalType, modalProps))
    }
  }
}

const ConnectedUsers = connect(null, mapDispatchToProps)(Users)

export {ConnectedUsers as Users}
