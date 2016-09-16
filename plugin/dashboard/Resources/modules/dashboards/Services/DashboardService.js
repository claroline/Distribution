

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

  create(data){
    const deferred = this.$q.defer()
    this.$http
      .post(this.UrlService('create_dashboard', {}), data)
      .success(response => {
        deferred.resolve(response)
      })
      .error(() => {
        deferred.reject([])
      })

    return deferred.promise
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

  getOne(id){
    const deferred = this.$q.defer()
    this.$http
      .get(this.UrlService('get_dashboard', {'dashboardId':id}))
      .success(response => {
        deferred.resolve(response)
      })
      .error(() => {
        deferred.reject([])
      })

    return deferred.promise
  }

  getDashboardData(id){
    const deferred = this.$q.defer()
    this.$http
      .get(this.UrlService('get_dashboard_spent_times', {'dashboardId':id}))
      .success(response => {
        deferred.resolve(response)
      })
      .error(() => {
        deferred.reject([])
      })

    return deferred.promise
  }

  countDashboards(){
    const deferred = this.$q.defer()
    this.$http
      .get(this.UrlService('get_nb_dashboards', {}))
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
