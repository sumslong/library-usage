function sessionCluster() {

let width = 800,
  height = 800;

let svg = d3.select("#sessionsCluster")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

d3.csv("sessions_visits_income_2022.csv").then(data => {

  let rScale = d3.scaleLinear()
    .range([0, 250])
    .domain(d3.extent(data, d => d.SessionPopRate));

  let colors = d3.scaleThreshold()
    .domain([20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000])
    .range(d3.schemeBlues[9]);

  let simulation = d3.forceSimulation(data)
    .force("charge", d3.forceManyBody().strength(1000)) //strength
    .force("center", d3.forceCenter().x(width / 2).y(height / 2))
    .force("collision", d3.forceCollide().radius(d => rScale(d.SessionPopRate) + 1.5));

  let g = svg.append("g")
    .attr("class", "group");

  simulation.on("tick", () => {
    g.selectAll("circle")
      .data(data)
      .join("circle")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("r", d => rScale(d.SessionPopRate))
      .attr("fill", d => colors(d.MedianIncome))
      .attr("opacity", 0.75)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 1);

        tooltip
          .style("visibility", "visible")
          .html(`<h3>${d.BRANCH}</h3><br />Median Income: $${d.MedianIncome}<br /><span style="text-transform: capitalize">Sessions per person rate: ${d.SessionPopRate}</span>`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 0.75);
        tooltip.style("visibility", "hidden");
      })
  })

  for (let i = 0; i < 100; i++) {
    simulation.tick()
  }
});

const tooltip = d3.select("body").append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");
};