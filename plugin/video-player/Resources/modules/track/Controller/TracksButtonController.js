export default class TracksButtonController {
  constructor ($uibModal, $http) {
    this.$uibModal = $uibModal
    this.tracks = []
    $http.get(Routing.generate('api_get_video_tracks', {video: window['videoId']})).then(d => this.tracks = d.data)
    this.langs = [
        {value: 'en', label: 'EN'},
        {value: 'fr', label: 'FR'},
    ]
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
