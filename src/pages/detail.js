import React, {Component} from 'react';
import {Layout, Row, Col} from "antd";
import Satsetting from "./satsetting";
import SatelliteList from "./satelliteList";
import DetailHeader from "./header";
import DetailFooter from "./footer";
import { NEARBY_SATELLITE, STARLINK_CATEGORY, SAT_API_KEY, SATELLITE_POSITION_URL} from '../constance';
import Axios from 'axios';
import WorldMap from './worldMap';
import * as d3Scale from 'd3-scale';
import { select as d3Select } from 'd3-selection';
import { geoKavrayskiy7 } from 'd3-geo-projection';


import "./style.css";
import { schemeCategory10} from 'd3-scale-chromatic';
import { timeFormat as d3TimeFormat } from 'd3-time-format';


const {Header, Content,Footer} = Layout;

const width = 1200;
const height = 700;

class Detail extends Component {
  constructor(){
    super();
    this.state = {
      loadingSatellites: false,
      loadingSatPositions: false,
      setting: undefined,
      selected: [],
    }
    this.refTrack = React.createRef();
  }

  trackOnClick = (duration) => {
    const { observerLat, observerLong, observerAlt } = this.state.setting;
    const endTime = duration * 60;
    this.setState({ 
      loadingSatPositions: true,
      duration: duration
    });
    const urls = this.state.selected.map( sat => {
        const { satid } = sat;
        const url = `${SATELLITE_POSITION_URL}/${satid}/${observerLat}/${observerLong}/${observerAlt}/${endTime}/&apiKey=${SAT_API_KEY}`;
        return Axios.get(url);
    });

    Axios.all(urls)
      .then(
        Axios.spread((...args) => {
            return args.map(item => item.data);
        })
      )
      .then( res => {
          this.setState({
              satPositions: res,
              loadingSatPositions: false,
          });
          this.track();
      })
      .catch( e => {
          console.log('err in fetch satellite position -> ', e.message);
      })

  }

  addOrRemove = (item, status) => {
    let { selected: list } = this.state;
    // let list = this.state.selected;
    const found = list.some(entry => entry.satid === item.satid);

    if(status && !found){
        list.push(item)
    }

    if(!status && found){
        list = list.filter( entry => {
            return entry.satid !== item.satid;
        });
    }
    
    console.log(list);
    this.setState({
      selected: list
    })
  }

  showNearbySatellite = (setting) => {
    this.setState({
      setting: setting,
    })
    this.fetchSatellite(setting);
  }

  fetchSatellite = (setting) => {
    const {observerLat, observerLong, observerAlt, radius} = setting;
    const url = `${NEARBY_SATELLITE}/${observerLat}/${observerLong}/${observerAlt}/${radius}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;
    
    this.setState({
      loadingSatellites: true,
    })
    Axios.get(url)
        .then(response => {
            this.setState({
                satInfo: response.data,
                loadingSatellites: false,
                selected: [],
            })
        })
        .catch(error => {
            console.log('err in fetch satellite -> ', error);
            this.setState({
              loadingSatellites: false,
            })
        })
  }

  track = () => {
    const data = this.state.satPositions;

    const len = data[0].positions.length;
    const startTime = this.state.duration;

    const canvas2 = d3Select(this.refTrack.current)
          .attr("width", width)
          .attr("height", height);
    const context2 = canvas2.node().getContext("2d");

    let now = new Date();
    let i = startTime;

    let timer = setInterval( () => {
        let timePassed = Date.now() - now;
        if(i === startTime) {
            now.setSeconds(now.getSeconds() + startTime * 60)
        }

        let time = new Date(now.getTime() + 60 * timePassed);
        context2.clearRect(0, 0, width, height);
        context2.font = "bold 14px sans-serif";
        context2.fillStyle = "#F5EDFA";
        context2.textAlign = "center";
        context2.fillText(d3TimeFormat(time), width / 2, 10);

        if(i >= len) {
            clearInterval(timer);
            this.setState({isDrawing: false});
            const oHint = document.getElementsByClassName('hint')[0];
            oHint.innerHTML = ''
            return;
        }
        data.forEach( sat => {
            const { info, positions } = sat;
            this.drawSat(info, positions[i], context2)
        });

        i += 60;
    }, 1000)
}

drawSat = (sat, pos, context2) => {
    const { satlongitude, satlatitude } = pos;
    if(!satlongitude || !satlatitude ) return;
    const { satname } = sat;
    const nameWithNumber = satname.match(/\d+/g).join('');

    const projection = geoKavrayskiy7()
          .scale(170)
          .translate([width / 2, height / 2])
          .precision(.1);

    const xy = projection([satlongitude, satlatitude]);
    context2.fillStyle = d3Scale.scaleOrdinal(schemeCategory10)(nameWithNumber);
    context2.beginPath();
    context2.arc(xy[0], xy[1], 8, 0, 2*Math.PI);
    context2.fillStyle = "#F5EDFA";
    context2.fill();
    context2.font = "bold .8em sans-serif";
    context2.textAlign = "center";
    context2.textBaseline = "hanging";
    context2.fillStyle = "#F5EDFA";
    context2.fillText(nameWithNumber, xy[0], xy[1]+14);
}

  render() {
    return(
      <Layout className = "wrapper">
        <Header className = "detailHeader">  
          <DetailHeader/>
        </Header>
        <Content className = "detail-content">
          <Row className = "detail-row">
            <Col span={6} className = "leftSide">
              <div>
                <Satsetting onShow = {this.showNearbySatellite}/>
                <SatelliteList 
                  satInfo = {this.state.satInfo} 
                  loading ={this.state.loadingSatellites}
                  onSelectionChange={this.addOrRemove}
                  disableTrack={this.state.selected.length === 0}
                  trackOnclick={this.trackOnClick}
                  />
              </div>
            </Col>
            <Col span={18}>
              <div>
                <WorldMap
                    refTrack={this.refTrack}
                    loading={this.state.loadingSatPositions}
                />
              </div>
            </Col>
          </Row>
        </Content>
        <Footer className = "footer">
          <DetailFooter/>
        </Footer>

      </Layout>
    ) 
  }
}


export default Detail;