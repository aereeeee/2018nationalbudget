const toolwidth=1000;
const toolheight=800;

svg = d3.select(".tool")
.append("svg")
  .attr("width", toolwidth)
  .attr("height", toolheight);

var simulation = d3.forceSimulation()
.force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
.force("charge", d3.forceManyBody())
.force("center", d3.forceCenter(chartWidth / 2, chartHeight / 2))
.force("y", d3.forceY(0))
.force("x", d3.forceX(0))

d3.csv("budget_data_test.csv", function(error, links) {
if (error) throw error;
data.forEach(function(d) {
    d.ID = d.ID;
  });
var nodes = d3.values(ID);

var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 4.5)
    .call(force.drag);

// Start the force layout.
force
    .nodes(nodes)
    .on("tick", tick)
    .start();

function tick() {

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

function nodeByName(name) {
  return nodesByName[name] || (nodesByName[name] = {name: name});
}
});