$(document).ready ->
    $('.js-upvote').on 'click', ->
        count = parseInt( $(this).siblings('.js-vote-count').text(), 10)
        count++
        $(this).siblings('.js-vote-count').text(count)

    $('.js-downvote').on 'click', ->
      count = parseInt( $(this).siblings('.js-vote-count').text(), 10)
      count--
      $(this).siblings('.js-vote-count').text(count)
