
function bubbleChart() {
  var margin = 20
	var width = window.innerWidth*0.5 - margin * 2
	var height = window.innerHeight
  var tooltip = floatingTooltip('tooltip', 240);
  var center = { x: width / 2, y: height / 2 };
  var formatComma = d3.format(",");
  var budgetaxis=['1,000만 원 ~ 1억 원','1억 원 ~ 10억 원', 
                  '10억 원 ~ 100억 원', '100억 원 ~ 1,000억 원', '1,000억 원 ~'];
  
    var centers = {
      0: { x: width / 2.5, y: height / 2 },
      1: { x: width / 1.5, y: height / 2 },
    };
    var forceStrength = 0.03;
  
    var svg = null;
    var bubbles = null;
    var nodes = [];
    var count=0;
    var count1=0;
    function charge(d) {
      return -Math.pow(d.radius, 3.1) * forceStrength;
    }
  
    var simulation = d3.forceSimulation()
      .velocityDecay(0.2)
      .force('x', d3.forceX().strength(forceStrength).x(center.x))
      .force('y', d3.forceY().strength(forceStrength).y(center.y))
      .force('charge', d3.forceManyBody().strength(charge))
      .on('tick', ticked);
  
    simulation.stop();

    
    function createNodes(rawData) {

      rawData.forEach(function(d){
        if(10000000<=d.budget&&d.budget<100000000){
          d.axes=0;      count++;
        }
        else if(100000000<=d.budget&&d.budget<1000000000){d.axes=1;}//1억-10억
        else if(1000000000<=d.budget&&d.budget<10000000000){d.axes=2; count1++}//10억 - 100억
        else if(10000000000<=d.budget&&d.budget<100000000000){d.axes=3;}//100억 1000억 
        else if(100000000000<=d.budget){d.axes=4;}//1000억 이상
      });
      var myNodes = rawData.map(function (d) {
        return {
          id: d.id,
          radius: 4,
          budget: +d.budget,
          name: d.name,
          a: d.sangim,
          b: d.sogwan,
          local: d.local,
          twoyear: d.twoyear,
          black: d.black,
          groupA:d.A,
          groupB:d.B,
          groupC:d.C,
          x: Math.random() * 900,
          y: Math.random() * 800,
          axes: d.axes
        };
      });
      return myNodes;
    }
 
    var chart = function chart( selector,rawData) {
      nodes = createNodes(rawData);
      console.log(count);
      console.log(count1);
      svg = d3.select(selector)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('transform', 'translate(' + 20 + ',' + 20 + ')')
        .attr("viewBox", "0 0 " + window.innerWidth*0.5 + " " + window.innerHeight )
        .attr("preserveAspectRatio", "xMidYMid meet")
  
      bubbles = svg.selectAll('.bubble')
        .data(nodes, function (d) { return d.id; })
        .enter().append('circle')
        .classed('bubble', true)
        .attr('r', 0)
        .attr('fill', '#584392')
        .attr('fill-opacity', 1)
        .on('mouseover', showDetail)
        .on('mouseout', hideDetail);
  
      bubbles.transition()
        .duration(500)
        .attr('r', 4);
  
      simulation.nodes(nodes);
      groupBubbles();
      
      svg.append('text')
          .attr('class','total')
          .attr('x',width-100)
          .attr('y', height*0.5-200)
          .attr('text-anchor', 'right')
          .text('총 453건')
          .attr('fill','#999');
      
      svg.append('text')
          .attr('class', 'percent')
          .attr('x', width-150 )
          .attr('y', height*0.5+220)
          .attr('text-anchor', 'middle')
          .attr('fill','#999');
    };
  
   

    function ticked() {
      d3.selectAll('.bubble')
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
    }
  
  
    function nodeAPos(d) {
      return centers[d.local].x;
    }
    function nodeBPos(d) {
      return centers[d.twoyear].x;
    }
    function nodeCPos(d) {
      return centers[d.black].x;
    }
  
  
    function groupBubbles() {   
      hideText();
      d3.selectAll('.bubble')
      .attr('fill', '#584392')
      .attr('fill-opacity', 1);

      simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));
      simulation.alpha(1).restart();
    }
  
    function setcolorA(d) {
      d3.selectAll('.bubble')
      // .attr('fill', function(d){
      //   if(d.local==1){return '#584392'}
      //   else{return '#ddd'}
      // })
      .attr('fill-opacity', function(d){
        if(d.local==1){return 1}
        else{return .2}
      })
    }
    function setcolorB(d) {
      d3.selectAll('.bubble')
      // .attr('fill', function(d){
      //   if(d.twoyear==1){return '#584392'}
      //   else{return '#ddd'}
      // })
      .attr('fill-opacity', function(d){
        if(d.twoyear==1){return 1}
        else{return .2}
      })
    }
    function setcolorC(d) {
      d3.selectAll('.bubble')
      // .attr('fill', function(d){
      //   if(d.black==1){return '#584392'}
      //   else{return '#ddd'}
      // })
      .attr('fill-opacity', function(d){
        if(d.black==1){return 1}
        else{return .2}
      })
    }

    function splitBubbles(g) {
      showText(g);  
      if (g === 'A') {
        setcolorA();
        simulation.force('x', d3.forceX().strength(forceStrength).x(nodeAPos));
      } else if (g === 'B') {
        setcolorB();
        simulation.force('x', d3.forceX().strength(forceStrength).x(nodeBPos));
      } else if (g === 'C') {
        setcolorC();
        simulation.force('x', d3.forceX().strength(forceStrength).x(nodeCPos));
      }
      simulation.alpha(1).restart();
    }

    function hideText() {
      d3.selectAll('.percent').style('opacity','0');
    }
  
    var bottomdata={
      'A':'지역성 신규사업 342건',
      'B':'2년 연속 신규사업 28건',
      'C':'깜깜이 신규사업 128건',
    };

    function showText(g) {
      d3.selectAll('.percent')
        .style('opacity','1')
        .transition()
        .duration(1000)
        .text(bottomdata[g]);
    
    }
    function showDetail(d) {
      // change outline to indicate hover state.
      d3.select(this)
        .attr('stroke', '#ddd')
        .attr('stroke-width', 2)
        .attr('r', 10);
      var content = '<span class="name">사업명: </span><span class="value">' +
                    d.name +
                    '</span><br/>' +
                    '<span class="name">예산: </span><span class="value">' +
                    formatComma(d.budget)+
                    ' 원</span><br/>' +
                    '<span class="name">기관: </span><span class="value">' +
                    d.a +
                    '</span>';
  
      tooltip.showTooltip(content, d3.event);
    }
  
    function hideDetail(d) {
      // reset outline
      d3.select(this)
        .attr('stroke', 'none')
        .attr('r', 4);
  
      tooltip.hideTooltip();
    }
    
    chart.toggleDisplay = function (displayName) {
      if (displayName != 'all'&& displayName!= 'axis') {
        splitBubbles(displayName);
        toggleAxes(false);
      } 
      else if (displayName == 'axis'){
        axesBubbles();
        toggleAxes(true);
      }
      else {
        groupBubbles();
        toggleAxes(false);
      }
    };
  
    // ********************************************************* */
    // axis chart!!
    function axesBubbles() {
      hideText();
      d3.selectAll('.bubble')
      .attr('fill', '#584392')
      .attr('fill-opacity', 1);

      ScaleX = d3.scaleBand()
        .domain([0,1,2,3,4])
        .range([100,width-100]);
      ScaleY = d3.scaleLinear()
        .domain([1,2,3,4,5])
        .range([height*0.5, 200]);
      
      var xOffset = ScaleX.bandwidth() / 2;
      // var yOffset = ScaleY.bandwidth() / 2;
        
      
      simulation
      .force('x', d3.forceX().strength(.9).x(
        function(d) {
          return ScaleX(d.axes) + xOffset;
        }
      ))
      // .force('y', d3.forceY().strength(1).y(
      //   function(d) {
      //     return ScaleY(d.yaxes) + yOffset;
      //   }
      // ));
      // .force('charge', d3.forceManyBody().strength(-10))
    
      simulation.alpha(0.4).restart();
    }

    function  toggleAxes(showAxes) {

         // yAxis = d3.select(".y-axis");

      if (showAxes) {

          if (d3.select(".x-axis").empty()) {
            createAxes();
          }
          var xAxis = d3.select(".x-axis");      
          translateAxis(xAxis, "translate(0," + (height*0.5 +200) + ")");
      } else {
        if (!d3.select(".x-axis").empty()) {
          d3.select(".x-axis").remove(); 
        }
      }

      function createAxes() {
        var numberOfTicks = 10,
            tickFormat = ".0s";

        var xAxis = d3.axisBottom(ScaleX)
          .ticks(5)
          .tickFormat(function(d, i) {
            return budgetaxis[i];
          });


        svg.append("g")
          .attr("class", "x-axis")
          .attr("transform", "translate(0," + (height) + ")")
          .call(xAxis)
          .selectAll(".tick text")
            .attr("font-size", "10px");

        // var yAxis = d3.axisLeft(ScaleY)
        //   .ticks(numberOfTicks, tickFormat);
        // svg.append("g")
        //   .attr("class", "y-axis")
        //   .attr("transform", "translate(" + offScreenXOffset + ",0)")
        //   .call(yAxis);
      }

      function translateAxis(axis, translation) {
        axis
          .transition()
          .duration(500)
          .attr("transform", translation);
      }
    }



    //********************************************************* */
    // 클로저로 부터 차트 반환
    return chart;
  }
  
  var myBubbleChart = bubbleChart();
  var storyChart = bubbleChart();
  
  function display(error, data) {
    if (error) {
      console.log(error);
    }
    storyChart('.graphic__vis',data);
  }
  