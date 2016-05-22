export default class TracksModalController {
  constructor (tracks, langs, FormBuilderService, ClarolineAPIService) {
    this.tracks = tracks
    this.langs = langs
    this.newTrack = {}
    this.FormBuilderService = FormBuilderService
    this.ClarolineAPIService = ClarolineAPIService
    this.trackForm = {
      fields: [
        ['lang', 'lang'],
        ['is_default', 'checkbox', {label: Translator.trans('is_default', {}, 'platform')}],
        ['track', 'file']
    ]}
  }

  onCreate () {
    this.FormBuilderService.submit(
      Routing.generate('api_post_video_track', {video: window['videoId']}),
      {track: this.newTrack}
    ).then(d => {
      this.newTrack = {}
      this.tracks.push(d.data)
    })
  }

  onDelete(track) {
    const url = Routing.generate('api_delete_video_track', {track: track.id})
    this.ClarolineAPIService.confirm(
       {url, method: 'DELETE'},
      function () {
        this.ClarolineAPIService.removeElements(track, this.tracks)
      }.bind(this),
      Translator.trans('delete_track', {}, 'platform'),
      Translator.trans('delete_track_confirm', 'platform')
    )
  }
}
