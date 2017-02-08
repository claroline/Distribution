var libs =
  [
    'angular',
    'angular-animate',
    'angular-bootstrap',
    'angular-bootstrap-colorpicker', //requires css + might require loader
    'angular-breadcrumb',
    'angular-daterangepicker',
    'angular-datetime',
    'angular-loading-bar',
    'angular-resource',
    'angular-route',
    'angular-sanitize',
    'angular-strap',
    'angular-toArrayFilter',
    'angular-touch',
    'angular-ui-router',
    'angular-ui-tinymce',
    'angular-ui-translation',
    'angular-ui-pageslide',
    'ng-file-upload',
    'angular-strap',
    'jquery',
    'tinymce/tinymce',
    'tinymce/skins/lightgray/content.min.css',
    'tinymce/skins/lightgray/skin.min.css',
    'tinymce/themes/modern/theme',
    'tinymce/plugins/autoresize/plugin',
    'tinymce/plugins/table/plugin',
    'tinymce/plugins/directionality/plugin',
    'tinymce/plugins/template/plugin',
    'tinymce/plugins/textcolor/plugin',
    'tinymce/plugins/visualchars/plugin',
    'tinymce/plugins/fullscreen/plugin',
    'tinymce/plugins/insertdatetime/plugin',
    'tinymce/plugins/media/plugin',
    'tinymce/plugins/preview/plugin',
    'tinymce/plugins/hr/plugin',
    'tinymce/plugins/anchor/plugin',
    'tinymce/plugins/pagebreak/plugin',
    'tinymce/plugins/searchreplace/plugin',
    'tinymce/plugins/wordcount/plugin',
    'tinymce/plugins/advlist/plugin',
    'tinymce/plugins/autolink/plugin',
    'tinymce/plugins/lists/plugin',
    'tinymce/plugins/image/plugin',
    'tinymce/plugins/charmap/plugin',
    'tinymce/plugins/print/plugin',
    'tinymce/plugins/visualblocks/plugin',
    'tinymce/plugins/nonbreaking/plugin',
    'tinymce/plugins/save/plugin',
    'tinymce/plugins/emoticons/plugin',
    'tinymce/plugins/code/plugin',
    'tinymce/plugins/paste/plugin',
    'tinymce/plugins/link/plugin',
    'core-js/shim',
    'lodash',
    'ng-table', //requires css
    'backbone',
    'bootstrap-daterangepicker',
    'mjolnic-bootstrap-colorpicker', //might need a loader
    'eonasdan-bootstrap-datetimepicker', //might need to import the css file
    'bootstrap3-typeahead',
    'bootstrap-datepicker'
]

libs = libs.reduce((acc, lib) => {
    acc[lib] = [lib]
    return acc
}, {})

libs['angular-dragula'] = [__dirname + '/externals/angular-dragula.js']
libs['at-table'] = [__dirname + '/externals/at-table.js']
libs['angular-gridster'] = [__dirname + '/externals/angular-gridster.js']
libs['angular-data-table'] = [__dirname + '/externals/angular-data-table.js']
libs['angular-ui-select'] = [__dirname + '/externals/angular-ui-select.js']
libs['mjolnic-bootstrap-colorpicker'] = [__dirname + '/externals/mjolnic-bootstrap-colorpicker.js']
libs['moment'] = [__dirname + '/externals/moment.js']
libs['fullcalendar'] = [__dirname + '/externals/fullcalendar.js']
libs['jquery-ui'] = [__dirname + '/externals/jquery-ui.js']
libs['confirm-bootstrap'] = ['confirm-bootstrap/confirm-bootstrap']
libs['Datejs'] = ['Datejs/build/date']
libs['lodash'] = [__dirname + '/externals/lodash.js']
libs['pdf'] = [__dirname + '/externals/pdf.js']
libs['wavesurfer'] = [__dirname + '/externals/wavesurfer.js']
libs['jqplot'] = [__dirname + '/externals/jqplot.js']
libs['select2'] = [__dirname + '/externals/select2.js']
libs['typeahead'] = [__dirname + '/externals/typeahead']
libs['jquery-option-tree'] = [__dirname + '/externals/jquery-option-tree']
libs['strophe'] = [__dirname + '/externals/strophe.js']
libs['angular-loading-bar'] = [__dirname + '/externals/angular-loading-bar']
libs['videojs'] = [__dirname + '/externals/videojs.js']
libs['angular-ui-tree'] = [__dirname + '/externals/angular-ui-tree.js']
libs['jquery.resize'] = [__dirname + '/externals/jquery.resize.js']
libs['datatables'] = [__dirname + '/externals/datatables']

module.exports = libs
