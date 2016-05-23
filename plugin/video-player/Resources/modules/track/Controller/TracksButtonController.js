export default class TracksButtonController {
  constructor ($uibModal, $http) {
    this.$uibModal = $uibModal
    this.tracks = window['tracks']
    this.langs = []
    $http.get(Routing.generate('api_get_available_locales')).then(d => this.langs = d.data)
  }

  openTracks () {
    this.$uibModal.open({
      template: require('../Partial/tracks.html'),
      controller: 'TracksModalController',
      controllerAs: 'tmc',
      resolve: {
        tracks: () => {
          return this.tracks},
        langs: () => {
          return this.langs}
      }
    })
  }
}
