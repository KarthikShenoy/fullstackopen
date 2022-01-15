import React from 'react';

const Hello = (props) => {
  return (
    <div>
      <p>Hello {props.name}, you are {props.age} years old.</p>
    </div>
  )
}
const Footer = () =>(
  <div>
    Greeting app created by somone at University Of Helsinki.
  </div>
)
const App = () => {
  const name = "Peter";
  const age = 10;
  return (
  <>
    <p>Greetings</p>
    <Hello name="Maya" age={26+10}/>
    <Hello name={name} age={age}/>
    <Footer/>
  </>
  )
}
export default App;