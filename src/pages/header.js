import React from 'react';


function Header(){
  return(
    <div className = "header-wrapper">
      <span className = "header-span">
      <img src= {require('../assets/space_logo.svg')} alt=""/>
       </span>
    </div>
    
  )
}


export default Header;