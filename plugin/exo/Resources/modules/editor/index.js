import angular from 'angular/index'
import {Editor} from './editor'

const rawQuiz = JSON.parse(document.querySelector('exercise').dataset.exercise)
const editor = new Editor(rawQuiz)

angular.module('editor', [])
  .component('editor', {
    controller: ['$element', el => editor.render(el[0])],
    template: '<div></div>'
  })
