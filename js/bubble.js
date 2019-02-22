
function bubbleChart() {
  // var margin = 20
  if(window.innerWidth>1024){
    var width = window.innerWidth*0.5;
    var radius=4;
    var axismargin=50;
  }else{
    var width = window.innerWidth;
    var radius=3.2;
    var axismargin=20;
  }
	var height = window.innerHeight
  var tooltip = floatingTooltip('tooltip', 240);
  var center = { x: width / 2, y: height / 2 };
  var formatComma = d3.format(",");
  var budgetaxis=['1,000만 원 -~ 1억 원','1억 원 -~ 10억 원', 
                  '10억 원 -~ 100억 원', '100억 원 -~ 1,000억 원', '1,000억 원 -~'];
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
    var count2=0;
    var count3=0;
    var count4=0;

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
          d.axis=0;      
          d.yaxis=count++;
        }
        else if(100000000<=d.budget&&d.budget<1000000000){
          d.axis=1;
          d.yaxis=count1++;
        }//1억-10억
        else if(1000000000<=d.budget&&d.budget<10000000000){
          d.axis=2; 
          d.yaxis=count2++;
        }//10억 - 100억
        else if(10000000000<=d.budget&&d.budget<100000000000){
          d.axis=3;
          d.yaxis=count3++;
        }//100억 1000억 
        else if(100000000000<=d.budget){
          d.axis=4;
          d.yaxis=count4++;
        }//1000억 이상
      });
      var myNodes = rawData.map(function (d) {
        return {
          id: d.id,
          radius: radius,
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
          axis: d.axis,
          yaxis: d.yaxis
        };
      });
      return myNodes;
    }
 
    var chart = function chart( selector,rawData) {
      nodes = createNodes(rawData);
      svg = d3.select(selector)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        // .attr('transform', 'translate(' + 20 + ',' + 20 + ')')
        .attr("viewBox", "0 0 " + width + " " + height )
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
        .duration(800)
        .attr('r', radius);
  
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
          // .attr('x', width-120 )
          .attr('y', height*0.5+220)
          .attr('text-anchor', 'middle')
          .attr('fill','#999');

      svg.append('line')
          .attr('class', 'percentline')
          .attr("stroke", '#ddd')
          .attr('stroke-width',2)
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
      .attr('fill-opacity', function(d){
        if(d.twoyear==1){return 1}
        else{return .2}
      })
    }
    function setcolorC(d) {
      d3.selectAll('.bubble')
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
      d3.selectAll('.percentline').style('opacity','0');
    }
  
    var bottomdata={
      'A':'지역성 신규사업 342건',
      'B':'2년 연속 신규사업 28건',
      'C':'깜깜이 신규사업 128건',
    };
    var bottompositionx={
      'A': width-150,
      'B': width-100,
      'C': width-120,
    };
    var bottompositiony={
      'A': height*0.5+170,
      'B': height*0.5+90,
      'C': height*0.5+130,
    };
    

    function showText(g) {
      d3.selectAll('.percent')
      .transition().duration(1000)
        .style('opacity','1')
        .attr('x', bottompositionx[g])
        .text(bottomdata[g]);
      d3.selectAll('.percentline')
      .transition().duration(1000)
        .style('opacity','1')
        .attr('x1', bottompositionx[g])
        .attr('x2', bottompositionx[g])
        .attr("y1", height*0.5+200)
        .attr('y2', bottompositiony[g]);
    
    }
    function showDetail(d) {
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
      d3.select(this)
        .attr('stroke', 'none')
        .attr('r', radius);
      tooltip.hideTooltip();
    }
    
    chart.toggleDisplay = function (displayName) {
      if (displayName != 'all'&& displayName!= 'axis') {
        splitBubbles(displayName);
        toggleaxis(false);
      } 
      else if (displayName == 'axis'){
        axisBubbles();
        toggleaxis(true);
      }
      else {
        groupBubbles();
        toggleaxis(false);
      }
    };
  
    // ********************************************************* */
    // axis chart!!
    function axisBubbles() {
      hideText(); 
      simulation.stop();
      ScaleX = d3.scaleBand()
        .domain([0,1,2,3,4])
        .range([axismargin,width-axismargin]);
      ScaleaxisX = d3.scaleBand()
        .domain(budgetaxis)
        .range([axismargin,width-axismargin]);

      ScaleY = d3.scaleLinear()
        .domain([0,255])
        .range([height*0.5+100, 100]);

      var xOffset = ScaleX.bandwidth() / 2;

      d3.selectAll('.bubble')
      .attr('fill', '#584392')
      .attr('fill-opacity', 1)
      .transition().duration(500)
      .attr('cx',function(d) {
            return ScaleX(d.axis)+xOffset;
      })
      .attr('cy',function(d) {
        return ScaleY(d.yaxis);
      });
         
    // var yOffset = ScaleY.bandwidth() / 2;
          
      // simulation
      // .force('x', d3.forceX().strength(.9).x(
      //   function(d) {
      //     return ScaleX(d.axis) + xOffset;
      //   }
      // ))
      // .force('y', d3.forceY().strength(1).y(
      //   function(d) {
      //     return ScaleY(d.yaxis) + yOffset;
      //   }
      // ));
      // .force('charge', d3.forceManyBody().strength(-10))
    
      // simulation.alpha(0.4).restart();
    }

    var insertLinebreaks = function (word) {
      var el = d3.select(this);
      var words = word.toString().split('-');
      el.text('');
  
      for (var i = 0; i < words.length; i++) {
          var tspan = el.append('tspan').text(words[i]);
          if (i > 0)
              tspan.attr('x', 0).attr('dy', '20');
      }
    }

    function  toggleaxis(showaxis) {
      if (showaxis) {
          if (d3.select(".x-axis").empty()) {
            createaxis();
          }
          var xAxis = d3.select(".x-axis");      
          translateAxis(xAxis, "translate(0," + (height*0.5 +110) + ")");
      } else {
        if (!d3.select(".x-axis").empty()) {
          d3.select(".x-axis").remove(); 
        }
      }

      function createaxis() {
        var xAxis = d3.axisBottom(ScaleaxisX)
          .ticks(5);

        svg.append("g")
          .attr("class", "x-axis")
          .attr("transform", "translate(0," + (height) + ")")
          .call(xAxis)
          .selectAll(".tick text")
            .style("text-anchor", "start")
            .each(insertLinebreaks);
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
  