import React from "react";

export const About = () =>{
  
  console.log('%c render' , 'color: red');

  return (
    <div className="container">
      <h1>About</h1>
    </div>        
  )
}
export const MemoizedAbout = React.memo(About);