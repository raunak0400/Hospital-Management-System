import React, { useState } from 'react';

export default function TestInput() {
  const [value, setValue] = useState('');
  return (
    <div style={{ padding: 40 }}>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Type here"
        style={{ fontSize: 24, padding: 8, width: 300 }}
      />
      <div style={{ marginTop: 20 }}>Value: {value}</div>
    </div>
  );
} 