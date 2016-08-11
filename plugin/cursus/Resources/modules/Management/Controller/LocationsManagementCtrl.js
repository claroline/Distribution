/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global Routing*/

export default class LocationsManagementCtrl {
  constructor($http, NgTableParams) {
    this.$http = $http
    this.locations = []
    this.locationResources = []
    this.reservationResources = []
    this.tableParams = {
      locations:  new NgTableParams(
        {count: 20},
        {counts: [10, 20, 50, 100], dataset: this.locations}
      ),
      locationResources:  new NgTableParams(
        {count: 20},
        {counts: [10, 20, 50, 100], dataset: this.locationResources}
      ),
      resources:  new NgTableParams(
        {count: 20},
        {counts: [10, 20, 50, 100], dataset: this.reservationResources}
      )
    }
    this.initialize()
  }

  initialize() {
    this.loadLocations()
  }

  loadLocations () {

  }

  loadLocationResources () {
    const url = Routing.generate('api_get_cursus_reservation_resources')
    this.$http.get(url).then(d => {
      if (d['status'] === 200) {
        const datas = JSON.parse(d['data'])
        this.locationResources.splice(0, this.locationResources.length)
        datas.forEach(r => {
          r['type'] = r['resourceType']['name']
          this.locationResources.push(r)
        })
      }
    })
  }

  loadResources () {
    const url = Routing.generate('api_get_reservation_resources')
    this.$http.get(url).then(d => {
      if (d['status'] === 200) {
        const datas = JSON.parse(d['data'])
        this.reservationResources.splice(0, this.reservationResources.length)
        datas.forEach(r => {
          r['type'] = r['resourceType']['name']
          this.reservationResources.push(r)
        })
      }
    })
  }

  addLocationResource (resource) {
    const url = Routing.generate('api_post_cursus_reservation_resources_tag', {resource: resource['id']})
    this.$http.post(url).then(d => {
      if (d['status'] === 200 && d['data'] === 'success') {
        this.locationResources.push(resource)
      }
    })
  }

  removeLocationResource (resourceId) {
    const url = Routing.generate('api_delete_cursus_reservation_resources_tag', {resource: resourceId})
    this.$http.delete(url).then(d => {
      if (d['status'] === 200 && d['data'] === 'success') {
        const index = this.locationResources.findIndex(l => l['id'] === resourceId)

        if (index > -1) {
          this.locationResources.splice(index, 1)
        }
      }
    })
  }

  isLocationResource (resourceId) {
    return this.locationResources.findIndex(l => l['id'] === resourceId) > -1
  }
}