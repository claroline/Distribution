export default class TracksModalController {
  constructor (tracks, langs, FormBuilderService) {
    this.tracks = tracks
    this.langs = langs
    this.newTrack = {}
    this.FormBuilderService = FormBuilderService
    this.trackForm = {
      fields: [
        ['lang', 'select', {values: this.langs}],
        ['is_default', 'checkbox', {label: Translator.trans('is_default', {}, 'platform')}],
        ['track', 'file']
    ]}
  }

  onNewTrack () {
    this.FormBuilderService.submit(
      Routing.generate('api_post_video_track', {video: window['videoId']}),
      {track: this.newTrack}
    ).then(d => {
      alert('done')
    })
  }
}
