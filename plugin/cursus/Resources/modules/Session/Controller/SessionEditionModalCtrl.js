/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class SessionEditionModalCtrl {
  constructor($http, $uibModal, $uibModalInstance, ClarolineAPIService, sessionId, callback) {
    this.$http = $http
    this.$uibModal = $uibModal
    this.$uibModalInstance = $uibModalInstance
    this.ClarolineAPIService = ClarolineAPIService
    this.sessionId = sessionId
    this.callback = callback
    this.session = {}
  }

  submit() {
    let data = this.ClarolineAPIService.formSerialize('course_session_form', this.session)
    const route = Routing.generate('api_put_session_edition', {'_format': 'html', session: this.sessionId})
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
            controller: 'SessionEditionModalCtrl',
            controllerAs: 'cmc',
            bindToController: true,
            resolve: {
              sessionId: () => { return this.sessionId },
              callback: () => { return this.callback },
              session: () => { return this.session }
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
