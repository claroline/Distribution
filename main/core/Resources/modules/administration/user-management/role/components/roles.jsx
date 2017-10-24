import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {actions} from '#/main/core/administration/user-management/role/actions'
import {select} from '#/main/core/administration/user-management/role/selectors'

import {enumRole} from '#/main/core/enum/role'
import {MODAL_FORM} from '#/main/core/layout/modal'

import {
  PageContainer as Page,
  PageHeader,
  PageContent,
  PageActions,
  PageAction
} from '#/main/core/layout/page/index'

import {DataList} from '#/main/core/layout/list/components/data-list.jsx'

class Roles extends Component {
  constructor(props) {
    super(props)
  }

  renderModal(item = {}, onSubmit = () => {}) {
    this.props.showModal(MODAL_FORM, {
      title: 'create',
      definition: [
        ['translationKey', 'text', {label: 'name'}],
        ['limit', 'number', {label: 'limit'}]
//        ['hasWorkspace', 'checkbox', {label: 'has_workspace'}],
//        ['organizations', 'checkboxes', {options: [['hey', 1],['how are you', 2]]}]
      ],
      item,
      onSubmit: (role) => {
        onSubmit(role)
      }
    })
  }

  render() {
    return (
      <Page id="role-management">
        <PageHeader
          title={t('role_management')}
        >
          <PageActions>
            <PageAction
              id="role-add"
              title={t('role_add')}
              icon="fa fa-plus"
              primary={true}
              action={() => this.renderModal({type: 1}, this.props.addRole)}
            />

            <PageAction
              id="role-import"
              title={t('import_csv')}
              icon="fa fa-download"
              action='#'
            />
          </PageActions>
        </PageHeader>

        <PageContent>
          <DataList
            data={this.props.data}
            name="roles"
            totalResults={this.props.totalResults}
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
            definition={[
              {name: 'name', type: 'string', label: t('name'), displayed: true},
              {name: 'type', type: 'enum', label: t('type'), options: {enum: enumRole}, displayed: false},
              {name: 'translationKey', type: 'string', label: t('translation'), displayed: true}
            ]}
            actions={[
              {
                icon: 'fa fa-fw fa-pencil',
                label: t('edit'),
                action: (row) => {
                  this.renderModal(row, this.props.editRole)
                }
              }
            ]}
          />
        </PageContent>
      </Page>
    )
  }
}

Roles.propTypes = {
  data: T.arrayOf(T.object),
  totalResults: T.number.isRequired,
  showModal: T.func.isRequired,
  editRole: T.func.isRequired,
  addRole: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    data: select.data(state),
    totalResults: select.totalResults(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    //modal
    editRole: (role) => {
      dispatch(actions.editRole(role))
    },
    addRole: (role) => {
      dispatch(actions.addRole(role))
    },

    // modals
    showModal(modalType, modalProps) {
      dispatch(modalActions.showModal(modalType, modalProps))
    }
  }
}

const ConnectedRoles = connect(mapStateToProps, mapDispatchToProps)(Roles)

export {ConnectedRoles as Roles}
