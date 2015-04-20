$(document).ready(function() {
  $('.js-upvote').on('click', function() {
    var count;
    count = parseInt($(this).siblings('.js-vote-count').text(), 10);
    count++;
    return $(this).siblings('.js-vote-count').text(count);
  });
  return $('.js-downvote').on('click', function() {
    var count;
    count = parseInt($(this).siblings('.js-vote-count').text(), 10);
    count--;
    return $(this).siblings('.js-vote-count').text(count);
  });
});
