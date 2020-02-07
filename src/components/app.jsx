import React, { useState, useEffect } from 'react';
import LineChart from './charts/line-chart';

function App () {
  const [chartData, setChartData] = useState({})
 
  useEffect(() => {
    (async function fetchData () {
      const path = window.location.pathname;
      const res = await fetch(
        `https://api.npmjs.org/downloads/range/2018-07-20:2020-01-20${path}`
      );
      const json = await res.json();

      setChartData(json.downloads.map(c => c));
    })();
  }, []);

  return (
    <div>
      <LineChart data={chartData} dataKey="downloads" />
    </div>
  )
}

export default App;