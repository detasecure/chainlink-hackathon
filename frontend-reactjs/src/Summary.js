import React from 'react';

function Summary({ data }) {
  return (
    <div>
      <h2>Summary</h2>
      <p>Polygon Contracts Count: {data.polygon_contacts_count}</p>
      <p>Ethereum Contracts Count: {data.ethereum_contacts_count}</p>
    </div>
  );
}

export default Summary;
