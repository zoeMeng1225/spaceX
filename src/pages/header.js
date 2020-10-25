import React from 'react';
import {Link} from 'react-router-dom';


function Header(){
  return(
    <div className = "header-wrapper">

      <Link to = "/">
        <span className = "header-span">
          <img src= {require('../assets/space_logo.svg')} alt=""/>
        </span>
      </Link>
    </div>
    
  )
}


export default Header;