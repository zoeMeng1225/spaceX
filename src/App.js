import React from "react";
import { Layout } from "antd";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Main from "./pages/main";
import Detail from "./pages/detail";
import "./App.css";

const { Content } = Layout;

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Layout>
            <Content className="content">
              <Main />
            </Content>
          </Layout>
        </Route>
        <Route path="/detail" component={Detail} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
