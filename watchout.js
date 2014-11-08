/* globals d3:true, _:true, $:true */

var makeEnemies = function (svg, width, height) {

  var enemies = {};
  enemies.svg = svg;
  enemies.width = width;
  enemies.height = height;

  enemies.init = function () {
    enemies.data = enemies.createEnemyData(20);
    enemies.$el = enemies.appendEnemies(enemies.data);
    enemies.interval = enemies.createInterval();
  };

  //creates an array of n enemies with id and random position
  enemies.createEnemyData = function(n) {
    return _.range(n).map(function(item) {
      return {
        id: item,
        x: Math.random() * enemies.width,
        y: Math.random() * enemies.height
      };
    });
  };

  enemies.appendEnemies = function(data) {
    return enemies.svg.selectAll('circle').data(data).enter()
      .append('circle')
      .style('fill', function(d, i) {
        return i%2 === 0 ? '#D3DACC' : '#E7C597';
      })
      .attr('r','2%')
      .attr('cx', function(d) {
        return d.x;
      })
      .attr('cy', function(d) {
        return d.y;
      });
  };

  enemies.pause = function () {
    clearInterval(enemies.interval);
  };

  enemies.resume = function () {
    enemies.interval = enemies.createInterval();
  };

  enemies.createInterval = function () {
    // Every second change position
    return setInterval(function() {
      // Change the x, y coordinates for every node in enemiesData
      _.map(enemies.data, function(enemy) {
        enemy.x = Math.random() * width;
        enemy.y = Math.random() * height;
        return enemy;
      });
      // Tranisition every $enemy to its new position
      enemies.$el.data(enemies.data);

      enemies.$el
        .transition().duration(2000)
          .attr('cx', function (d) {
            return d.x;
          })
         .attr('cy', function (d) {
            return d.y;
          });
    }, 1200);
  };

  enemies.init();
  return enemies;
};

var makePlayer = function(svg, canvasWidth, canvasHeight) {
  var player = {};

  player.svg = svg;
  player.canvasWidth = canvasWidth;
  player.canvasHeight = canvasHeight;

  player.width = 22;
  player.height = 25;

  player.init = function() {
    player.data = player.getData();
    player.$el = player.append();
    player.svg
      .on('mousemove', player.onMouseMove);
  };

  player.getData = function () {
    return {
      x: -player.canvasWidth,
      y: -player.canvasHeight
    };
  };

  player.getRadius = function () {
    return 20;
  };

  player.getPolygonDimension = function () {
    var w = player.width;
    var h = player.height;
    return '' + (h / 2) + ',0 0,' + w + ' ' + h + ',' + w;
  };

  player.append = function() {
    // 50,0 0,90 100,90
    return player.svg.selectAll('polygon')
      .data([player.data])
      .enter()
        .append('polygon')
        .style('fill', 'red')
        .attr('points', player.getPolygonDimension());
  };

  player.onMouseMove = function () {
    var coordinates = d3.mouse(this);
    player.data.x = coordinates[0] - (player.width /2);
    player.data.y = coordinates[1] - (player.height /2);
    player.updatePosition();
  };

  player.updatePosition = function () {
    // Update our d3 element's data
    player.$el.data(player.data);
    player.$el
      .attr('transform', function (d) {
        return 'translate(' + d.x + ', ' + d.y + ')';
      });
  };

  player.hasCollisions = function(x2, y2, radius) {
    //x1,y1 is player
    //x2,y2 is enemy
    var x = Math.pow(x2 - player.data.x, 2);
    var y = Math.pow(y2 - player.data.y, 2);
    var distance = Math.sqrt(x + y);
    if (distance < player.getRadius() + radius) {
      return true;
    }
    return false;
  };

  player.init();
  return player;
};

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
    if (!score.inCollision) {
      score.collisions += 1;
      score.score = 0;
      score.updateDOM();
      score.inCollision = true;
      setTimeout(score.updateCollisionStatus, 300);
    }
  };

  score.updateCollisionStatus = function () {
    score.inCollision = false;
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

var makeGame = function () {

  var game = {};

  game.width = 1200;
  game.height = 600;
  game.paused = false;

  game.init = function () {
    game.svg = game.createSVG();
    game.enemies = makeEnemies(game.svg, game.width, game.height);
    game.player = makePlayer(game.svg, game.width, game.height);
    game.score = makeScore();
    game.$container = $('.container');

    window.requestAnimationFrame(game.requestAnimationFrame);

    game.svg
      .on('mouseleave', game.pause)
      .on('mouseenter', game.resume);
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
        game.score.addCollision();
      }
    }
    window.requestAnimationFrame(game.requestAnimationFrame);
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
    }
  };

  game.resume = function () {
    if (game.paused) {
      game.paused = false;
      game.enemies.resume();
      game.score.resume();
      game.$container.removeClass('paused');
    }
  };

  game.init();
  return game;
};

window.game = makeGame();
