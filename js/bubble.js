
function bubbleChart() {
  var margin = 20
	// var size = window.innerWidth*0.5
	// var sizeheight=window.innerHeight
	var width = window.innerWidth*0.5 - margin * 2
	var height = window.innerHeight
  var tooltip = floatingTooltip('tooltip', 240);
  var center = { x: width / 2, y: height / 2 };
  
    var centers = {
      0: { x: width / 1.5, y: height / 2 },
      1: { x: width / 2.5, y: height / 2 },
    };
  
    var grouptitleX = {
      0: 160,
      1: width / 2
    };
  
    var forceStrength = 0.03;
  
    var svg = null;
    var bubbles = null;
    var nodes = [];
  
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
        // id,sangim,sogwan,name,local,twoyear,black,budget,A,B,C
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
          y: Math.random() * 800
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
        .attr('transform', 'translate(' + 20 + ',' + 20 + ')')
        .attr("viewBox", "0 0 " + window.innerWidth*0.5 + " " + window.innerHeight )
        .attr("preserveAspectRatio", "xMidYMid meet")
  
      bubbles = svg.selectAll('.bubble')
        .data(nodes, function (d) { return d.id; })
    //   var bubblesE = bubbles
      .enter().append('circle')
        .classed('bubble', true)
        .attr('r', 0)
        .attr('fill', '#ccc')
        .attr('fill-opacity', 1)
        .attr('stroke', '#ddd')
        .attr('stroke-width', 1)
        .on('mouseover', showDetail)
        .on('mouseout', hideDetail)
        .on('click', function(d){
            d3.select(this)
            .attr('stroke', '#000')
            .attr('r', 8)
    
            d3.select('.doc').text(d.name);
        });
  
    //   bubbles = bubbles.merge(bubblesE);
  
      // bubbles.transition()
      //   .duration(2000)
      //   .attr('r', 4);
  
      simulation.nodes(nodes);
      groupBubbles();
      

    };
  
    function ticked() {
      bubbles
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
      
    //   hideYearTitles();
      d3.selectAll('.bubble')
      .attr('fill', '#ccc')
      .attr('fill-opacity', 1)
      .transition()
        .duration(2000)
        .attr('r', 4);
      // @v4 Reset the 'x' force to draw the bubbles to the center.
      simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));
  
      // @v4 We can reset the alpha value and restart the simulation
      simulation.alpha(1).restart();
    }
  
    function setcolorA(d) {
      d3.selectAll('.bubble')
      .attr('fill', function(d){
        if(d.local==1){return '#f00'}
        else{return '#ddd'}
      })
      .attr('fill-opacity', function(d){
        if(d.local==1){return 1}
        else{return .3}
      })
    }
    function setcolorB(d) {
      d3.selectAll('.bubble')
      .attr('fill', function(d){
        if(d.twoyear==1){return '#f00'}
        else{return '#ddd'}
      })
      .attr('fill-opacity', function(d){
        if(d.twoyear==1){return 1}
        else{return .3}
      })
    }
    function setcolorC(d) {
      d3.selectAll('.bubble')
      .attr('fill', function(d){
        if(d.black==1){return '#f00'}
        else{return '#ddd'}
      })
      .attr('fill-opacity', function(d){
        if(d.black==1){return 1}
        else{return .3}
      })
    }
    function splitBubbles(g) {
      // showYearTitles();
  
      // @v4 Reset the 'x' force to draw the bubbles to their year centers
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
      // @v4 We can reset the alpha value and restart the simulation
      simulation.alpha(1).restart();
    }
  
    /*
     * Hides Year title displays.
     */
    // function hideYearTitles() {
    //   svg.selectAll('.year').remove();
    // }
  
    /*
     * Shows Year title displays.
     */
    function showYearTitles() {
      // Another way to do this would be to create
      // the year texts once and then just hide them.
      var yearsData = d3.keys(grouptitleX);
      var years = svg.selectAll('.year')
        .data(yearsData);
  
      years.enter().append('text')
        .attr('class', 'year')
        .attr('x', function (d) { return grouptitleX[d]; })
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text(function (d) { return d; });
    }
  
  
    function showDetail(d) {
      // change outline to indicate hover state.
      d3.select(this)
        .attr('stroke', 'black')
        .attr('r', 8)
        
  
      var content = '<span class="name">사업명: </span><span class="value">' +
                    d.name +
                    '</span><br/>' +
                    '<span class="name">예산: </span><span class="value">' +
                    d.budget +
                    '</span><br/>' +
                    '<span class="name">기관: </span><span class="value">' +
                    d.a +
                    '</span>';
  
      tooltip.showTooltip(content, d3.event);
    }
  
    /*
     * Hides tooltip
     */
    function hideDetail(d) {
      // reset outline
      d3.select(this)
        .attr('stroke', '#ddd')
        .attr('r', 5)
  
      tooltip.hideTooltip();
    }
    
    // function clickbubble(d){
    //     d3.select(this)
    //     .attr('stroke', '#000')
    //     .attr('r', 8)

    //     d3.select('.doc').html(d.local);
  
    // }
    /*
     * 외부접근이 가능하도록 반환되는 차트객체에 프로퍼티로 토글디스플레이 함수를 넣어줌 
     */
    chart.toggleDisplay = function (displayName) {
      if (displayName != 'all') {
        splitBubbles(displayName);
      } else {
        groupBubbles();
      }
    };
  
  
    // 클로저로 부터 차트 반환
    return chart;
  }
  
  /*
   * 초기화 코드들, 디스플레이, 데이터로드
   */
  
  var myBubbleChart = bubbleChart();
  var storyChart = bubbleChart();
  
  /*
   *버블차트 dom바인딩
   */
  function display(error, data) {
    if (error) {
      console.log(error);
    }
    storyChart('.graphic__vis',data);
    // myBubbleChart('#vis', data);
  }
  
  /*
   * 버튼레이아웃
   */
  function setupButtons() {
    d3.select('#toolbar')
      .selectAll('.button')
      .on('click', function () {
        // 일단 이전클릭 클래스 없애기
        d3.selectAll('.button').classed('active', false);
        var button = d3.select(this);
        // 클릭요소에 액티브 클래스 붙이기
        button.classed('active', true);
  
        // 오 이렇게 아이디 가져올수 있었네..
        var buttonId = button.attr('id');
  
        // 토글에 클래스 넘기기
        // myBubbleChart.toggleDisplay(buttonId);
      });
  }
  

//   function addCommas(nStr) {
//     nStr += '';
//     var x = nStr.split('.');
//     var x1 = x[0];
//     var x2 = x.length > 1 ? '.' + x[1] : '';
//     var rgx = /(\d+)(\d{3})/;
//     while (rgx.test(x1)) {
//       x1 = x1.replace(rgx, '$1' + ',' + '$2');
//     }
  
//     return x1 + x2;
//   }
  

//   d3.csv('./budget_final.csv', display);
  setupButtons();
  