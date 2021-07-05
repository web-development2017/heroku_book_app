import React from "react";

export const About = () =>{
  console.log("About Rendered");

  return (
    <div className="container">
      <h1>About</h1>
    </div>        
  )
}
export const MemoizedAbout = React.memo(About);