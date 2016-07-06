/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global Routing*/

export default class CursusCourseCreationModalCtrl {
  constructor($http, $uibModal, $uibModalInstance, ClarolineAPIService, cursusId, callback) {
    this.$http = $http
    this.$uibModal = $uibModal
    this.$uibModalInstance = $uibModalInstance
    this.ClarolineAPIService = ClarolineAPIService
    this.cursusId = cursusId
    this.callback = callback
    this.course = {}
  }

  submit() {
    let data = this.ClarolineAPIService.formSerialize('course_form', this.course)
    const route = Routing.generate('api_post_cursus_course_creation', {'_format': 'html', cursus: this.cursusId})
    const headers = {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}

    this.$http.post(route, data, headers).then(
      d => {
        this.$uibModalInstance.close(d.data)
      },
      d => {
        if (d.status === 400) {
          this.$uibModalInstance.close()
          const instance = this.$uibModal.open({
            template: d.data,
            controller: 'CursusCourseCreationModalCtrl',
            controllerAs: 'cmc',
            bindToController: true,
            resolve: {
              cursusId: () => { return this.cursusId },
              callback: () => { return this.callback },
              course: () => { return this.course }
            }
          })

          instance.result.then(result => {
            if (!result) {
              return
            } else {
              this.callback(result)
            }
          })
        }
      }
    )
  }
}
