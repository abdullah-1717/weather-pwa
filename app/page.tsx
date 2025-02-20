'use client';
import { useEffect, useState } from 'react';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import WbSunnyIcon from '@mui/icons-material/WbSunny'; 
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CloudIcon from '@mui/icons-material/Cloud';
import AirIcon from '@mui/icons-material/Air';
import OpacityIcon from '@mui/icons-material/Opacity';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

interface WeatherData {
  main: {
    temp: number; 
    humidity: number; 
  };
  wind: {
    speed: number;
  };
  name: string; 
}

export default function Home() {

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState('Lahore');

  const sendNotification = (title: string, message: string) => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: 'weather.png',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, {
              body: message,
              icon: 'weather.png', 
            });
          }
        });
      }
    }
  };
  

  async function fetchData(cityName: string) {
    try {
      const response = await fetch(`https://weather-pwa-next-js.vercel.app/api/weather?address=${cityName}&apikey=${API_KEY}`);
      const jsonData = (await response.json()).data;
      setWeatherData(jsonData);
      setCity('');
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData("Lahore");
  }, []);

  const renderTemperatureIcon = () => {
    if (!weatherData || !weatherData.main) {
      return null; 
    }

    const temperature = weatherData.main.temp; 
    const tempInCelsius = (temperature - 273.15).toFixed(2);

    if (parseFloat(tempInCelsius) > 30) {
      return <WbSunnyIcon style={{ fontSize: '110px', color: '#ffff33', padding: '5px' }} />;
    } else if (parseFloat(tempInCelsius) < 10) {
      return <AcUnitIcon style={{ fontSize: '110px', color: 'skyblue', padding: '5px' }} />;
    } else {
      return <CloudIcon style={{ fontSize: '110px', color: 'lightgray', padding: '5px' }} />;
    }
  };

  return (
    <div
    style={{
      background: '#0195a8',
      maxWidth: '500px',
      width: '100%',
      borderRadius: '12px',
      padding: '12px',
      margin: '0 auto',
      boxSizing: 'border-box', 
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        fontSize: '40px',
        fontWeight: 'bold',
      }}
    >
      <FilterDramaIcon style={{ marginRight: 8, fontSize: '70px', fontWeight: 'bold' }} />
      Weather
    </div>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        flexDirection: 'column',
      }}
    >
      <TextField
        variant="filled"
        color='secondary'
        placeholder='Search city name.........'
        value={city}
        onChange={(e) => setCity(e.target.value)}
        InputProps={{
          style: {
            backgroundColor: '#025964',
            color: '#000000',
            fontWeight: 'bold',
            fontSize: '18px',
            width: '100%',
            maxWidth: '300px', 
            boxSizing: 'border-box', 
          },
        }}
      />
      <Button
        variant='contained'
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          backgroundColor: '#025964',
          margin: '14px',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '300px', 
        }}
        onClick={() => {
          fetchData(city);
          sendNotification('Weather Update', `Fetching weather data for ${city}`); 
        }}
      >
        Search
      </Button>
    </div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column', 
      }}
    >
      {renderTemperatureIcon()}
      <div
        style={{
          fontSize: '34px',
          fontWeight: 'bold',
          margin: '8px',
        }}
      >
        {weatherData?.main?.temp !== undefined ? (weatherData.main.temp - 273.15).toFixed(2) : 'N/A'} °C
      </div>
    </div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        fontSize: '30px',
        fontWeight: 'bold',
        margin: '10px 0', 
      }}
    >
      <div
        style={{
          backgroundColor: '#025964',
          padding: '20px',
          borderRadius: '6px',
          textAlign: 'center', 
        }}
      >
        {weatherData?.name}
      </div>
    </div>
    <div style={{
      width: '100%', 
      margin: '20px auto', 
      padding: '20px',
      borderRadius: '12px',
      backgroundColor: '#025964',
      boxSizing: 'border-box', 
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        fontWeight: 'bold',
      }}>   
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <AirIcon style={{
            marginRight: '6px'
          }}/>
          <div>{weatherData?.wind ? weatherData.wind.speed : 'N/A'} km/h </div>
        </div>
        <div>||</div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <OpacityIcon style={{
            marginRight: '6px'
          }}/>
          <div>{weatherData?.main?.humidity ? weatherData?.main?.humidity : 'N/A'} %</div>
        </div>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between', 
        alignItems:'center',
        fontSize:'12px',
       }}>
        <div
        style={{
          paddingLeft:'45px',
        }}>Wind</div>
       <div>Humidity</div>
       </div>
       </div>
      </div>
   );
};



