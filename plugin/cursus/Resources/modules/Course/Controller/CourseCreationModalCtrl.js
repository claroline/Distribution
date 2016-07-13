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
/*global UserPicker*/

export default class CourseCreationModalCtrl {
  constructor($rootScope, $http, $uibModalInstance, CourseService, cursusId, callback) {
    this.$rootScope = $rootScope
    this.$http = $http
    this.$uibModalInstance = $uibModalInstance
    this.cursusId = cursusId
    this.callback = callback
    this.course = {
      title: null,
      code: null,
      description: null,
      icon: null,
      publicRegistration: false,
      publicUnregistration: false,
      defaultSessionDuration: 1,
      withSessionEvent: true,
      workspace: null,
      workspaceModel: null,
      maxUsers: null,
      tutorRoleName: null,
      learnerRoleName: null,
      userValidation: false,
      organizationValidation: false,
      registrationValidation: false,
      validators: []
    }
    this.courseErrors = {
      title: null,
      code: null,
      defaultSessionDuration: null,
      maxUsers: null
    }
    this.tinymceOptions = CourseService.getTinymceConfiguration()
    this.validatorsRoles = []
    this.validators = []
    this.workspaces = []
    this.workspace = null
    this.workspaceModels = []
    this.model = null
    this._userpickerCallback = this._userpickerCallback.bind(this)
    this.initializeCourse()
  }

  _userpickerCallback (datas) {
    this.validators = datas === null ? [] : datas
    this.refreshScope()
  }

  initializeCourse () {
    const workspacesUrl = Routing.generate('api_get_workspaces')
    this.$http.get(workspacesUrl).then(d => {
      if (d['status'] === 200) {
        const datas = JSON.parse(d['data'])
        datas.forEach(w => this.workspaces.push(w))
      }
    })
    const workspaceModelsUrl = Routing.generate('api_get_workspace_models')
    this.$http.get(workspaceModelsUrl).then(d => {
      if (d['status'] === 200) {
        const datas = JSON.parse(d['data'])
        datas.forEach(wm => this.workspaceModels.push(wm))
      }
    })
    const validatorsRolesUrl = Routing.generate('api_get_validators_roles')
    this.$http.get(validatorsRolesUrl).then(d => {
      if (d['status'] === 200) {
        const datas = JSON.parse(d['data'])
        datas.forEach(r => this.validatorsRoles.push(r['id']))
      }
    })
  }

  displayValidators () {
    let value = ''
    this.validators.forEach(u => value += `${u['firstName']} ${u['lastName']}, `)

    return value
  }

  submit () {
    this.resetErrors()

    if (!this.course['title']) {
      this.courseErrors['title'] = Translator.trans('form_not_blank_error', {}, 'cursus')
    } else {
      this.courseErrors['title'] = null
    }

    if (!this.course['code']) {
      this.courseErrors['code'] = Translator.trans('form_not_blank_error', {}, 'cursus')
    } else {
      this.courseErrors['code'] = null
    }

    if (this.course['defaultSessionDuration'] === null || this.course['defaultSessionDuration'] === undefined) {
      this.courseErrors['defaultSessionDuration'] = Translator.trans('form_not_blank_error', {}, 'cursus')
    } else {
      this.course['defaultSessionDuration'] = parseInt(this.course['defaultSessionDuration'])

      if (this.course['defaultSessionDuration'] < 0) {
        this.courseErrors['defaultSessionDuration'] = Translator.trans('form_number_superior_error', {value: 0}, 'cursus')
      }
    }

    if (this.course['maxUsers']) {
      this.course['maxUsers'] = parseInt(this.course['maxUsers'])

      if (this.course['maxUsers'] < 0) {
        this.courseErrors['maxUsers'] = Translator.trans('form_number_superior_error', {value: 0}, 'cursus')
      }
    }

    if (this.workspace) {
      this.course['workspace'] = this.workspace['id']
    } else {
      this.course['workspace'] = null
    }

    if (this.model) {
      this.course['workspaceModel'] = this.model['id']
    } else {
      this.course['workspaceModel'] = null
    }
    this.course['validators'] = []
    this.validators.forEach(v => {
      this.course['validators'].push(v['id'])
    })

    if (this.isValid()) {
      const checkCodeUrl = Routing.generate('api_get_course_by_code_without_id', {code: this.course['code']})
      this.$http.get(checkCodeUrl).then(d => {
        if (d['status'] === 200) {
          if (d['data'] === 'null') {
            const url = this.cursusId === null ?
              Routing.generate('api_post_course_creation') :
              Routing.generate('api_post_cursus_course_creation', {cursus: this.cursusId})
            this.$http.post(url, {courseDatas: this.course}).then(d => {
              this.callback(d['data'])
              this.$uibModalInstance.close()
            })
          } else {
            this.courseErrors['code'] = Translator.trans('form_not_unique_error', {}, 'cursus')
          }
        }
      })
    } else {
      console.log('Form is not valid.')
    }
  }

  resetErrors () {
    for (const key in this.courseErrors) {
      this.courseErrors[key] = null
    }
  }

  isValid () {
    let valid = true

    for (const key in this.courseErrors) {
      if (this.courseErrors[key]) {
        valid = false
        break
      }
    }

    return valid
  }

  isUserpickerAvailable () {
    return this.validatorsRoles.length > 0
  }

  getSelectedUsersIds () {
    let selectedUsersIds = []
    this.validators.forEach(v => {
      selectedUsersIds.push(v['id'])
  })

    return selectedUsersIds
  }

  openUserPicker () {
    let userPicker = new UserPicker();
    const options = {
      picker_name: 'validators-picker',
      picker_title: Translator.trans('validators_selection', {}, 'cursus'),
      multiple: true,
      selected_users: this.getSelectedUsersIds(),
      forced_roles: this.validatorsRoles,
      return_datas: true
    }
    userPicker.configure(options, this._userpickerCallback);
    userPicker.open();
  }

  refreshScope () {
    this.$rootScope.$apply()
  }
}
