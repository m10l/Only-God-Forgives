$( document ).ready(function() {

    $('.js-forgive').on('click', function(){
        var count = parseInt( $(this).siblings().find('.js-vote-count').text(), 10 );
        count++;
        $(this).siblings().find('.js-vote-count').text(count);

    });

});
