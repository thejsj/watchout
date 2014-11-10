/* globals _:true, makeEnemies:true, d3:true */

var makeEnemies = function (svg, width, height, force) {

  var enemies = {};
  enemies.svg = svg;
  enemies.width = width;
  enemies.height = height;
  enemies.force = force;
  enemies.forceGravity = false;
  enemies.forceGravityUpdateCount = 0;

  enemies.init = function () {
    enemies.data = enemies.createEnemyData(170);
    enemies.$el = enemies.appendEnemies(enemies.data);
    enemies.interval = setInterval(enemies.updateForce, 1000);
  };

  enemies.tick = function () {
    var q = d3.geom.quadtree(enemies.data);
    var i = 0;
    var n = enemies.data.length;
    while (++i < n) {
      q.visit(enemies.collide(enemies.data));
    }
    enemies.$el
      .data(enemies.data)
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y;
      });
  };

  enemies.updateForce = function () {
    console.log('updateForce');
    enemies.forceGravity = !enemies.forceGravity;
    enemies.forceGravityUpdateCount += 1;
    var _g = 10;
    var _c = 100;
    var g, c;
    if (enemies.forceGravityUpdateCount % 10 === 0) {
      g = 1000;
      c = 1000;
    } else {
      if (enemies.forceGravity) {
        _g = _g * 4;
      }
      g = _g + (Math.random() * _g);
      c = -_c + (Math.random() * _c * 2);
    }
    var _w = Math.random() * enemies.width;
    var _h = Math.random() * enemies.height;
    enemies.force.gravity(function () {
      return g;
    })
      .charge(function () {
        return c;
      })
      .nodes(enemies.data)
      .size([_w, _h]);
    setTimeout(function () {
      enemies.force.start();
    }, 1);
  };

  enemies.collide = function (node) {
    var r = node.radius + 16,
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
    return function (quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== node)) {
        var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = node.radius + quad.point.radius;
        if (l < r) {
          l = (l - r) / l * 0.5;
          node.x -= x *= l;
          node.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
  };

  //creates an array of n enemies with id and random position
  enemies.createEnemyData = function (n) {
    return _.range(n).map(function (item) {
      return {
        id: item,
        x: Math.random() * enemies.width,
        y: Math.random() * enemies.height
      };
    });
  };

  enemies.appendEnemies = function (data) {
    var colors = ['B0E5CE', 'E6DF2C', 'DDB895', 'A1810D', 'FFA51F'];
    return enemies.svg.selectAll('circle').data(data).enter()
      .append('circle')
      .style('fill', function () {
        return '#' + colors[Math.floor(Math.random() * colors.length)];
      })
      .attr('r', '2%')
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y;
      });
  };

  enemies.pause = function () {
    clearInterval(enemies.interval);
  };

  enemies.resume = function () {
    // enemies.interval = enemies.createInterval();
  };

  // enemies.createAnimationInterval = function () {
  //   // Every second change position
  //   return setInterval(function() {
  //     // Change the x, y coordinates for every node in enemiesData
  //     _.map(enemies.data, function(enemy) {
  //       enemy.x = Math.random() * width;
  //       enemy.y = Math.random() * height;
  //       return enemy;
  //     });
  //     // Tranisition every $enemy to its new position
  //     enemies.$el.data(enemies.data);

  //     enemies.$el
  //       .transition().duration(2000)
  //         .attr('cx', function (d) {
  //           return d.x;
  //         })
  //        .attr('cy', function (d) {
  //           return d.y;
  //         });
  //   }, 2000);
  // };

  enemies.init();
  return enemies;
};