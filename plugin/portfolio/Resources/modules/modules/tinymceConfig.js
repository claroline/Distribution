import 'angular'
import clarolineTinymce from 'claroline/tinymce'

/* global angular */

var appDirectives = angular.module('app.config', [])

var tinyMceConfig = clarolineTinymce.getConfiguration()
tinyMceConfig.format = 'text'

appDirectives.value('tinyMceConfig', tinyMceConfig)
