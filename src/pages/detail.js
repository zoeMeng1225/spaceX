import React, { Component } from "react";
import { Layout, Row, Col, message } from "antd";
import axios from "axios";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { timeFormat } from "d3-time-format";
import SatSetting from "./satsetting";
import SatelliteList from "./satelliteList";
import DetailHeader from "./header";
import DetailFooter from "./footer";
import WorldMap from "./worldMap";
import { projection, MAP_WIDTH, MAP_HEIGHT } from "../projection";
import {
  NEARBY_SATELLITE_URL,
  SATELLITE_POSITION_URL,
  STARLINK_CATEGORY,
  MAX_TRACK_SECONDS,
} from "../constants";
import "./style.css";

const { Header, Content, Footer } = Layout;

// Playback: advance 5 seconds of orbit every 100ms (50x real time)
const STEP_SECONDS = 5;
const FRAME_MS = 100;

// One scale for the whole session so each satellite keeps its color
const satColor = scaleOrdinal(schemeCategory10);
const formatTime = timeFormat("%b %d, %H:%M:%S");

class Detail extends Component {
  state = {
    loadingSatellites: false,
    loadingSatPositions: false,
    setting: undefined,
    satInfo: undefined,
    selected: [],
  };

  refTrack = React.createRef();
  timer = null;

  componentWillUnmount() {
    this.stopTracking();
  }

  showNearbySatellite = (setting) => {
    this.setState({ setting });
    this.fetchSatellite(setting);
  };

  fetchSatellite = ({ observerLat, observerLong, observerAlt, radius }) => {
    const url = `${NEARBY_SATELLITE_URL}/${observerLat}/${observerLong}/${observerAlt}/${radius}/${STARLINK_CATEGORY}/`;

    this.setState({ loadingSatellites: true });
    axios
      .get(url)
      .then(({ data }) => {
        // N2YO reports errors (e.g. a bad API key) with a 200 status
        if (data.error) throw new Error(data.error);
        this.setState({ satInfo: data, loadingSatellites: false, selected: [] });
      })
      .catch((error) => {
        console.error("Failed to fetch nearby satellites", error);
        message.error(`Couldn't load satellites: ${error.message}`);
        this.setState({ loadingSatellites: false });
      });
  };

  addOrRemove = (item, checked) => {
    this.setState(({ selected }) => {
      const without = selected.filter((s) => s.satid !== item.satid);
      return { selected: checked ? [...without, item] : without };
    });
  };

  trackOnClick = (minutes) => {
    const { observerLat, observerLong, observerAlt } = this.state.setting;
    const seconds = Math.min(minutes * 60, MAX_TRACK_SECONDS);

    this.setState({ loadingSatPositions: true });

    const requests = this.state.selected.map(({ satid }) =>
      axios.get(`${SATELLITE_POSITION_URL}/${satid}/${observerLat}/${observerLong}/${observerAlt}/${seconds}/`)
    );

    Promise.all(requests)
      .then((responses) => {
        this.setState({ loadingSatPositions: false });
        this.track(responses.map((r) => r.data));
      })
      .catch((error) => {
        console.error("Failed to fetch satellite positions", error);
        message.error("Couldn't load satellite positions. Try again in a moment.");
        this.setState({ loadingSatPositions: false });
      });
  };

  stopTracking = () => {
    clearInterval(this.timer);
    this.timer = null;
  };

  track = (satPositions) => {
    const tracks = satPositions.filter((s) => s.positions?.length);
    if (tracks.length === 0) return;

    const frames = Math.min(...tracks.map((s) => s.positions.length));
    const canvas = this.refTrack.current;
    canvas.width = MAP_WIDTH;
    canvas.height = MAP_HEIGHT;
    const context = canvas.getContext("2d");

    this.stopTracking();
    let i = 0;

    this.timer = setInterval(() => {
      if (i >= frames) {
        // Leave the final positions on screen
        this.stopTracking();
        return;
      }

      context.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

      const timestamp = tracks[0].positions[i].timestamp * 1000;
      context.font = "bold 14px sans-serif";
      context.fillStyle = "#F5EDFA";
      context.textAlign = "center";
      context.textBaseline = "top";
      context.fillText(formatTime(new Date(timestamp)), MAP_WIDTH / 2, 10);

      tracks.forEach(({ info, positions }) => this.drawSat(info, positions[i], context));

      i += STEP_SECONDS;
    }, FRAME_MS);
  };

  drawSat = (sat, pos, context) => {
    const { satlongitude, satlatitude } = pos;
    if (satlongitude == null || satlatitude == null) return;

    // "STARLINK-1234" -> "1234"
    const label = sat.satname.match(/\d+/g)?.join("") ?? sat.satname;
    const [x, y] = projection([satlongitude, satlatitude]);

    context.beginPath();
    context.arc(x, y, 8, 0, 2 * Math.PI);
    context.fillStyle = satColor(sat.satid);
    context.fill();

    context.font = "bold .8em sans-serif";
    context.textAlign = "center";
    context.textBaseline = "hanging";
    context.fillStyle = "#F5EDFA";
    context.fillText(label, x, y + 14);
  };

  render() {
    const { satInfo, selected, loadingSatellites, loadingSatPositions } = this.state;

    return (
      <Layout className="wrapper">
        <Header className="detailHeader">
          <DetailHeader />
        </Header>
        <Content className="detail-content">
          <Row className="detail-row">
            <Col span={6} className="leftSide">
              <div>
                <SatSetting onShow={this.showNearbySatellite} loading={loadingSatellites} />
                <SatelliteList
                  satInfo={satInfo}
                  selected={selected}
                  loading={loadingSatellites}
                  onSelectionChange={this.addOrRemove}
                  disableTrack={selected.length === 0 || loadingSatPositions}
                  trackOnclick={this.trackOnClick}
                />
              </div>
            </Col>
            <Col span={18}>
              <WorldMap refTrack={this.refTrack} loading={loadingSatPositions} />
            </Col>
          </Row>
        </Content>
        <Footer className="footer">
          <DetailFooter />
        </Footer>
      </Layout>
    );
  }
}

export default Detail;
