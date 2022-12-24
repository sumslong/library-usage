function visitsScatterplot() {

let h2 = 400,
    w2 = 600,
    margin = ({ top: 25, right: 30, bottom: 35, left: 40 });
  
const svg = d3.select("#visitsScatterplot")
    .append("svg")
    .attr("viewBox", [0, 0, w2, h2]);

d3.csv('sessions_visits_income_2022.csv').then(data => {
  for (let d of data) {
    d.MedianIncome = +d.MedianIncome
    d.SessionVisitRate = +d.SessionVisitRate
  }
  let x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.MedianIncome)).nice()
    .range([margin.left, w2 - margin.right]);

  let y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.SessionVisitRate)).nice()
    .range([h2 - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(0,${h2 - margin.bottom})`)
    .attr("class", "x-axis")
    .call(d3.axisBottom(x).tickFormat(d => "$" + d).tickSize(-h2 + margin.top + margin.bottom))

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).tickSize(-w2 + margin.left + margin.right))

  svg.append("g")
    .attr("fill", "black")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.MedianIncome))
    .attr("cy", d => y(d.SessionVisitRate))
    .attr("r", 2)
    .attr("opacity", 0.75); 

    svg.append("text")      // text label for the x axis
        .attr("x", 560 )
        .attr("y",  390 )
        .style("text-anchor", "middle")
        .text("Median Income");

        svg.append("text")      // text label for the x axis
        .attr("x", 50 )
        .attr("y",  20 )
        .style("text-anchor", "middle")
        .text("Sessions per visit rate");


  const tooltip = d3.select("body").append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

  d3.selectAll("circle")
    .on("mouseover", function(event, d) {
      d3.select(this).attr("fill", "red");
      tooltip
        .style("visibility", "visible")
        .html(`Library: ${d.BRANCH}<br />Address: ${d.ADDRESS}<br />Session by Visit Rate: ${d.SessionVisitRate}`);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      d3.select(this).attr("fill", "black");
      tooltip.style("visibility", "hidden");
    })
})
    
};
