import React, { Component } from "react";
import { feature } from "topojson-client";
import { Spin } from "antd";
import { geoGraticule, geoPath } from "d3-geo";
import world from "world-atlas/world/110m.json";
import { projection, MAP_WIDTH, MAP_HEIGHT } from "../projection";

// Bundled with the app instead of fetched from a CDN at runtime
const countries = feature(world, world.objects.countries).features;

class WorldMap extends Component {
  refMap = React.createRef();

  componentDidMount() {
    this.drawMap();
  }

  drawMap() {
    const canvas = this.refMap.current;
    canvas.width = MAP_WIDTH;
    canvas.height = MAP_HEIGHT;

    const context = canvas.getContext("2d");
    const path = geoPath().projection(projection).context(context);
    const graticule = geoGraticule();

    // countries
    context.fillStyle = "#A779F3";
    context.strokeStyle = "#000";
    context.globalAlpha = 0.7;
    countries.forEach((country) => {
      context.beginPath();
      path(country);
      context.fill();
      context.stroke();
    });

    // graticule
    context.globalAlpha = 1;
    context.strokeStyle = "#f5edfa3d";
    context.beginPath();
    path(graticule());
    context.lineWidth = 0.1;
    context.stroke();

    // graticule outline
    context.beginPath();
    path(graticule.outline());
    context.lineWidth = 0.5;
    context.stroke();
  }

  render() {
    return (
      <div className="map-box">
        <canvas className="map" ref={this.refMap} />
        <canvas className="track" ref={this.props.refTrack} />
        {this.props.loading && <Spin tip="Loading positions..." size="large" />}
      </div>
    );
  }
}

export default WorldMap;
