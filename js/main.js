window.createGraphic = function(graphicSelector) {
	var graphicEl = d3.select('.graphic')
	var graphicProseEl = graphicEl.select('.graphic__prose')

	var steps = [
		function step0() {
			storyChart.toggleDisplay('all');
		},

		function step1() {
			storyChart.toggleDisplay('axis');
		},

		function step2() {
			storyChart.toggleDisplay('A');
		},

		function step3() {
			storyChart.toggleDisplay('B');
		},

		function step4() {
			storyChart.toggleDisplay('C');
		},
	]

	function update(step) {
		steps[step].call()
	}
	
	function setupCharts() {
		d3.csv('./budget_final.csv', display);
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