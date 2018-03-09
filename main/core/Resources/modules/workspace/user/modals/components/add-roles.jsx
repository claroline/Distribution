import React from 'react'
import {PropTypes as T} from 'prop-types'

import {t} from '#/main/core/translation'
import {DataFormModal} from '#/main/core/data/form/modals/components/data-form.jsx'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {GroupList} from '#/main/core/administration/user/group/components/group-list.jsx'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'

const MODAL_ADD_ROLES = 'MODAL_ADD_ROLES'

function getRoleEnum(roles) {
  const data = {}

  roles.forEach(role => {
    if (role.id) {
      data[role.id] = role.translationKey
    } else {
      data[role.uuid] = role.translationKey
    }
  })

  return data
}
//{this.props.children}
const AddRolesModal = props =>
  <DataFormModal
    {...props}
    icon="fa fa-fw fa-id-card-o"
    title={t('add_roles')}
    save={(data) => alert(data)}
    sections={[
      {
        id: 'general',
        title: t('general'),
        primary: true,
        fields: [
          {
            name: 'roles',
            type: 'enum',
            label: t('roles'),
            options: {
              multiple: true,
              condensed: false,
              choices: getRoleEnum(props.workspace.roles)
            }
          }
        ]
      }
    ]}
  >
    <FormSections level={6}>
      <FormSection
        id="user-groups"
        className="embedded-list-section"
        icon="fa fa-fw fa-users"
        title={t('groups')}
        disabled={false}
        actions={[]}
      >
        <DataListContainer
          name="all.groups"
          open={GroupList.open}
          fetch={{
            url: ['apiv2_groups'],
            autoload: true
          }}
          definition={GroupList.definition}
          card={GroupList.card}
        />
      </FormSection>
    </FormSections>
  </DataFormModal>

AddRolesModal.propTypes = {
  workspace: T.object.isRequired,
  register: T.func.isRequired,
  roles: T.array.isRequired
}

export {
  MODAL_ADD_ROLES,
  AddRolesModal
}
