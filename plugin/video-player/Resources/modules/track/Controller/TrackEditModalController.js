import langs from '#/main/core/Resources/modules/form/Field/Lang/iso.js'

export default class TrackEditModalController {
  constructor ($http, $uibModalInstance, track) {
      this.$http = $http
      this.track = track
      this.trackForm = {
        fields: [
          ['lang', 'lang'],
          ['is_default', 'checkbox', {label: Translator.trans('is_default', {}, 'platform')}]
      ]}
      this.$uibModalInstance = $uibModalInstance
  }

  onSubmit() {
      this.track['label'] = langs[this.track.lang]['nativeName']
      this.$uibModalInstance.close(this.track)
  }
}
