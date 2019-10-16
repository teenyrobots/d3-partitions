var vWidth = 925;  // <-- 1
var vHeight = 925;
var vRadius = Math.min(vWidth, vHeight) / 2;  // < -- 2
var vColor = d3.scaleOrdinal(d3.schemeCategory20b);   // <-- 3

//scales the rings: https://stackoverflow.com/questions/37684415/d3-sunburst-how-to-set-different-ring-level-widths
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

var vRoot = d3.hierarchy(theData)  // <--1
    .sum(function (d) { return d.size });

//reversing the nodes: https://stackoverflow.com/questions/50241534/d3-sunburst-chart-with-root-node-on-the-outside-ring
var vArc = d3.arc()
    .startAngle(function (d) { return d.x0 })
    .endAngle(function (d) { return d.x1 })

//normal
//    .innerRadius(function (d) { return d.y0 })
//    .outerRadius(function (d) { return d.y1 });

//flips sunburst
    // .innerRadius(function (d) { console.log("inner radius: " + (vRadius - d.y1 + vRoot.y1)); return vRadius - d.y1 + vRoot.y1; })
    // .outerRadius(function (d) { console.log("outer radius " + (vRadius - d.y0 + vRoot.y1)); return vRadius - d.y0 + vRoot.y1; });

//applies the scale
   .innerRadius(function (d) { return rscale(vRadius - d.y1 + vRoot.y1); })
   .outerRadius(function (d) { return rscale(vRadius - d.y0 + vRoot.y1); });


var vNodes = vRoot.descendants();  // <--3

vLayout(vRoot);  // <--4

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
