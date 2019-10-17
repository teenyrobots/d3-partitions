let vWidth = 940,
  vHeight = 940,
  vRadius = Math.min(vWidth, vHeight) / 2,
  colors = d3.scaleOrdinal().range([
    'rgb(240, 240, 240)',
    'rgb(220, 220, 220)',
    'rgb(200, 200, 200)',
    'rgb(240, 240, 240)',
    'rgb(220, 220, 220)',
    'rgb(200, 200, 200)',
    'rgb(240, 240, 240)',
    'rgb(220, 220, 220)',
    'rgb(200, 200, 200)'
  ]);

//Sunburst variables
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


//helper functions
function computeTextRotation(d) {
    var angle = (d.x0 + d.x1) / Math.PI * 90;
    if (d.children) {
      return (angle < 120 || angle > 270) ? angle : angle + 180; //labels as rims
    } else {
      return (angle < 180) ? angle - 90 : angle + 90;  // labels as spokes
    }
}

function exShow() {
  document.getElementById('ex').setAttribute("style", "display: flex;");
};

function exBye() {
  document.getElementById('ex').setAttribute("style", "display: none;");
};

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

  var vSlices = g.selectAll('g') // <-- 1
    .data(vNodes)  // <-- 2
    .enter()  // <-- 3
    .append('g'); // <-- 4

  //builds wheel
  vSlices.append('path')
    .classed("path", true)
    .filter(function(d) { return d.parent; })
    .attr('display', function (d) { return d.depth ? null : 'none'; })
    .attr('d', vArc)
    .attr('stroke', '#fff')
    .attr('fill', function (d, i) {
      //if (the node has children) {return the node} else {return the parent};
      return colors((d.children ? d : d.parent).data.name);
    })

    //hover functions
    .on("mouseover", function(d) {
      d3.select(this).classed("blue", true);
    })
    .on("mouseout", function(d) {
      d3.select(this).classed("blue", false);
    })
    
    //click functions
    .on("click", function(d) {
      //set up inner circle
      d3.select("#intialContent").style("display", "none");
      d3.select("#content").style("display", "flex");
      let title = d3.selectAll('.title'),
        cat = d3.selectAll('.cat'),
        short = d3.selectAll('.short'),
        ex = d3.selectAll('.examples'),
        descrip = d3.selectAll('.descrip'),
        exShow = d3.selectAll('#exShow');

      //insert appropriate text
      title.text(d.data.name);
      short.text(d.data.short);

      if (d.children) {
        //insert parent text
        title.classed('outerTitle', true);
        cat.attr('hidden', true);
        exShow.classed("no", true);
      } else {
        //insert children text
        title.classed('outerTitle', false);
        cat.attr('hidden', null);
        cat.text(d.parent.data.name);
        descrip.text(d.data.description);
        ex.selectAll("li").remove();
        exShow.classed("no", false);
        for (i in d.data.examples) {
          if (d.data.examples[i].url){
            ex.append("li")
                .append("a")
                  .text(d.data.examples[i].text)
                  .attr("href", d.data.examples[i].url)
                  .attr("target", "_blank");
          } else {
            ex.append("li")
                .append("p")
                  .text(d.data.examples[i].text);
          }
        }
      }

      //make selected slice red
      d3.selectAll(".path").classed("red", false);
      d3.select(this).classed("red", true);

    });

  //adds labels
  vSlices.append('text')
    .filter(function(d) { return d.parent; }) //filters out the root node, which is not relevant
    .attr('transform', function(d) { return 'translate(' + vArc.centroid(d) + ')rotate(' + computeTextRotation(d) + ')'; })
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "mathematical")
    .text(function(d) { return d.data.name })
    .classed("labels", true);

  //hover functions
  vSlices.selectAll('path')


  //click functions
  vSlices.selectAll('path')

  ;

};
