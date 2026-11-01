d3.csv("data/tvSizeCategory.csv", d => {
  return {
    sizeCategory: d.sizeCategory,
    count: +d.count
  };
}).then(data => {
  console.log(data);
  drawDonutChart(data);
});

const drawDonutChart = data => {
  const radius = Math.min(width, height) / 2 - 20;
  const total = d3.sum(data, d => d.count);

  const colorScale = d3.scaleOrdinal()
    .domain(data.map(d => d.sizeCategory))
    .range(["#a9cfe0", "#2f6f8f", "#163d52"]);

  const pieGenerator = d3.pie()
    .value(d => d.count)
    .sort(null);

  const arcGenerator = d3.arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius)
    .padAngle(0.02)
    .cornerRadius(4);

  const svg = d3.select("#donut-chart")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  const donutContainer = svg
    .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const arcs = donutContainer
    .selectAll(".arc")
    .data(pieGenerator(data))
    .join("g")
      .attr("class", "arc");

  arcs
    .append("path")
      .attr("d", arcGenerator)
      .attr("fill", d => colorScale(d.data.sizeCategory));

  arcs
    .append("text")
      .attr("class", "slice-label")
      .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("fill", d => d.data.sizeCategory === "Small" ? "#1f2a30" : "#ffffff")
      .call(text => text.append("tspan")
        .text(d => d.data.sizeCategory)
        .attr("x", 0)
        .attr("dy", "-0.2em"))
      .call(text => text.append("tspan")
        .text(d => d3.format(".0%")(d.data.count / total))
        .attr("x", 0)
        .attr("dy", "1.2em"));

  donutContainer
    .append("text")
      .attr("class", "donut-total")
      .text(d3.format(",")(total))
      .attr("text-anchor", "middle")
      .attr("dy", "0.1em");

  donutContainer
    .append("text")
      .attr("class", "donut-caption")
      .text("TV models")
      .attr("text-anchor", "middle")
      .attr("dy", "1.6em");
};
