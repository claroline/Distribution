import $ from 'jquery'

$( document ).ready(function() {
  $(window).scroll(function(){
    if ($(window).scrollTop() <= 100)
        {
      $('.lesson_tooltip.btn_up.btn-primary').addClass('hidden')
    }
    else
        {
      $('.lesson_tooltip.btn_up.btn-primary').removeClass('hidden')
    }
  })
})
