import React from "react";
import "../Css/Footer.css";


const Footer =() =>{
  return(
<div className ="footerComponent">
  <footer>
    <p><i className="ri-copyright-line" style={{ fontSize: '24px', margin: '0 10px' }}></i> All rights Reserved</p>
    <p>Contact us:<i className="ri-phone-line" style={{ fontSize: '24px', margin: '0 10px' }}></i> 0565665</p>
    <p>Follow us on:  
         {/* Instagram Icon */}
         <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <i className="ri-instagram-line" style={{ fontSize: '24px', margin: '0 10px' }}></i>
        </a>
         {/*Facebook Icon */}
         <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
         <i className="ri-facebook-fill"></i>
         </a>
        {/* Twitter Icon */}
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <i className="ri-twitter-line" style={{ fontSize: '24px', margin: '0 10px' }}></i>
        </a>
        {/*LinkedIn*/}
        <a href="" target ="_blank" rel="noopener noreferrer">
        <i className="ri-linkedin-fill" style={{ fontSize: '24px', margin: '0 10px' }}></i>
        </a>
       
    </p>
  </footer>
  </div>
  );
}
export default Footer;