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

export default class FieldCreationModalCtrl {
  constructor($http, $uibModalInstance, FieldService, resourceId, title, callback) {
    this.$http = $http
    this.$uibModalInstance = $uibModalInstance
    this.resourceId = resourceId
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
    this.type = this.types[0]
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
        {clacoForm: this.resourceId, name: this.field['name'], id: 0}
      )
      this.$http.get(checkNameUrl).then(d => {
        if (d['status'] === 200) {
          if (d['data'] === 'null') {
            const url = Routing.generate('claro_claco_form_field_create', {clacoForm: this.resourceId})
            this.$http.post(url, {fieldData: this.field}).then(d => {
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

  //manageRolesChoices () {
  //  if (this.workspace) {
  //    this.getWorkspaceRoles()
  //  } else if (this.model) {
  //    this.getModelRoles()
  //  } else {
  //    this.rolesChoices = []
  //  }
  //}

  //getWorkspaceRoles () {
  //  if (this.workspace) {
  //    const url = Routing.generate('course_workspace_roles_translation_keys_retrieve', {workspace: this.workspace['id']})
  //    this.$http.get(url).then(d => {
  //      if (d['status'] === 200) {
  //        this.rolesChoices = []
  //        d['data'].forEach(r => this.rolesChoices.push(r))
  //
  //        if (this.rolesChoices.indexOf(this.course['tutorRoleName']) === -1) {
  //          this.course['tutorRoleName'] = null
  //        }
  //
  //        if (this.rolesChoices.indexOf(this.course['learnerRoleName']) === -1) {
  //          this.course['learnerRoleName'] = null
  //        }
  //      }
  //    })
  //  }
  //}

  //getModelRoles () {
  //  if (this.model) {
  //    const url = Routing.generate('ws_model_roles_translation_keys_retrieve', {model: this.model['id']})
  //    this.$http.get(url).then(d => {
  //      if (d['status'] === 200) {
  //        this.rolesChoices = []
  //        d['data'].forEach(r => this.rolesChoices.push(r))
  //
  //        if (this.rolesChoices.indexOf(this.course['tutorRoleName']) === -1) {
  //          this.course['tutorRoleName'] = null
  //        }
  //
  //        if (this.rolesChoices.indexOf(this.course['learnerRoleName']) === -1) {
  //          this.course['learnerRoleName'] = null
  //        }
  //      }
  //    })
  //  }
  //}
}
