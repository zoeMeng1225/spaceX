import React, { Component } from "react";
import { InputNumber, Button } from "antd";

class SatSetting extends Component {
  state = {
    observerLat: 0,
    observerLong: 0,
    observerAlt: 0,
    radius: 90,
  };

  // InputNumber passes null when the field is cleared
  update = (key) => (value) => this.setState({ [key]: value ?? 0 });

  showSatellite = () => this.props.onShow(this.state);

  render() {
    return (
      <div className="sat-setting">
        <div className="loc-setting">
          <div className="setting-list two-item-col">
            <div className="list-item">
              <label>Longitude: </label>
              <InputNumber
                min={-180}
                max={180}
                defaultValue={0}
                style={{ margin: "0 2px" }}
                onChange={this.update("observerLong")}
              />
            </div>
            <div className="list-item right-item">
              <label>Latitude: </label>
              <InputNumber
                min={-90}
                max={90}
                defaultValue={0}
                style={{ margin: "0 2px" }}
                onChange={this.update("observerLat")}
              />
            </div>
          </div>
          <div className="setting-list">
            <div className="list-item">
              <label>Elevation (meters): </label>
              <InputNumber
                min={0}
                max={9000}
                defaultValue={0}
                style={{ margin: "0 2px" }}
                onChange={this.update("observerAlt")}
              />
            </div>
          </div>
          <div className="setting-list">
            {/* N2YO search radius in degrees: 90 = everything above the horizon */}
            <div className="list-item flex">
              <label>Search Radius (°):</label>
              <InputNumber
                min={0}
                max={90}
                defaultValue={90}
                style={{ margin: "0 2px" }}
                onChange={this.update("radius")}
              />
            </div>
          </div>
          <div className="show-nearby">
            <Button
              className="show-nearby-btn"
              size="large"
              loading={this.props.loading}
              onClick={this.showSatellite}
            >
              Find Nearby Satellites
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default SatSetting;
