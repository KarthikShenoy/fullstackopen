import React, { useState } from 'react'
import Button from './Button'
import Statistics from './Statistics'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incrementGood=()=> setGood(good+1);
  const incrementNeutral=()=> setNeutral(neutral+1);
  const incrementBad=()=> setBad(bad+1);

  return (
    <div>
      <h1>give feedback</h1>
      <Button text='good' onClick={incrementGood}/>
      <Button text='neutral' onClick={incrementNeutral}/>
      <Button text='bad' onClick={incrementBad}/>
      <Statistics good={good} bad={bad} neutral={neutral}/>
    </div>
  )
}

export default App