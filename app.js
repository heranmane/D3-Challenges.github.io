// @TODO: YOUR CODE HERE!
function makeResponsive() {
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
    d3.csv("data.csv").then(function (stateData) {
        console.log(stateData)

        // Step 1: Parse Data/Cast as numbers
        // ==============================

        stateData.forEach(function (data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
        });

        // Step 2: Create scale functions
        // ==============================
        var xLinearScale = d3.scaleLinear()
            .domain([8, d3.max(stateData, d => d.poverty)])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(stateData, d => d.healthcare)])
            .range([height, 0]);

        // // Step 3: Create axis functions
        // // ==============================
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // // Step 4: Append Axes to the chart
        // // ==============================
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

        // // Step 5: Create Circles
        // // ==============================
        var circlesGroup = chartGroup.selectAll("circle")
            .data(stateData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "20px")
            .attr("fill", "teal")
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 3)
            .attr("opacity", ".5")
        

    
        //============add texts to each datapoint=========
         chartGroup
         .selectAll(null)
            .data(stateData)
            .enter()
            .append("text")
             .text(d => d.abbr)
            .attr("x", function (d) {
                return xLinearScale(d.poverty)
            })
            .attr("y", function (d) {
                return yLinearScale(d.healthcare )
            })
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .attr("font-size", "12px")
            .style("font-weight", "bold")
            ;


        // // Step 6: Initialize tool tip
        // // ==============================
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .style("font-size", "40")
            .html(function (d) {
                return (`${d.state}<br>Poverty: ${d.poverty}<br>Health Care : ${d.healthcareLow}`);
            });

        // // Step 7: Create tooltip in the chart
        // // ==============================
        chartGroup.call(toolTip);

        // // Step 8: Create event listeners to display and hide the tooltip
        // // ==============================
        circlesGroup.on("click", function (data) {
            toolTip.show(data, this);
        })
        //     // onmouseout event
            .on("mouseout", function (data, index) {
                toolTip.hide(data);
            });

        // // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lack of Healthcare (%)");

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("In Poverty (%)");




}).catch(function (error) {
    console.log(error);
});
}

// When the browser loads, makeResponsive() is called.
makeResponsive();