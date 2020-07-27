# Udacity Front End Web Developer Nanodegree Program Project #3: Weather Journal App

A weather journal app to get to grips with Express.js. Record your feelings while automatically adding current weather data using your ZIP code.

## To Run The Project

You need a [OpenWeather](https://openweathermap.org/) map API key to run the project. If you want a more reliable resolving of ZIP codes (OpenWeather ZIP code resolution only seems to work great with larger cities) then a [Zipcodebase](https://zipcodebase.com/) API key is also needed. If the Zipcodebase API key is provided then if the OpenWeather ZIP code based query doesn't resolve, an attempt will be made to resolve the ZIP code to a city name with Zipcodebase. After resolving the city name a new query to OpenWeather will be made but this time using the resolved city name instead of the ZIP code.

To resolve dependencies run `npm install`. To launch the server using `node` run `node ./src/app.js` followed by the command line arguments. The server will be started on port 8000.

## Command line arguments

`--countryCode` **Optional** ISO 3166 Alpha-2 country code to combine the ZIP code with. Will default to "ee" (Estonia).  
`--weatherAPIKey` **Required** [OpenWeather](https://openweathermap.org/) map API key. Used for getting weather data.  
`--zipcodebaseAPIKey` **Optional** [Zipcodebase](https://zipcodebase.com/) api key. Used as a fallback to resolve ZIP codes to a city name and then attempting the OpenWeather query again using the city name instead of ZIP code.
