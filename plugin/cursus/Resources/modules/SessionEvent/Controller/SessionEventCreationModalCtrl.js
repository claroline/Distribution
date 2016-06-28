/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class SessionEventCreationModalCtrl {
  constructor($http, $uibModal, $uibModalInstance, ClarolineAPIService, sessionId, callback) {
    this.$http = $http
    this.$uibModal = $uibModal
    this.$uibModalInstance = $uibModalInstance
    this.ClarolineAPIService = ClarolineAPIService
    this.sessionId = sessionId
    this.callback = callback
    this.sessionEvent = {}
  }

  submit() {
    const data = this.ClarolineAPIService.formSerialize('session_event_form', this.sessionEvent)
    const route = Routing.generate('api_post_session_event_creation', {'_format': 'html', session: this.sessionId})
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
            controller: 'SessionEventCreationModalCtrl',
            controllerAs: 'cmc',
            bindToController: true,
            resolve: {
              sessionId: () => { return this.sessionId },
              callback: () => { return this.callback },
              sessionEvent: () => { return this.sessionEvent }
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
