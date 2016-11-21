/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global Routing*/
/*global Translator*/
import fieldFormTemplate from '../Partial/field_form_modal.html'

export default class FieldService {
  constructor ($http, $uibModal, ClarolineAPIService) {
    this.$http = $http
    this.$uibModal = $uibModal
    this.ClarolineAPIService = ClarolineAPIService
    this.canEdit = FieldService._getGlobal('canEdit')
    this.fields = FieldService._getGlobal('fields')
    this.types = [
      {value: 1, name: Translator.trans('text', {}, 'platform')},
      {value: 2, name: Translator.trans('number', {}, 'platform')},
      {value: 3, name: Translator.trans('date', {}, 'platform')},
      {value: 4, name: Translator.trans('radio', {}, 'platform')},
      {value: 5, name: Translator.trans('select', {}, 'platform')},
      {value: 6, name: Translator.trans('checkboxes', {}, 'platform')},
      {value: 7, name: Translator.trans('country', {}, 'platform')},
      {value: 8, name: Translator.trans('email', {}, 'platform')}
    ]
    this._addFieldCallback = this._addFieldCallback.bind(this)
    this._updateFieldCallback = this._updateFieldCallback.bind(this)
    this._removeFieldCallback = this._removeFieldCallback.bind(this)
  }

  _addFieldCallback (data) {
    let field = JSON.parse(data)
    this.formatField(field)
    this.fields.push(field)
  }

  _updateFieldCallback (data) {
    let field = JSON.parse(data)
    this.formatField(field)
    const index = this.fields.findIndex(f => f['id'] === field['id'])

    if (index > -1) {
      this.fields[index] = field
    }
  }

  _removeFieldCallback (data) {
    const field = JSON.parse(data)
    const index = this.fields.findIndex(f => f['id'] === field['id'])

    if (index > -1) {
      this.fields.splice(index, 1)
    }
  }

  getFields () {
    return this.fields
  }

  getTypes () {
    return this.types
  }

  formatField (field) {
    const type = this.types.find(t => t['value'] === field['type'])
    field['typeName'] = type['name']
  }

  createField (resourceId, callback = null) {
    const addCallback = callback !== null ? callback : this._addFieldCallback
    this.$uibModal.open({
      template: fieldFormTemplate,
      controller: 'FieldCreationModalCtrl',
      controllerAs: 'cfc',
      resolve: {
        resourceId: () => { return resourceId },
        title: () => { return Translator.trans('create_a_field', {}, 'clacoform') },
        callback: () => { return addCallback }
      }
    })
  }

  editField (field, resourceId, callback = null) {
    const updateCallback = callback !== null ? callback : this._updateFieldCallback
    this.$uibModal.open({
      template: fieldFormTemplate,
      controller: 'FieldEditionModalCtrl',
      controllerAs: 'cfc',
      resolve: {
        resourceId: () => { return resourceId },
        field: () => { return field },
        title: () => { return Translator.trans('edit_field', {}, 'clacoform') },
        callback: () => { return updateCallback }
      }
    })
  }

  deleteField (field, callback = null) {
    const url = Routing.generate('claro_claco_form_field_delete', {field: field['id']})
    const deleteCallback = callback !== null ? callback : this._removeFieldCallback

    this.ClarolineAPIService.confirm(
      {url, method: 'DELETE'},
      deleteCallback,
      Translator.trans('delete_field', {}, 'clacoform'),
      Translator.trans('delete_field_confirm_message', {name: field['name']}, 'clacoform')
    )
  }

  static _getGlobal (name) {
    if (typeof window[name] === 'undefined') {
      throw new Error(
        `Expected ${name} to be exposed in a window.${name} variable`
      )
    }

    return window[name]
  }
}