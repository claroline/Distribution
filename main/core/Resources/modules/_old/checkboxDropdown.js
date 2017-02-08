import $ from 'jquery'

$('body').on('click', '.dropdown-menu > li > label', function () {
  if ($('#' + $(this).attr('for')).prop('checked')) {
    $(this).removeClass('active')
  } else {
    $(this).addClass('active')
  }
})
