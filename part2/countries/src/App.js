import React, { useEffect, useState } from "react";
import axios from 'axios'

const showCountryDetails =(element, resultHandler)=>{
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
const CountryDetails = ({ country }) => {
  return (
    <>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <List header="languages" elements={Object.values(country.languages)} />
      <img src={country.flags['svg']} />
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
            <p>{element.name.common}<button onClick={((e)=> showCountryDetails(element, resultHandler))}>Show</button></p>
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
        console.log("Got data ");
        setApiResult(response.data)
      }
      )
  }
  useEffect(fetchCountryHook, [])
  const onQueryChange = (event) => {
    event.preventDefault();
    const inp = event.target.value.toLowerCase()
    setQuery(inp)
    apiResult.map(entry => console.log(entry.name.common))
    const res = apiResult.filter(country => {
      return country.name.common.toLowerCase().includes(inp)
    })
    console.log(`Filtered data '${inp}' is '${res}'`)
    setResult(res)
  }
  return <>
    <form>
      <div>
        find countries<input value={query} onChange={onQueryChange}></input>
      </div>
    </form>
    <QueryResult result={result} resultHandler={setResult}/>
  </>
}
export default App;
