import React, { Component } from "react";
import { List, Avatar, Button, Checkbox, Spin, InputNumber } from "antd";
import satelliteIcon from "../assets/Satellite.svg";
import { MAX_TRACK_SECONDS } from "../constants";

const MAX_MINUTES = MAX_TRACK_SECONDS / 60;

class SatelliteList extends Component {
  state = { duration: MAX_MINUTES };

  onChange = (item) => (e) => this.props.onSelectionChange(item, e.target.checked);

  onChangeDuration = (value) => this.setState({ duration: value ?? MAX_MINUTES });

  render() {
    const { satInfo, selected, loading, disableTrack, trackOnclick } = this.props;
    const satList = satInfo?.above ?? [];
    const selectedIds = new Set(selected.map((s) => s.satid));

    return (
      <div className="sat-list-box">
        <Button
          className="sat-list-btn"
          size="large"
          disabled={disableTrack}
          onClick={() => trackOnclick(this.state.duration)}
        >
          Track on the map
        </Button>

        <div className="list-item duration">
          <label>Track Duration (min): </label>
          <InputNumber
            min={1}
            max={MAX_MINUTES}
            defaultValue={MAX_MINUTES}
            style={{ margin: "0 2px" }}
            onChange={this.onChangeDuration}
          />
        </div>

        {loading ? (
          <Spin tip="Loading satellites..." />
        ) : (
          <List
            className="sat-list"
            itemLayout="horizontal"
            size="small"
            header={satInfo ? `${satList.length} Starlink satellite${satList.length === 1 ? "" : "s"} in range` : null}
            dataSource={satList}
            renderItem={(item) => (
              <List.Item
                key={item.satid}
                actions={[
                  <Checkbox
                    key="select"
                    checked={selectedIds.has(item.satid)}
                    onChange={this.onChange(item)}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar size={30} src={satelliteIcon} />}
                  title={<p>{item.satname}</p>}
                  description={`Launch Date: ${item.launchDate}`}
                />
              </List.Item>
            )}
          />
        )}
      </div>
    );
  }
}

export default SatelliteList;
