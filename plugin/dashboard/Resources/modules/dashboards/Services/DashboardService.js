

/**
 * Exercise Service
 * @param {Object} $http
 * @param {Object} $q
 * @constructor
 */
class DashboardService {

  constructor($http, $q, url){
    this.$http = $http
    this.$q    = $q
    this.UrlService = url
  }

  getAll(){
    const deferred = this.$q.defer()
    this.$http
      .get(this.UrlService('get_dashboards', {}))
      .success(response => {
        deferred.resolve(response)
      })
      .error(() => {
        deferred.reject([])
      })

    return deferred.promise
  }
}

export default DashboardService
