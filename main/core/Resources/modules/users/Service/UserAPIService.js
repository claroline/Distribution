import angular from 'angular/index'

export default class UserAPIService {
  constructor($http, $q, url) {
    this.$http = $http
    this.$q = $q
    this.UrlService = url
  }

  removeFromCsv(formData) {
    return this.$http.post(
            this.UrlService('api_csv_remove_user'),
            formData, {
              transformRequest: angular.identity,
              headers: {
                'Content-Type': undefined
              }
            }
        )
  }

  importCsvFacets(formData) {
    return this.$http.post(
            this.UrlService('api_csv_import_facets'),
            formData, {
              transformRequest: angular.identity,
              headers: {
                'Content-Type': undefined
              }
            }
        )
  }

  getConnectedUser() {
    const deferred = this.$q.defer()
    this.$http
            .get(
                this.UrlService('api_get_connected_user', {})
            )
            .success(function onSuccess(response) {
              deferred.resolve(response)
            }.bind(this))
            .error(function onError(response) {
              deferred.reject(response)
            })

    return deferred.promise
  }

  connectedUserIsAdmin(user) {
    return user.roles && user.roles.length > 0 && user.roles.find(el => el.name === 'ROLE_ADMIN') !== undefined
  }
}
