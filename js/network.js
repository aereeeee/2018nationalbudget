var width = window.innerWidth, height = window.innerHeight, nodePadding = 2.5;

var svg = d3.select(".tool")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


var tooltip = d3.select("tool").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var simulation = d3.forceSimulation()
    // .force("forceX", d3.forceX().x(width * .5))
    // .force("forceY", d3.forceY().y(height * .5))
    .force("center", d3.forceCenter().x(width * .5).y(height * .5))
    .force("charge", d3.forceManyBody().strength(-1.4));
  

d3.csv('budget.csv', function(error,graph){
      if (error) throw error;
      simulation.nodes(graph)
          .force("collide", d3.forceCollide().radius(10))
          .on("tick", function(d){
            node.attr("transform", function(d) { return 'translate(' + [d.x, d.y] + ')'; })

          });
             
var node = svg.selectAll("g")
    .data(graph)
    .enter().append("g")
        //   .attr("transform", function(d) { return 'translate(' + [d.x, d.y] + ')'; })
        //   .on("mouseover", function(d) {
        //   if(d.radius<15){
        //     tooltip
        //         .style("opacity", 1).html(d["ID"])
        //          .style("left", (d3.event.pageX + 10) + "px")
        //          .style("top", (d3.event.pageY) + "px");
        //        }
        // })
        // .on("mouseout", function(d) {
        //   if(d.radius<15){
        //     tooltip
        //          .style("opacity", 0);
        //       }
        // })
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("circle")
           .attr("r", 5)
              .attr("fill",function(d){{return "#373a3c"}})
              .attr("stroke","#fff")
              .attr("stroke-width","2");

 });
 
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0.03);
      d.fx = null;
      d.fy = null;
    }

///////////////////////////////////////////////////////////////////////////////////////
