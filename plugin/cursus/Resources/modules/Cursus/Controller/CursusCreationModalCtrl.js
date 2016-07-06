/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global Routing*/

export default class CursusCreationModalCtrl {
  constructor($http, $uibModal, $uibModalInstance, ClarolineAPIService, cursusId, callback) {
    this.$http = $http
    this.$uibModal = $uibModal
    this.$uibModalInstance = $uibModalInstance
    this.ClarolineAPIService = ClarolineAPIService
    this.cursusId = cursusId
    this.callback = callback
    this.cursus = {}
  }

  submit() {
    let data = this.ClarolineAPIService.formSerialize('cursus_form', this.cursus)
    const route = this.cursusId === null ?
      Routing.generate('api_post_cursus_creation', {'_format': 'html'}) :
      Routing.generate('api_post_cursus_child_creation', {'_format': 'html', parent: this.cursusId})
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
            controller: 'CursusCreationModalCtrl',
            controllerAs: 'cmc',
            bindToController: true,
            resolve: {
              cursusId: () => { return this.cursusId },
              callback: () => { return this.callback },
              cursus: () => { return this.cursus }
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
