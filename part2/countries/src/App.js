import React, { useEffect, useState } from "react";
import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY

const showCountryDetails = (element, resultHandler) => {
  resultHandler([element])
}
const List = ({ header, elements }) => {
  return (
    <>
      <h2>{header}</h2>
      <ul>
        {elements.map(element => <li key={element}>{element}</li>)}
      </ul>
    </>
  )
}
const Weather = ({ capital }) => {
  const [weather, setWeather] = useState("")
  const weather_api_query = `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${capital}&aqi=no`
  const get_weather = () => axios.get(weather_api_query).then(response => {
    setWeather(response.data)
  })
  useEffect(get_weather, [weather_api_query])
  if (weather === "") {
    return <></>
  }
  return (
    <>
      <p>Temperature {weather.current.temp_c} Celcius</p>
      <img src={weather.current.condition.icon} />
      <p>wind {weather.current.wind_kph} KM/h</p>
    </>
  )
}
const CountryDetails = ({ country }) => {
  return (
    <>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <List header="languages" elements={Object.values(country.languages)} />
      <img src={country.flags['svg']} />
      <Weather capital={country.capitalInfo.latlng} />
    </>
  )
}
const QueryResult = ({ result, resultHandler }) => {
  if (result.length === 1) {
    return <CountryDetails country={result[0]} />
  } else {
    return (
      <>
        {result.map(element =>
          <p key={element.name.common}>{element.name.common}<button onClick={((e) => showCountryDetails(element, resultHandler))}>Show</button></p>
        )}
      </>
    )
  }
}

const App = () => {
  const [query, setQuery] = useState("")
  const [apiResult, setApiResult] = useState([])
  const [result, setResult] = useState([])

  const fetchCountryHook = () => {
    axios.get("https://restcountries.com/v3.1/all")
      .then(response => {
        setApiResult(response.data)
      }
      )
  }
  useEffect(fetchCountryHook, [])
  const onQueryChange = (event) => {
    event.preventDefault();
    const inp = event.target.value.toLowerCase()
    setQuery(inp)
    const res = apiResult.filter(country => {
      return country.name.common.toLowerCase().includes(inp)
    })
    setResult(res)
  }
  return <>
    <form>
      <div>
        find countries<input value={query} onChange={onQueryChange}></input>
      </div>
    </form>
    <QueryResult result={result} resultHandler={setResult} />
  </>
}
export default App;
