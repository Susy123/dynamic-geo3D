import React, { Component } from 'react';
import './App.css';
import Map from './components/Map';
import Banner from './components/Banner';
import LineChart from './components/LineChart';

const bannerData = {
  total: '123324134',
  list: [
        {name: '华东电网',electic: 99999},
        {name: '华南电网',electic: 88888},
        {name: '华西电网',electic: 77777},
        {name: '华北电网',electic: 66666},
        {name: '华东电网2',electic: 55555},
        {name: '华南电网2',electic: 45454},
        {name: '华西电网2',electic: 34343},
        {name: '华北电网2',electic: 23232},
        {name: '华东电网3',electic: 12121},
        {name: '华南电网3',electic: 11111},
        {name: '华西电网3',electic: 9999},
        {name: '华北电网3',electic: 8888},
        {name: '华东电网4',electic: 7777}
  ]
}
const lineData = {
  adress: '江苏风场',
  detailAdress: '江苏省无锡市江苏省无锡市',
  capacity: '999999',
  intradayElectric: '999',
  powerData: [
    133,200,180,340,308,249,260,273,288,103,299,295,191,187,183,279,275,271,167,164,161,258,255,152
    ],
  windspeedData: [
    133,200,180,340,308,249,260,273,288,103,299,295,191,187,183,279,275,271,167,164,161,258,255,152
    ],
  timeData: [
    '2009/6/12 2:00', '2009/6/12 3:00', '2009/6/12 4:00', '2009/6/12 5:00', '2009/6/12 6:00',
    '2009/6/12 7:00',  '2009/6/12 8:00', '2009/6/12 9:00', '2009/6/12 10:00', '2009/6/12 11:00',
    '2009/6/12 12:00', '2009/6/12 13:00', '2009/6/12 14:00', '2009/6/12 15:00', '2009/6/12 16:00',
    '2009/6/12 17:00', '2009/6/12 18:00', '2009/6/12 19:00', '2009/6/12 20:00', '2009/6/12 21:00',
    '2009/6/12 22:00', '2009/6/12 23:00', '2009/6/12 00:00', '2009/6/12 1:00']
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

  render() {
    let {pageIndex} = this.state;
    return (
      <div className="App">
        <Map switchPage={this.switchPage}/>
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
