import $ from 'jquery'

$(document).ready(function () {
  $('.media .pull-left .badge_image').each(function () {
    $(this).load(function () {
      resizeBadgeImage(this)
    })
  })
})

// When the page is fully loaded, resize images
$(window).load(function () {
  var image = $('.media .pull-left .badge_image')
  image.each(function () {
    resizeBadgeImage(this)
  })
})

function resizeBadgeImage (element) {
  if ($(element).width() > $(element).height()) {
    $(element).css('height', '64px')
    $(element).css('marginLeft', -($(element).width()) / 2)
    $(element).css('marginTop', -($(element).height()) / 2)
  } else {
    $(element).css('width', '64px')
    $(element).css('marginLeft', -($(element).width()) / 2)
    $(element).css('marginTop', -($(element).height()) / 2)
  }
}
