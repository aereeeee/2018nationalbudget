var width = window.innerWidth*0.8,
    height = 500;

var grid = d3.grid()
    .points()
    .size([width*0.5-40, height-40]);
var tooltip = floatingTooltip('tooltip-fix', 240);
d3.csv('../budget_final.csv', function(error,data){
    if (error) throw error;

    var sortBy = {
    A: d3.comparator()
        .order(d3.descending, function(d) { return d.A; })
        .order(d3.descending, function(d) { return d.budget; }),
    B: d3.comparator()
        .order(d3.descending, function(d) { return d.B; })
        .order(d3.descending, function(d) { return d.budget; }),
        // .order(d3.ascending, function(d) { return d.A; }),
    C: d3.comparator()
        .order(d3.descending, function(d) { return d.C; })
        .order(d3.descending, function(d) { return d.budget; }),
        
    };

    var svg = d3.select("#vis").append("svg")
    .attr('width', width*0.5)
        .attr('height' , height)
        .append("g")
    .attr("transform", "translate(20,20)");

    d3.selectAll(".button")
    .on("click", function(d) {
        d3.event.preventDefault();
        data.sort(sortBy[this.dataset.sort]);
        if(this.dataset.sort=='A'){
            d3.selectAll(".node").attr('fill-opacity',function(d){
            if(d.A==1) return 1;
            return .2;
        })}
        else if(this.dataset.sort=='B'){
            d3.selectAll(".node").attr('fill-opacity',function(d){
            if(d.B==1) return 1;
            return .2;
        })}
        else if(this.dataset.sort=='C'){
            d3.selectAll(".node").attr('fill-opacity',function(d){
            if(d.C==1) return 1;
            return .2;
        })
        }
        update();
    });

    update();

    function update() {
    var node = svg.selectAll(".node")
        .data(grid(data), function(d) { return d.id; });
    node.enter().append("circle")
        .attr("class", "node")
        .attr("r", 1e-9)
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .style("fill", '#584392')
        .on('mouseover', showDetail)
        .on('mouseout', hideDetail)
        .on('click', function(d){
            // d3.selectAll('.node').classed('activefix', false);
            // d3.select(this)
            // .classed('activefix', true);
    
            d3.select('.docp').text(d.name);
        });
    node.transition().duration(500).delay(function(d, i) { return i * 2; })
        .attr("r", 6)
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    node.exit().transition()
        .attr("r", 1e-9)
        .remove();

    // d3.selectAll('.activefix')
    // .attr('r',8).attr('stroke', '#000');
    }

    function showDetail(d) {
        // change outline to indicate hover state.
        d3.select(this)
          .attr('stroke', '#ddd')
          .attr('stroke-width', 2)
          .attr('r', 8)
          
    
        var content = '<span class="name">사업명: </span><span class="value">' +
                      d.name +
                      '</span><br/>' +
                      '<span class="name">예산: </span><span class="value">' +
                      d.budget +
                      '</span><br/>' +
                      '<span class="name">기관: </span><span class="value">' +
                      d.sangim +
                      '</span>';
    
        tooltip.showTooltip(content, d3.event);
      }
    function hideDetail(d) {
        // reset outline
        d3.select(this)
          .attr('stroke', 'none')
          .attr('r', 6)
    
        tooltip.hideTooltip();
      }
});