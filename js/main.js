window.createGraphic = function(graphicSelector) {
	var graphicEl = d3.select('.graphic')
	var graphicVisEl = graphicEl.select('.graphic__vis')
	var graphicProseEl = graphicEl.select('.graphic__prose')

	var margin = 20
	var size = window.innerWidth*0.5
	var sizeheight=window.innerHeight
	var chartSizeW = size - margin * 2
	var chartSizeH = window.innerHeight
	d3.csv('./budget_final.csv', display);
	var steps = [
		function step0() {
			// 버블차트 생성 
			// var t = d3.transition()
			// 	.duration(800)
			// 	.ease(d3.easeQuadInOut)
			storyChart.toggleDisplay('all');

		},

		function step1() {
			//액수에 따라 리스트 
			var t = d3.transition()
				.duration(800)
				.ease(d3.easeQuadInOut)
				storyChart.toggleDisplay('axis');
			// circles are positioned
	
		},

		function step2() {
			//지역성사업 342개
			var t = d3.transition()
				.duration(800)
				.ease(d3.easeQuadInOut)
				storyChart.toggleDisplay('A');
			// circles are sized
		
		},

		function step3() {
			//2년연속사업 28개
			var t = d3.transition()
				.duration(800)
				.ease(d3.easeQuadInOut)
				storyChart.toggleDisplay('B');
		},

		function step4() {
			//깜깜이 사업 128개
			var t = d3.transition()
				.duration(800)
				.ease(d3.easeQuadInOut)
				storyChart.toggleDisplay('C');
		},
		function step5() {
		},
	]

	// update our chart
	function update(step) {
		steps[step].call()
	}
	
	// little helper for string concat if using es5
	function translate(x, y) {
		return 'translate(' + x + ',' + y + ')'
	}

	function setupCharts() {
		// var svg = graphicVisEl.append('svg')
		// 	.attr('width', '100%')
		// 	.attr('height', '100%')
		// 	.attr("viewBox", "0 0 " + size + " " + sizeheight )
		// 	.attr("preserveAspectRatio", "xMidYMid meet")
	
		// var chart = svg.append('g')
		// 	.classed('chart', true)
		// 	.attr('transform', 'translate(' + margin + ',' + margin + ')')

		// d3.csv('./budget_final.csv', display );

	}

	function setupProse() {
		var height = window.innerHeight * 0.5
		graphicProseEl.selectAll('.trigger')
			.style('height', height + 'px')
	}

	function init() {
		setupCharts()
		setupProse()
		update(0)
	}
	
	init()
	
	return {
		update: update,
	}
}