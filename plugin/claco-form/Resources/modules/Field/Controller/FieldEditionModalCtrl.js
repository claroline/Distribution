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

export default class FieldEditionModalCtrl {
  constructor($http, $uibModalInstance, FieldService, resourceId, field, title, callback) {
    this.$http = $http
    this.$uibModalInstance = $uibModalInstance
    this.resourceId = resourceId
    this.source = field
    this.title = title
    this.callback = callback
    this.field = {
      name: null,
      type: null,
      required: true,
      searchable: true,
      isMetadata: false,
      choices: []
    }
    this.fieldErrors = {
      name: null
    }
    this.types = FieldService.getTypes()
    this.type = null
    this.initializeField()
  }

  initializeField () {
    this.field['name'] = this.source['name']
    this.field['type'] = this.source['type']
    this.field['required'] = this.source['required']
    this.field['searchable'] = this.source['searchable']
    this.field['isMetadata'] = this.source['isMetadata']
    const selectedType = this.types.find(t => t['value'] === this.source['type'])
    this.type = selectedType
  }

  submit () {
    this.resetErrors()

    if (!this.field['name']) {
      this.fieldErrors['name'] = Translator.trans('form_not_blank_error', {}, 'clacoform')
    }
    this.field['type'] = this.type['value']

    if (this.isValid()) {
      const checkNameUrl = Routing.generate(
        'claro_claco_form_get_field_by_name_excluding_id',
        {clacoForm: this.resourceId, name: this.field['name'], id: this.source['id']}
      )
      this.$http.get(checkNameUrl).then(d => {
        if (d['status'] === 200) {
          if (d['data'] === 'null') {
            const url = Routing.generate('claro_claco_form_field_edit', {field: this.source['id']})
            this.$http.put(url, {fieldData: this.field}).then(d => {
              this.callback(d['data'])
              this.$uibModalInstance.close()
            })
          } else {
            this.fieldErrors['name'] = Translator.trans('form_not_unique_error', {}, 'clacoform')
          }
        }
      })
    }
  }

  resetErrors () {
    for (const key in this.fieldErrors) {
      this.fieldErrors[key] = null
    }
  }

  isValid () {
    let valid = true

    for (const key in this.fieldErrors) {
      if (this.fieldErrors[key]) {
        valid = false
        break
      }
    }

    return valid
  }

  manageTypes () {
    console.log(this.type)
  }
}
