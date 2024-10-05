import React, { useState } from 'react';

const LocationComponent = () => {
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Successfully retrieved coordinates
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
          setError(null); // Reset any previous errors
        },
        (error) => {
          // Handle error case
          setError(error.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div>
      <h2>Get Your Location</h2>
      <button onClick={getLocation}>Get Location</button>
      {coordinates && (
        <div>
          <h3>Coordinates:</h3>
          <p>Latitude: {coordinates.latitude}</p>
          <p>Longitude: {coordinates.longitude}</p>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default LocationComponent;
