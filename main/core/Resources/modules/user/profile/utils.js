import {t} from '#/main/core/translation'

function getMainFacet(facets) {
  return facets.find(facet => facet.meta.main) || facets[0]
}

function getDetailsDefaultSection(userData) {
  return {
    id: 'default-props',
    title: t('general'),
    primary: true,
    fields: [

    ]
  }
}

function getFormDefaultSection(userData, isNew = false) {
  return {
    id: 'default-props',
    title: t('general'),
    primary: true,
    fields: [
      {
        name: 'lastName',
        type: 'string',
        label: t('last_name'),
        required: true
      }, {
        name: 'firstName',
        type: 'string',
        label: t('first_name'),
        required: true
      }, {
        name: 'email',
        type: 'email',
        label: t('email'),
        required: true
      }, {
        name: 'username',
        type: 'username',
        label: t('username'),
        required: true,
        disabled: !isNew && (!userData.meta || !userData.meta.administrate)
      }, {
        name: 'plainPassword',
        type: 'password',
        label: t('password'),
        displayed: isNew,
        required: true
      }
    ]
  }
}

export {
  getDetailsDefaultSection,
  getFormDefaultSection,
  getMainFacet
}
