import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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

  const AppContainer = styled.div`
    background: pink;

    body {
      padding: 0;
      margin: 0;
    }
  `;

  return (
    <AppContainer>
      <LineChart data={chartData} dataKey="downloads" />
    </AppContainer>
  )
}

export default App;