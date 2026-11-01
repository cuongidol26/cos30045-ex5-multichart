d3.csv("data/ARE_Spot_Prices.csv", d => {
  return {
    year: +d["Year"],
    averagePrice: +d["Average Price (notTas-Snowy)"]
  };
}).then(data => {
  console.log(data);
  drawLineChart(data);
});

const drawLineChart = data => {
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.averagePrice)])
    .range([innerHeight, 0])
    .nice();

  const bottomAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format("d"));

  const leftAxis = d3.axisLeft(yScale)
    .ticks(6);

  const svg = d3.select("#line-chart")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  innerChart
    .append("g")
      .attr("class", "axis-x")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);

  innerChart
    .append("g")
      .attr("class", "axis-y")
      .call(leftAxis);

  svg
    .append("text")
      .attr("class", "axis-label")
      .text("Average spot price ($ per megawatt hour)")
      .attr("x", 0)
      .attr("y", 20);

  svg
    .append("text")
      .attr("class", "axis-label")
      .text("Year")
      .attr("x", width - margin.right)
      .attr("y", height - 6)
      .attr("text-anchor", "end");

  const areaGenerator = d3.area()
    .x(d => xScale(d.year))
    .y0(innerHeight)
    .y1(d => yScale(d.averagePrice))
    .curve(d3.curveMonotoneX);

  innerChart
    .append("path")
      .attr("d", areaGenerator(data))
      .attr("fill", barColor)
      .attr("fill-opacity", 0.12);

  const lineGenerator = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.averagePrice))
    .curve(d3.curveMonotoneX);

  innerChart
    .append("path")
      .attr("d", lineGenerator(data))
      .attr("fill", "none")
      .attr("stroke", barColor)
      .attr("stroke-width", 2.5);

  innerChart
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("r", 3.5)
      .attr("cx", d => xScale(d.year))
      .attr("cy", d => yScale(d.averagePrice))
      .attr("fill", barColor);

  const peak = data.find(d => d.averagePrice === d3.max(data, d => d.averagePrice));

  innerChart
    .append("circle")
      .attr("r", 6)
      .attr("cx", xScale(peak.year))
      .attr("cy", yScale(peak.averagePrice))
      .attr("fill", accentColor);

  innerChart
    .append("text")
      .attr("class", "annotation")
      .text(`Peak: $${peak.averagePrice} in ${peak.year}`)
      .attr("x", xScale(peak.year) - 12)
      .attr("y", yScale(peak.averagePrice))
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "end");
};
