
/**
* service for administration app
*/
class AdminService {
  constructor($http, $q) {
    this.$http = $http
    this.$q = $q
  }

  save(resource) {
    let deferred = this.$q.defer()
    this.$http
          .post(
              Routing.generate('media_resource_save', { workspaceId: resource.workspaceId, id: resource.id }),
              resource
          )
          .success(function onSuccess(response) {
            deferred.resolve(response)
          }.bind(this))
          .error(function onError(response, status) {
            deferred.reject(response)
          })

    return deferred.promise
  }

  zip(resource) {
    let deferred = this.$q.defer()
    this.$http
          .post(
              Routing.generate('mediaresource_zip_export', { workspaceId: resource.workspaceId, id: resource.id}),
              resource.regions,
              {responseType:'arraybuffer'}
          )
          .success(function onSuccess(response) {
            deferred.resolve(response)
          }.bind(this))
          .error(function onError(response, status) {
            deferred.reject(response)
          })

    return deferred.promise
  }
}

export default AdminService
