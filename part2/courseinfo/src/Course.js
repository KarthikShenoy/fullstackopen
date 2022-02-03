import React from 'react';

const Header = ({ props }) => {
  return <h1>{props.name}</h1>;
};
const Part = ({ props }) => {
  return <p>{props.name} {props.exercises}</p>;
};
const Content = ({ props }) => {
  return (
    <>
      {props.parts.map(e => <Part key={e.id} props={e} />
      )}
    </>
  );
};
const Total = ({ props }) => <b><p>Number of excercises {props.parts.reduce((sum, c) => (sum + c.exercises),
  0)}</p></b>;
export const Course = ({ course }) => {
  return (
    <>
      <Header props={course} />
      <Content props={course} />
      <Total props={course} />
    </>
  );
};

export default Course;