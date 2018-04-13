import {bootstrap} from '#/main/core/scaffolding/bootstrap'
import {registerModals} from '#/main/core/layout/modal'
import {registerType} from '#/main/core/data'
import {FIELDS_TYPE, fieldsDefinition} from '#/main/core/data/types/fields'

import {reducer} from '#/plugin/claco-form/resources/claco-form/reducer'
import {ClacoFormResource} from '#/plugin/claco-form/resources/claco-form/components/resource.jsx'
import {
  MODAL_CATEGORY_FORM,
  CategoryFormModal
} from '#/plugin/claco-form/resources/claco-form/editor/components/modals/category-form-modal.jsx'
import {
  MODAL_KEYWORD_FORM,
  KeywordFormModal
} from '#/plugin/claco-form/resources/claco-form/editor/components/modals/keyword-form-modal.jsx'
import {FieldFormModal} from '#/plugin/claco-form/resources/claco-form/editor/field/components/field-form-modal.jsx'

// register custom modals
registerModals([
  [MODAL_CATEGORY_FORM, CategoryFormModal],
  [MODAL_KEYWORD_FORM, KeywordFormModal],
  ['MODAL_FIELD_FORM', FieldFormModal]
])

registerType(FIELDS_TYPE,  fieldsDefinition)

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.claco-form-container',

  // app main component
  ClacoFormResource,

  // app store configuration
  reducer,

  // transform data attributes for redux store
  (initialData) => {
    const clacoForm = initialData.clacoForm

    return {
      user: initialData.user,
      clacoForm: clacoForm,
      resourceNode: initialData.resourceNode,
      isAnon: !initialData.user,
      canGeneratePdf: initialData.canGeneratePdf === 1,
      fields: initialData.fields,
      entries: initialData.entries,
      myEntriesCount: initialData.myEntriesCount,
      cascadeLevelMax: initialData.cascadeLevelMax,
      roles: initialData.roles,
      myRoles: initialData.myRoles
    }
  }
)
