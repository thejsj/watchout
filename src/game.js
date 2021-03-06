/* globals d3:true, makeSound:true, makeEnemies: true, makePlayer:true, makeScore:true , $:true */

var makeGame = function () {

  var game = {};

  game.width = 1200;
  game.height = 600;
  game.paused = false;
  game.inCollision = false;

  game.init = function () {
    game.force = d3.layout.force();
    game.svg = game.createSVG();
    game.enemies = makeEnemies(game.svg, game.width, game.height, game.force);
    game.player = makePlayer(game.svg, game.width, game.height);
    game.score = makeScore();
    game.$container = $('.container');
    game.sound = makeSound();

    window.requestAnimationFrame(game.requestAnimationFrame);

    game.svg
      .on('mouseleave', game.pause) // When mouse leaves SVG
      .on('mouseenter', game.resume); // When mouse enters SVG

    game.force.on('tick', function() {
      game.enemies.tick();
      game.force.resume();
    });
  };

  game.requestAnimationFrame = function () {
    // Let's loop through the enemies to detect any collisions
    var elements = game.enemies.$el[0]; // array with HTMLElements
    for (var i = 0; i < elements.length; i += 1) {
      // elements[i] = HTMLElement
      var x = game.getPositionValue(elements[i].cx); // SVGAnimatedLength
      var y = game.getPositionValue(elements[i].cy); // SVGAnimatedLength
      var radius = game.getPositionValue(elements[i].r); // SVGAnimatedLength
      var result = game.player.hasCollisions(x, y, radius);
      if (result === true) {
        if (!game.inCollision) {
          game.score.addCollision();
          game.player.notifyCollision();
          game.sound.playCollide();
          game.inCollision = true;
          setTimeout(game.updateCollisionStatus, 400);
        }
      }
    }
    window.requestAnimationFrame(game.requestAnimationFrame);
  };

  game.updateCollisionStatus = function () {
    game.inCollision = false;
  };

  game.getPositionValue = function (SVGAnimatedLength) {
    if (SVGAnimatedLength.animVal) {
      return SVGAnimatedLength.animVal.value;
    }
    return SVGAnimatedLength.baseVal.value;
  };

  game.createSVG = function () {
    //create svg node append to body
    return d3.select('.container').append('svg')
        .attr('width', game.width)
        .attr('height', game.height);
  };

  game.pause = function () {
    if (!game.paused) {
      game.paused = true;
      game.enemies.pause();
      game.score.pause();
      game.$container.addClass('paused');
      game.sound.pauseBackground();
    }
  };

  game.resume = function () {
    if (game.paused) {
      game.paused = false;
      game.enemies.resume();
      game.score.resume();
      game.$container.removeClass('paused');
      game.sound.resumeBackground();
    }
  };

  game.init();
  return game;
};

window.game = makeGame();
