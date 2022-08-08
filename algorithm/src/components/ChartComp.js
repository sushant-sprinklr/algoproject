import React from "react";
import { Chart } from "react-google-charts";

const ChartComp = (props) => {
  const options = {
    title: "% of Failures vs Time",
    hAxis: { title: "Time", viewWindow: { min: 0 } },
    vAxis: { title: "% of Failures", viewWindow: { min: 0 } },
    legend: "right",
  };
  if (props.data == null) {
    console.log("ERROR");
  } else {
  }
  return (
    <Chart
      chartType="LineChart"
      data={props.data}
      options={options}
      width="80%"
      height="400px"
      legendToggle
    />
  );
};

export default ChartComp;
