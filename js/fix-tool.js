var widthf = window.innerWidth*0.7,
    heightf = 600;
var formatComma = d3.format(",");
if(window.innerWidth>1024){
    var grid = d3.grid()
    .points()
    .size([widthf*0.5-40, heightf-40]);
    var tooltipfix = floatingTooltip('tooltip-fix', 240);
}else{
    var grid = d3.grid()
    .points()
    .size([window.innerWidth-80, heightf-40]);
}
// var grid = d3.grid()
//     .points()
//     .size([widthf*0.5-40, heightf-40]);


d3.csv('./budget_final.csv', function(error,data){
    if (error) throw error;
    var sortBy = {
    A: d3.comparator()
        .order(d3.descending, function(d) { return d.A; })
        .order(d3.ascending, function(d) { return d.budget; }),
    B: d3.comparator()
        .order(d3.descending, function(d) { return d.B; })
        .order(d3.descending, function(d) { return d.budget; }),
    
    C: d3.comparator()
        .order(d3.descending, function(d) { return d.C; })
        .order(d3.descending, function(d) { return d.budget; }),
        
    };

    var svg = d3.select("#vis").append("svg")
        .attr('width','100%')
        .attr('height' , '100%')
        .attr("viewBox",function(){
            if(window.innerWidth>1024){
               return  "0 0 " + widthf*0.5 + " " + heightf;
            }else{
                return "0 0 " + window.innerWidth-80 + " " + heightf
            }
        })
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", "translate(20,20)");

    update();

    d3.selectAll(".button")
    .on("click", function(d) {
        d3.selectAll('.button').classed('active', false);
        d3.select(this).classed('active', true);

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

    function update() {
    var node = svg.selectAll(".node")
        .data(grid(data), function(d) { return d.id; });
    node.enter().append("circle")
        .attr("class", "node")
        .attr("r", 6)
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .style("fill", '#584392')
        .style('cursor','pointer')
        .on('mouseover', function(){
            if(window.innerWidth>1024){
                return showDetail;
            }else{
                return;
            }
        })
        .on('mouseout', function(){
            if(window.innerWidth>1024){
                return hideDetail;
            }else{
                return;
            }
        })
        .on('click', function(d){

            d3.selectAll('.node').style("fill", '#584392')
            d3.select(this)
            .style("fill", '#f00');

            d3.select('.doc-name').html(d.name);
            d3.select('.doc-budget').html('예산 '+formatComma(d.budget)+"원");
            if(d.mom!=""){
                d3.select('.docp').html('<hr><h3>회의록</h3>'+d.mom);
            }else{
                d3.select('.docp').html('');
            };
        });
    node.transition().duration(600).delay(function(d, i) { return i * 2; })
        .attr("r", 6)
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    node.exit().transition()
        .attr("r", 6)
        .remove();

    }

    function showDetail(d) {
        d3.select(this)
          .attr('stroke', '#ddd')
          .attr('stroke-width', 2)
          .attr('r', 10)  
        var content = '<span class="name">사업명: </span><span class="value">' +
                      d.name +
                      '</span><br/>' +
                      '<span class="name">예산: </span><span class="value">' +
                      formatComma(d.budget)+
                      '원</span><br/>' +
                      '<span class="name">기관: </span><span class="value">' +
                      d.sangim +
                      '</span>';
    
        tooltipfix.showTooltip(content, d3.event);
      }
    function hideDetail(d) {
        d3.select(this)
          .attr('stroke', 'none')
          .attr('r', 6)
    
        tooltipfix.hideTooltip();
      }

  
});

