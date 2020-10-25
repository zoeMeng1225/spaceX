import React,{Component} from 'react';
import {Layout} from "antd";
import Main from "./pages/main";
import Detail from "./pages/detail";
import { BrowserRouter, Route, Router, Switch} from "react-router-dom";
import "./App.css";

const {Content} = Layout;

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <Route exact path="/">
          <Layout>
            <Content className = "content">
              <Main/>
            </Content>
          </Layout>
        </Route>
        <Route path = "/detail" component = {Detail}></Route>
      </BrowserRouter>
    );
  }
}

export default App;
