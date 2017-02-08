import $ from 'jquery'
import 'typeahead'

/* global TagTypeAhead */

var allTags = window.allTags
new TagTypeAhead({
  tags: allTags,
  selector: '#innova_path_widget_config_tags'
})
// Remove Tags
$('.removeTag').on('click', function (e) {
    // Flag the Tag has "to remove"
  var id = $(this).data('tag-id')
  $('.tagList').append(`<input type="hidden" name="${window.formName}[removeTags][]" value="` + id + '" />')

    // Remove the displayed label
  $(this).parents('.label').remove()
  e.preventDefault()
})
