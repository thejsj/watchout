/* global $:true */

var makeScore = function() {
  var score = {};

  score.score = 0;
  score.highScore = 0;
  score.collisions = 0;
  score.inCollision = false;

  score.init = function() {
    score.interval = score.createInterval();
  };

  score.createInterval = function () {
    return setInterval(score.increase, 100);
  };

  // Increase The Score
  score.increase = function () {
    score.score += 1;
    if (score.score >= score.highScore) {
      score.highScore = score.score;
    }
    score.updateDOM();
  };

  // Add Collision and reset the score
  score.addCollision = function () {
    score.collisions += 1;
    score.score = 0;
    score.updateDOM();
  };

  score.pause = function () {
    clearInterval(score.interval);
  };

  score.resume = function () {
    score.interval = score.createInterval();
  };

  // Update the DOM
  score.updateDOM = function () {
    $('.scoreboard .high span').text(score.highScore);
    $('.scoreboard .current span').text(score.score);
    $('.scoreboard .collisions span').text(score.collisions);
  };

  score.init();
  return score;
};
