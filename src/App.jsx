import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";

const apiKey = "be2325934b895745479abf1917254b55";  // Reemplaza con tu clave API

export default function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temperature: 0,
    dateTime: "",
  });

  const [history, setHistory] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError({ error: false, message: "" });
    setLoading(true);

    try {
      if (!city.trim()) throw { message: "El campo ciudad es obligatorio" };

      const API_WEATHER = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      
      const response = await fetch(API_WEATHER);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.cod && data.cod !== 200) {
        throw { message: data.message };
      }

      const weatherData = {
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        dateTime: new Date().toLocaleString(), // Añadir fecha y hora
      };

      setWeather(weatherData);
      saveSearchHistory(weatherData);
    } catch (error) {
      console.log(error);
      setError({ error: true, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const saveSearchHistory = async (weatherData) => {
    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(weatherData)
      });
      const data = await response.json();
      setHistory([data, ...history]);
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const getSearchHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/search');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  useEffect(() => {
    getSearchHistory();
  }, []);

  return (
    <Container
      maxWidth="xs"
      sx={{ mt: 2 }}
    >
      <Typography
        variant="h3"
        component="h1"
        align="center"
        gutterBottom
      >
        Weather App
      </Typography>
      <Box
        sx={{ display: "grid", gap: 2 }}
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          id="city"
          label="Ciudad"
          variant="outlined"
          size="small"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={error.error}
          helperText={error.message}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          loadingIndicator="Buscando..."
        >
          Buscar
        </LoadingButton>
      </Box>

      {weather.city && (
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gap: 2,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
          >
            {weather.city}, {weather.country}
          </Typography>
          <Typography
            variant="h5"
            component="h3"
          >
            {weather.temperature} °C
          </Typography>
          <Typography
            variant="h6"
            component="h4"
          >
            {weather.dateTime}
          </Typography>
        </Box>
      )}

      {history.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5" component="h3">
            Historial de Búsqueda
          </Typography>
          {history.map((item, index) => (
            <Box key={index} sx={{ mt: 1 }}>
              <Typography variant="body1">
                {item.city}, {item.country} - {item.temperature} °C - {item.dateTime}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Typography
        textAlign="center"
        sx={{ mt: 2, fontSize: "10px" }}
      >
        Powered by:{" "}
        <a
          href="https://openweathermap.org/"
          title="Weather API"
        >
          WeatherAPI.com
        </a>
      </Typography>
    </Container>
  );
}


 
    