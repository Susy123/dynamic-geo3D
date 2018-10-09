import React, { Component } from 'react';
import './App.css';
import Map from './components/Map';
import Banner from './components/Banner';
import LineChart from './components/LineChart';
// mock
// import bannerData from './mock/electricNet.json';

const bannerData = {
  total: '42565',
  list: [
        {name: '西北电网',electric: 1859239.2},
        {name: '华北电网',electric: 1573202.4},
        {name: '东北电网',electric: 1501693.2},
        {name: '华中电网',electric: 1001128.8},
        {name: '华东电网',electric: 715092},
        {name: '南方电网',electric: 500564.4},
        // {name: '华西电网2',electric: 34343},
        // {name: '华北电网2',electric: 23232},
        // {name: '华东电网3',electric: 12121},
        // {name: '华南电网3',electric: 11111},
        // {name: '华西电网3',electric: 9999},
        // {name: '华北电网3',electric: 8888},
        // {name: '华东电网4',electric: 7777}
  ]
}
var lineData = {
  adress: '',
  detailAdress: '',
  capacity: '',
  intradayElectric: '',
  powerData: [],
  windspeedData: [],
  timeData: []
}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      banner: bannerData,
      line: lineData,
      pageIndex: 1,
    };
  }
  switchPage = (pageIndex) => {
    this.setState({
      pageIndex
    });
  };
  selectFarm = (lineData) => {
    this.setState({
      line: lineData,
    });
  };

  render() {
    let {pageIndex} = this.state;
    return (
      <div className="App">
        <Map switchPage={this.switchPage} selectFarm={this.selectFarm}/>
        <Banner
          propsData={this.state.banner}
          className={(pageIndex === 1)?'':'hidden'}
        />
        <LineChart propsData={this.state.line}
          className={(pageIndex === 2)?'':'hidden'}/>
      </div>
    );
  }
}

export default App;
