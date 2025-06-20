const WeatherMock = {
  request: {
    key: "test-api-key",
    corectCity: "Lviv",
    wrongCity: "12",
  },
  response: { temperature: 20, humidity: 50, description: "Sunny" },
  apiResponse: {
    current: { temp_c: 20, condition: { text: "Sunny" }, humidity: 50 },
  },
};

export { WeatherMock };
