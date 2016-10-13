import modernizr from 'modernizr'
import $ from 'jquery'

/* global Translator */

if (!modernizr.mutationobserver) {
  showWarning()
}

function showWarning () {
  const warning = `
        <div class="alert alert-danger" style="text-align='center';">
            <a class="close" data-dismiss="alert" href="#" aria-hidden="true">&times;</a>
            <div align="center">${Translator.trans('outdated_brower_message', {}, 'platform')} </div>
        </div>
    `

  $('#claroline-base-layout-body').prepend(warning)
}
