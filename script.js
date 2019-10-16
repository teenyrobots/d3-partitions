var vWidth = 925;  // <-- 1
var vHeight = 925;
var vRadius = Math.min(vWidth, vHeight) / 2;  // < -- 2
var vColor = d3.scaleOrdinal(d3.schemeCategory20b);

//https://medium.com/@Elijah_Meeks/color-advice-for-data-visualization-with-d3-js-33b5adc41c90 but it doesn't work ¯\_(ツ)_/¯
let colors = d3.scaleOrdinal()
  .range([
    "240, 240, 240",
    "220, 220, 220",
    "200, 200, 200",
    "240, 240, 240",
    "220, 220, 220",
    "200, 200, 200",
    "240, 240, 240",
    "220, 220, 220",
    "200, 200, 200"
  ]);

var rscale = d3.scaleLinear()
 .domain([0,(vRadius * .73),vRadius])
 .range([0,(vRadius * .98),vRadius]);

var g = d3.select('svg')  // <-- 1
    .attr('width', vWidth)  // <-- 2
    .attr('height', vHeight)
    .append('g')  // <-- 3
    .attr('transform',
        'translate(' + vWidth / 2 + ',' + vHeight / 2 + ')');  // <-- 4

var vLayout = d3.partition()  // <-- 1
    .size([2 * Math.PI, vRadius]);

//parses json data
d3.json('data.json', function(error, vData) {
     if (error) throw error;
     drawSunburst(vData);
});

//draws the sunburst
function drawSunburst(data) {
  let vRoot = d3.hierarchy(data)
    .sum(function (d) {return d.size});

  var vArc = d3.arc()
    .startAngle(function (d) { return d.x0 })
    .endAngle(function (d) { return d.x1 })
    .innerRadius(function (d) { return rscale(vRadius - d.y1 + vRoot.y1); })
    .outerRadius(function (d) { return rscale(vRadius - d.y0 + vRoot.y1); });

  let vNodes = vRoot.descendants();

  vLayout(vRoot);

  var vSlices = g.selectAll('path') // <-- 1
      .data(vNodes)  // <-- 2
      .enter()  // <-- 3
      .append('path'); // <-- 4

  vSlices.filter(function(d) { return d.parent; })
      .attr('d', vArc)
      .style('stroke', '#fff')
      .style('fill', function (d) {
          //if (the node has children) {return the node} else {return the parent};
          return vColor((d.children ? d : d.parent).data.name); });
};
