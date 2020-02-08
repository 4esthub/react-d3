import React, { useState, useEffect } from 'react';
import * as d3 from "d3";
import styled from 'styled-components';

function LineChart (props) {
  useEffect(() => {
    const data = props.data;
    if (data.length) {
      drawChart(data.slice(data.length-20)); //past 20 days
    }
  });

  return (
    <ChartContainer id='line-chart-T1' />
  );
}

function drawChart (data) {
  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 90},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  // parse the date / time
  var parseTime = d3.timeParse("%Y-%m-%d");

  // set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // define the area
  var area = d3.area()
    .x(function(d) { return x(d.day); })
    .y0(height)
    .y1(function(d) { return y(d.downloads); })
    .curve(d3.curveBasis);

  // define the line
  var line = d3.line()
    .x(function(d) { return x(d.day); })
    .y(function(d) { return y(d.downloads); })
    .curve(d3.curveBasis);

  // append the svg obgect to the body of the page
  var svg = d3.select("#line-chart-T1").append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMinYMin meet")

    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

  draw(data);

  function draw (data) {  
    // format the data
    data.forEach(function(d) {
      d.day = parseTime(d.day);
      d.downloads = +d.downloads;
    });

    // sort years ascending
    data.sort(function(a, b){
      return a["Date"]-b["Date"];
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.day; }));
    y.domain([0, d3.max(data, function(d) {
      return Math.max(d.downloads); })]);

    // Add the area
    svg.append("path")
      .data([data])
      .attr("class", "area")
      .attr("d", area);

    // Add the line
    svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", line);

    // Add the area gradient
    svg.append("linearGradient")
      .attr("id", "area-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", '0%').attr("y1", '0%') 
      .attr("x2", '0%').attr("y2", '100%') 
      .selectAll("stop")
          .data([
              {offset: "0%", color: "rgba(199,229,225,.225)"},
              {offset: "95%", color: "transparent"}
          ])
      .enter().append("stop")
          .attr("offset", function(d) { return d.offset; })
          .attr("stop-color", function(d) { return d.color; });

    // gridlines in y axis function
    const yGridlines = () => {		
      return d3.axisLeft(y)
          .ticks(5)
    }

    // Add the gridlines
    svg.append("g")			
      .attr("class", "grid")
      .call(yGridlines()
          .tickSize(-width)
          .tickFormat("")
      );

    // Add the line
    svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", line);

    // Format the y-axis labels
    // range only supports millions ("300M") and billions ("7B")
    const largeFormat = (d) => {
      const unit = parseFloat(d3.format("s")(d));
      const unitType = `${d}`.length < 10 ? 'M' : 'B';
      return `${unit}${unitType}`;
    }
    
    // Add the Y Axis
    svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickFormat((d) => {
          return largeFormat(d);
        })
      );
  }
}

const ChartContainer = styled.div`
  svg {
    background: rgb(35,44,60);
  }

  text {
    fill: white;
    font-size: 25px;
    font-weight: 100;
  }

  .y-axis path, .y-axis line  {
    display:none;
  }

  .line {
    fill: none;
    stroke: rgb(107,229,225);
    stroke-width: 5;
  }

  .area {
    fill: url(#area-gradient);
  }

  .grid {
    stroke-width: 0;
  }
  
  .grid line {
    stroke-dasharray: 40 40;
    stroke-width: 3;
    stroke: rgb(54,71,86);
  }
`;

export default LineChart;
