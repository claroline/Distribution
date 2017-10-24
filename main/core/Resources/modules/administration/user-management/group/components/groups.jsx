import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {select} from '#/main/core/administration/user-management/group/selectors'

import {
  PageContainer as Page,
  PageHeader,
  PageContent,
  PageActions,
  PageAction
} from '#/main/core/layout/page/index'

import {DataList} from '#/main/core/layout/list/components/data-list.jsx'

class Groups extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Page id="group-management">
        <PageHeader
          title={t('group_management')}
        >
          <PageActions>
            <PageAction
              id="group-add"
              title={t('group_add')}
              icon="fa fa-plus"
              primary={true}
              action='#'
            />

            <PageAction
              id="group-import"
              title={t('import_csv')}
              icon="fa fa-download"
              action='#'
            />
          </PageActions>
        </PageHeader>

        <PageContent>
          <DataList
            data={this.props.data}
            totalResults={this.props.totalResults}
            definition={[
              {
                name: 'name',
                type: 'string',
                label: t('name'),
                displayed: true
              }
            ]}
            card={(row) => ({
              onClick: '#',
              poster: null,
              icon: 'fa fa-users',
              title: row.name,
              subtitle: row.name,
              contentText: '',
              flags: [],
              footer:
                <span>
                  footer
                </span>,
              footerLong:
                <span>
                  footerLong
                </span>
            })}
            actions={[]}
          />
        </PageContent>
      </Page>
    )
  }
}

Groups.propTypes = {
  data: T.arrayOf(T.object),
  totalResults: T.number.isRequired,
  showModal: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    data: select.data(state),
    totalResults: select.totalResults(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // modals
    showModal(modalType, modalProps) {
      dispatch(modalActions.showModal(modalType, modalProps))
    }
  }
}

const ConnectedGroups = connect(mapStateToProps, mapDispatchToProps)(Groups)

export {ConnectedGroups as Groups}
