import React, {Component} from 'react';
import {Row, Col, Button} from 'antd';
import {Link} from 'react-router-dom';

 
class Main extends Component {
  render() {
  return(
        <Row className="home-body">
          <Col span={12} className ="wrapper-child">
          <span className = "logo_space">
                <img src= {require('../assets/space_logo.svg')} alt="SpaceX"/>
            </span>
            <div className = "wrapper-child-child">
              <h1>Let's track Starlink</h1>
              <p>check the real-time satellites  when you can see</p>
              <div className = "gradual-line"></div>
              <Link to = "/detail">
                <Button 
                size = "large"
                className = "track-Btn">Start Track</Button>
              </Link>
            </div>
          </Col>
          <Col span={12} className = "wrapper-child" >
          
          </Col>
        </Row>
    ); 
 }
}


 export default Main;
