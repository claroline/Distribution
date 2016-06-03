$(document).ready(function() {
    'use strict';

    var translation= window.Translator;
    $(".unlock").on("click", function(){
         var that = $(this);
        $.ajax({
            url: Routing.generate(
                'innova_path_stepauth',
                { step: $(this).attr("data-step"), user: $(this).attr("data-user")}
            ),
            type: 'GET',
            success: function (data) {
                var user = $(that).closest(".userstepunlock").find(".username").html();
                var step = that.parent().parent().find('.stepname').html();
                $('#unlocked').html(translation.trans('step_unlocked', {'user':user, 'step':step}, 'messages'));
                $(that).remove();
            },
            error: function( jqXHR, textStatus, errorThrown){
                $('#unlocked').html("error. textStatus="+ textStatus + " errorThrown="+ errorThrown);
            }
        });
    });
});
