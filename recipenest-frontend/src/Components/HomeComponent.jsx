import React from "react";
import Navbar from "./NavbarComponent";
import Footer from "./FooterComponent";
import "../Css/Home.css";
// import "../Css/Style.css";
import Chef from "../pictures/Chef.png";
import fork from "../pictures/fork.png";



const Home= ()=> {
  return (
    <>
  <div className ="homePage">
    <div className="container">
    <div className="leftcontainer">
    <div className="Fork">
              <img src = {fork} alt ="forkpic"></img>
      </div>
      <div className="leftSide1">
          <h1>Chef Portal</h1>
          <div className="p">
          <p>A Chef's Digital Kitchen</p>
          </div>
          <div className="para">
            <p>The perfect stage to showcase your culinary talent<br /> to food lovers worldwide. Create share and savor <br />the experience!</p>
          </div>
      </div>


      </div>
      <div className="RightSide1">
              <img src = {Chef} alt ="pic"></img>
      </div>

  </div>
</div>
    </>
    
  )
}

export default Home;