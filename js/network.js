var width = 960;
var height=800;

var svg = d3.select(".tool")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


var tooltip = d3.select(".tool").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  

d3.csv('budget.csv', function(error,graph){
      if (error) throw error;
      var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width * .5).y(height * .5));    
    
    
      var node = svg.append("g").selectAll('circle')
        .data(graph)
        .enter().append("circle")
           .attr("r", 5)
              .attr("fill",function(d){{return "#373a3c"}})
              .attr("stroke","#fff")
              .attr("stroke-width","2")
              .on("mouseover", function(d) {
                tooltip
                    .style("opacity", 1).html(d["ID"])
                     .style("left", (d3.event.pageX + 10) + "px")
                     .style("top", (d3.event.pageY) + "px");
    
            })
            .on("mouseout", function(d) {
        
                tooltip
                     .style("opacity", 0);
         
            });

            function ticked() {
                node
                  .attr('cx', function (d) { return d.x; })
                  .attr('cy', function (d) { return d.y; });
              }

              simulation.nodes(node).on('tick',ticked);

 });

 
///////////////////////////////////////////////////////////////////////////////////////
