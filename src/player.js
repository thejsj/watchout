/* globals d3:true */

var makePlayer = function(svg, canvasWidth, canvasHeight) {
  var player = {};

  player.svg = svg;
  player.canvasWidth = canvasWidth;
  player.canvasHeight = canvasHeight;

  player.width = 22;
  player.height = 25;

  player.color = '#FF0000';
  player.collisionColor = '#E49303';

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
        .style('fill', player.color)
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

  player.notifyCollision = function() {
    player.$el
      .style('fill', player.collisionColor)
      .transition().duration(500)
        .style('fill', player.color);
  };

  player.init();
  return player;
};
