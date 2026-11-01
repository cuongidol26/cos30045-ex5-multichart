d3.csv("data/tv55ScreenTech.csv", d => {
  return {
    screenTech: d.screenTech,
    energy: +d.meanEnergy
  };
}).then(data => {
  console.log(data);
  data.sort((a, b) => b.energy - a.energy);
  drawBarChart(data);
});

const drawBarChart = data => {
  const svg = d3.select("#bar-chart")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.screenTech))
    .range([0, innerWidth])
    .padding(0.4);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.energy)])
    .range([innerHeight, 0])
    .nice();

  const bottomAxis = d3.axisBottom(xScale)
    .tickSize(0)
    .tickPadding(10);

  innerChart
    .append("g")
      .attr("class", "axis-x")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);

  const leftAxis = d3.axisLeft(yScale)
    .ticks(5);

  innerChart
    .append("g")
      .attr("class", "axis-y")
      .call(leftAxis);

  svg
    .append("text")
      .attr("class", "axis-label")
      .text("Average energy consumption (kWh per year)")
      .attr("x", 0)
      .attr("y", 20);

  innerChart
    .selectAll(".bar")
    .data(data)
    .join("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.screenTech))
      .attr("y", d => yScale(d.energy))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d.energy))
      .attr("fill", barColor);

  innerChart
    .selectAll(".bar-value")
    .data(data)
    .join("text")
      .attr("class", "bar-value")
      .text(d => `${Math.round(d.energy)} kWh`)
      .attr("x", d => xScale(d.screenTech) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.energy) - 8)
      .attr("text-anchor", "middle");
};
