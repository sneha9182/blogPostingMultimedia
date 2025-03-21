import React from 'react';

const WeatherWidget = () => {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-xl font-bold mb-4">Weather</h3>
      <div className="flex items-center">
        <span className="text-4xl mr-4">☀️</span>
        <div>
          <p className="text-2xl font-bold">28°C</p>
          <p className="text-gray-500">Sunny</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;