$(document).ready ->

    $('.js-vote').on 'click', ->
        voteType = ''
        count    = parseInt( $(this).siblings('.js-vote-count').text(), 10)

        if $(this).hasClass 'js-upvote'
            count++
            voteType = 'up'
        else if $(this).hasClass 'js-downvote'
            count--
            voteType = 'down'

        $.ajax(
            type    : "POST"
            url     : "/confessions/" + $(@).data('confession-id') + "/vote"
            data    : { vote_type: voteType }
        )

        $(this).siblings('.js-vote-count').text(count)
        $(this).prop 'disabled', true
        $(this).siblings('.js-vote').prop 'disabled', true
