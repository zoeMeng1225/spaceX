import React from "react";
import { Row, Col, Button } from "antd";
import { Link } from "react-router-dom";
import logo from "../assets/space_logo.svg";

function Main() {
  return (
    <Row className="home-body">
      <Col span={12} className="wrapper-child">
        <span className="logo_space">
          <img src={logo} alt="Starlink Tracker" />
        </span>
        <div className="wrapper-child-child">
          <h1>Let's track Starlink</h1>
          <p>See which Starlink satellites are above you right now, then watch where they go.</p>
          <div className="gradual-line"></div>
          <Link to="/detail">
            <Button size="large" className="track-Btn">
              Start Tracking
            </Button>
          </Link>
        </div>
      </Col>
      <Col span={12} className="wrapper-child" />
    </Row>
  );
}

export default Main;
