const WeatherMock = {
  request: {
    weatherApiKey: "test-api-key",
    weatherbitKey: "test-weatherbit-key",
    weatherstackKey: "test-weatherstack-key",

    wrongWeatherApiKey: "wrong-api-key",
    wrongWeatherbitKey: "wrong-weatherbit-key",
    wrongWeatherstackKey: "wrong-weatherstack-key",

    corectCity: "Lviv",
    wrongCity: "12",
  },
  response: { temperature: 20, humidity: 50, description: "Sunny" },
  weatherApiResponse: {
    current: { temp_c: 20, condition: { text: "Sunny" }, humidity: 50 },
  },
  weatherbitResponse: {
    data: [
      {
        temp: 20,
        weather: {
          description: "Sunny",
        },
        rh: 50,
      },
    ],
  },
  weatherstackResponse: {
    current: {
      temperature: 20,
      weather_descriptions: ["Sunny"],
      humidity: 50,
    },
  },
};

export { WeatherMock };
