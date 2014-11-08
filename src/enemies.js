/* globals _:true, makeEnemies:true */

var makeEnemies = function (svg, width, height) {

  var enemies = {};
  enemies.svg = svg;
  enemies.width = width;
  enemies.height = height;

  enemies.init = function () {
    enemies.data = enemies.createEnemyData(50);
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
        return i % 2 === 0 ? '#D3DACC' : '#E7C597';
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
    }, 2000);
  };

  enemies.init();
  return enemies;
};
