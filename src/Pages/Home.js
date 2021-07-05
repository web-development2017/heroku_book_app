import React from "react";
export const Home = () =>{
    console.log("Home Rendered")
    return (
    <div className="container">
        <h1>Home</h1>
    </div> 
    )
}
  
export const MemoizedHome = React.memo(Home);