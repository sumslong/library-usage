d3.csv("census_chicago_income.csv").then(data => {

    let incomebrackets = [
        { bracket: "> $20k", count: 0 },
        { bracket: "$20k", count: 0 },
        { bracket: "$30k", count: 0 },
        { bracket: "$40k", count: 0 },
        { bracket: "$50k", count: 0 },
        { bracket: "$60k", count: 0 },
        { bracket: "$70k", count: 0 },
        { bracket: "$80k", count: 0 },
        { bracket: "$90k+", count: 0 },
    ];
    
    for(var d of data) {
        let nd = incomebrackets.find(nd => nd.bracket == d["IncomeBracket"]);
        nd.count += +d.Population;
    };
    
    const height = 1000,
          width = 1000,
          margin = ({ top: 25, right: 30, bottom: 35, left: 50 });

    let svg = d3.select("#zipcodeBar")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); 
    
    let x = d3.scaleBand()
        .domain(incomebrackets.map(d => d.bracket))
        .range([margin.left, width - margin.right])
        .padding(0.1);
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(incomebrackets, d => d.count)]).nice() 
        .range([height - margin.bottom, margin.top]); 
    
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));

    let bar = svg.selectAll(".bar")
        .append("g")
        .data(incomebrackets)
        .join("g")
        .attr("class", "bar");

    bar.append("rect")
        .attr("fill", "maroon")
        .attr("x", d => x(d.bracket))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.count))
        .attr("height", d => y(0) - y(d.count));
    
    bar.append('text') 
        .text(d => d.count)
        .attr('x', d => x(d.bracket) + (x.bandwidth()/2))
        .attr('y', d => y(d.count) + 15)
        .attr('text-anchor', 'middle')
        .style('fill', 'white');
    
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Income Bracket");

    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -margin.left/3)
        .attr("y", 6)
        .attr("transform", "rotate(-90)")
        .text("Population");
});