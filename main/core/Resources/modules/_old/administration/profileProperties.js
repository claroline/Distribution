import $ from 'jquery'

/* global Routing */

$('.property-chk').on('change', function () {
  var route = Routing.generate(
    'api_post_invert_user_properties_edition',
    {'property': $(this).attr('data-property-id')}
  )
  $.ajax({
    url: route,
    success: function () {}
  })
})
