import langs from '#/main/core/Resources/modules/form/Field/Lang/iso.js'

export default class TracksModalController {
  constructor (tracks, langs, FormBuilderService, ClarolineAPIService, $uibModal) {
    this.tracks = tracks
    this.langs = langs
    this.newTrack = {}
    this.FormBuilderService = FormBuilderService
    this.ClarolineAPIService = ClarolineAPIService
    this.$uibModal = $uibModal
    this.trackForm = {
      fields: [
        ['lang', 'lang'],
        ['is_default', 'checkbox', {label: Translator.trans('is_default', {}, 'platform')}],
        ['track', 'file']
    ]}
  }

  onCreate () {
    this.newTrack['label'] = langs[this.newTrack.lang]['nativeName']

    this.FormBuilderService.submit(
      Routing.generate('api_post_video_track', {video: window['videoId']}),
      {track: this.newTrack}
    ).then(d => {
      this.newTrack = {}
      this.tracks.push(d.data)
    })
  }

  onDelete (track) {
    const url = Routing.generate('api_delete_video_track', {track: track.id})
    this.ClarolineAPIService.confirm(
      {url, method: 'DELETE'},
      function () {
        this.ClarolineAPIService.removeElements([track], this.tracks)
      }.bind(this),
      Translator.trans('delete_track', {}, 'platform'),
      Translator.trans('delete_track_confirm', 'platform')
    )
  }

  onEdit (track) {
    const modalInstance = this.$uibModal.open({
      template: require('../Partial/edit.html'),
      controller: 'TrackEditModalController',
      controllerAs: 'temc',
      resolve: {
        track: () => {
          return track},
        trackForm: () => {
          return this.trackForm}
      }
    })

    modalInstance.result.then(track => {
      //const data = this.FormBuilderService.formSerialize('roles', panel.panel_facets_role)

      this.FormBuilderService.submit(
        Routing.generate('api_put_video_track', {track: track.id}),
        {track: track},
        'POST'
      )
    })
  }
}
