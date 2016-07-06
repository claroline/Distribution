/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global Routing*/

export default class CourseEditionModalCtrl {
  constructor($http, $uibModal, $uibModalInstance, ClarolineAPIService, courseId, callback) {
    this.$http = $http
    this.$uibModal = $uibModal
    this.$uibModalInstance = $uibModalInstance
    this.ClarolineAPIService = ClarolineAPIService
    this.courseId = courseId
    this.callback = callback
    this.course = {}
  }

  submit() {
    let data = this.ClarolineAPIService.formSerialize('course_form', this.course)
    const route = Routing.generate('api_put_course_edition', {'_format': 'html', course: this.courseId})
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
            controller: 'CourseEditionModalCtrl',
            controllerAs: 'cmc',
            bindToController: true,
            resolve: {
              courseId: () => { return this.courseId },
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
