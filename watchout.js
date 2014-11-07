//create svg node append to body
var svg = d3.select("body").append("svg")
    .attr("width", 1200)
    .attr("height", 600);

//creates an array of n enemies with id and random position
var createEnemyData = function(n) {
  return _.range(n).map(function(item) {
    return {id: item, x: Math.random() * 1200, y: Math.random() * 650}
  });
};


var appendEnemies = function(enemyData) {
  return svg.selectAll('circle').data(enemyData).enter()
    .append('circle')
    .style('fill', function(d, i) {
      return i%2 === 0 ? '#D3DACC' : '#E7C597'
    })
    .attr('r','2%')
    .attr('cx', function(d) {
      return d.x;
    })
    .attr('cy', function(d) {
      return d.y;
    });
};

var enemies = createEnemyData(20);
appendEnemies(enemies);