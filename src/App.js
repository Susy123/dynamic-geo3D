import React, { Component } from 'react';
import './App.css';
import Map from './components/Map';
import Banner from './components/Banner';
import LineChart from './components/LineChart';
import Title from './components/Title';
// mock
// import bannerData from './mock/electricNet.json';

var bannerData = {
  total: '0',
  list: [
        {name: '西北电网',electric: 0},
        {name: '华北电网',electric: 0},
        {name: '东北电网',electric: 0},
        {name: '华中电网',electric: 0},
        {name: '华东电网',electric: 0},
        {name: '南方电网',electric: 0}
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
  updateBannerData = (bannerData) => {
    this.setState({
      banner: bannerData,
    });
  };

  render() {
    let {pageIndex} = this.state;
    return (
      <div className="App">
        <Map
          switchPage={this.switchPage}
          selectFarm={this.selectFarm}
          updateBannerData={this.updateBannerData}/>
        <Banner
          propsData={this.state.banner}
          className={(pageIndex === 1)?'':'hidden'}
        />
        <LineChart propsData={this.state.line}
          className={(pageIndex === 2)?'':'hidden'}/>
        <Title className={(pageIndex === 1)?'':'hidden'}/>
      </div>
    );
  }
}

export default App;
