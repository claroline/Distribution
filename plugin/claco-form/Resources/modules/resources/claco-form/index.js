// import {registerModals} from '#/main/core/layout/modal'
// import {registerType} from '#/main/core/data'
// import {FIELDS_TYPE, fieldsDefinition} from '#/main/core/data/types/fields'
//
// import {
//   MODAL_CATEGORY_FORM,
//   CategoryFormModal
// } from '#/plugin/claco-form/resources/claco-form/editor/components/modals/category-form-modal.jsx'
// import {
//   MODAL_KEYWORD_FORM,
//   KeywordFormModal
// } from '#/plugin/claco-form/resources/claco-form/editor/components/modals/keyword-form-modal.jsx'
//
// // register custom modals
// registerModals([
//   [MODAL_CATEGORY_FORM, CategoryFormModal],
//   [MODAL_KEYWORD_FORM, KeywordFormModal]
// ])
//
// registerType(FIELDS_TYPE,  fieldsDefinition)

import {ClacoFormResource} from '#/plugin/claco-form/resources/claco-form/components/resource'
import {reducer} from '#/plugin/claco-form/resources/claco-form/reducer'

/**
 * ClacoForm resource application.
 *
 * @constructor
 */
export const App = () => ({
  component: ClacoFormResource,
  store: reducer,
  styles: 'claroline-distribution-plugin-claco-form-claco-form-resource',
  initialData: initialData => Object.assign({}, initialData, {
    clacoForm: initialData.clacoForm,
    resource: {
      node: initialData.resourceNode,
      evaluation: initialData.evaluation
    },
    canGeneratePdf: initialData.canGeneratePdf === 1,
    entries: {
      myEntriesCount: initialData.myEntriesCount
    },
    cascadeLevelMax: initialData.cascadeLevelMax,
    roles: initialData.roles,
    myRoles: initialData.myRoles
  })
})
