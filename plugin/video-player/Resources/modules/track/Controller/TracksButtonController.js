export default class TracksButtonController {
  constructor ($uibModal, $http) {
    this.$uibModal = $uibModal
    this.tracks = window['tracks']
  }

  openTracks () {
    this.$uibModal.open({
      template: require('../Partial/tracks.html'),
      controller: 'TracksModalController',
      controllerAs: 'tmc',
      resolve: {
        tracks: () => {
          return this.tracks}
      }
    })
  }
}
