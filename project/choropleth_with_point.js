function choropleth() {
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

const height = 500,
    width = 875;

const svg = d3.select("#choropleth")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

Promise.all([
  d3.csv("census_chicago_income.csv"),
  d3.json("chicago.json"),
  d3.csv("sessions_visits_income_2022.csv")
]).then(([data, chicago, sesvisin]) => {
  const dataByZipcode = {};

  for (let d of data) {
    d.MedianIncome = +d.MedianIncome;
    dataByZipcode[d.Zipcode] = d;
  }

  let foo = []; 

  for (let svi of sesvisin) {
    let longlat = {};
    let long = +(svi.Location).split(",")[0].slice(1);
    let lat = +(svi.Location).split(",")[1].slice(1, -1);

    longlat.location = svi.BRANCH;
    longlat.arr = [];
    longlat.arr.push(long, lat);

    foo.push(longlat);
  }

  const zips = topojson.feature(chicago, chicago.objects["Boundaries - ZIP Codes"]);

  const color = d3.scaleThreshold()
    .domain([20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000])
    .range(d3.schemeBlues[9]);

    const mesh = topojson.mesh(chicago, chicago.objects["Boundaries - ZIP Codes"])
    const projection = d3.geoMercator()
      .fitSize([width, height], mesh)
      .scale(width*65)
      .center([-87.6298, 41.8781])
      .translate([width / 2, height / 3]);
    const path = d3.geoPath().projection(projection);

  d3.select("#legend")
    .node()
    .appendChild(
      Legend(
        d3.scaleOrdinal(
          ["< $20k", "$20k", "$30k", "$40k", "$50k", "$60k", "$70k", "$80k", "$90k+"],
          d3.schemeBlues[9]
        ),
        { title: "Income brackets" }
      ));

  svg.append("g")
    .selectAll("path")
    .data(zips.features)
    .join("path")
    .attr("fill", d => (d.properties.zip in dataByZipcode) ? color(dataByZipcode[d.properties.zip].MedianIncome) : '#ccc')
    .attr("d", path)

    
  
    .on("mousemove", function (event, d) {
      let info = d.properties.zip;
      tooltip
        .style("visibility", "visible")
        .html(`Zipcode: ${dataByZipcode[info].Zipcode}<br>Median household income: $${dataByZipcode[info].MedianIncome}`)
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
      d3.select(this).attr("fill", "goldenrod");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
      d3.select(this).attr("fill", d => (d.properties.zip in dataByZipcode) ? color(dataByZipcode[d.properties.zip].MedianIncome) : '#ccc');
    });

    svg.append("g")
      .selectAll(".star")
      .data(foo)
      .join("path")
      .attr("stroke", 'red')
      .attr("d", d3.symbol().type(d3.symbolStar).size(12))
      .attr("class", "star")
      .attr("fill", "red")
      .attr("opacity", 0.75)
      .attr("r", 3)
      .attr("transform", function(d) {return "translate(" + projection(d.arr) + ")";}); 

});
};