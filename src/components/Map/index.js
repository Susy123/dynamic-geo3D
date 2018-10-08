import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import ReactEcharts from 'echarts-for-react';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import moment from 'moment';
import echarts from 'echarts';
import 'echarts-gl';
import china from './maps/china.json';
import './index.css';
import cityGeoInfo from './maps/cityGeoInfo.json';
import farmGeoInfo from './maps/farmGeoInfo.json';
import {get7DaysData, getTicks, getTicksLabel} from './dao.js';
// mock
import mockPowerArray from '../../mock/cityPower.json';
import mockPowerArrayFarm from '../../mock/farmPower.json';

var provinces = {"新疆": "xinjiang", "西藏": "xizang", "青海": "qinghai", "甘肃": "gansu", "宁夏回族自治区": "ningxia", "陕西": "shanxi1","山西":"shanxi",
 "四川": "sichuan", "云南": "yunnan", "贵州": "guizhou", "重庆市": "chongqing", "湖北": "hubei", "湖南": "hunan",
 "广西": "guangxi", "广东": "guangdong", "海南": "hainan", "江西": "jiangxi", "福建": "fujian", "澳门特别行政区": "aomen",
 "浙江": "zhejiang", "上海市": "shanghai", "江苏": "jiangsu", "山东": "shandong", "河北": "hebei", "河南": "henan",
 "北京市": "beijing", "天津市": "tianjin", "辽宁": "liaoning", "吉林": "jilin", "黑龙江": "heilongjiang", "内蒙古": "neimenggu",
 "安徽": "anhui", "香港":"xianggang", "China":"china", "World":"world"};
 var dataLength = 5;//96 * 7;//TODO modify for pro
 var startOfDayValue = moment().startOf('day').valueOf();
 var maxSliderValue = startOfDayValue + 7*24*60*60*1000;
 // 手动调整每个省份的地图显示距离，避免地图在echarts组件内显示不全
 var viewControlDistance = {"jiangsu":120,"guangdong":120,"shanxi":250,"shanxi1":250};
 var dataProvider = get7DaysData(mockPowerArray,cityGeoInfo);
 var dataProviderFarm = get7DaysData(mockPowerArrayFarm,farmGeoInfo);
//  [
//    [{"name":"海门","value":[121.15,31.89,"203.36"],"province":"江苏"},
//    {"name":"鄂尔多斯","value":[109.78,39.60,"103.36"],"province":"内蒙古"},
//    {"name":"招远","value":[120.38,37.35,"3.36"],"province":"山东"}],
//    [{"name":"海门","value":[121.15,31.89,"103.36"],"province":"江苏"},
//    {"name":"鄂尔多斯","value":[109.78,39.60,"203.36"],"province":"内蒙古"},
//    {"name":"招远","value":[120.38,37.35,"3.36"],"province":"山东"}]
//   ];
 echarts.registerMap('china', china);
 var loadedmaps = {};
 var timeInterval = 1000;//ms
 var timeSliderTicks = getTicks();
 var timeSliderTicksLabels = getTicksLabel();
export default class Map extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      map: 'china',
      notMerge: false,
      ticktack: 0,
      dataProvider: dataProvider,
      currentSliderValue: startOfDayValue,
      playButtonOn: true,
      timeSliderTicks:timeSliderTicks,
      timeSliderTicksLabels:timeSliderTicksLabels
    };
  }
  timeTicket = null;
  floatDirection = {left:'31%'};
  fetchNewDate = () => {
    var tick = (this.state.ticktack + 1)%dataLength;
    var nextSliderValue = this.state.currentSliderValue+15*60*1000;
    var nextSliderValueUse = nextSliderValue > maxSliderValue ? startOfDayValue : nextSliderValue;
    this.setState({
      ticktack: tick,
      currentSliderValue: nextSliderValueUse,
    });
    // if 当前时间是00：00：00
    let now = moment();
    if(now.isSame(moment().startOf('day')))
    {
      // 刷新 timeSlider的ticks 和ticksLabel
      this.setState({
        timeSliderTicks: getTicks(),
        timeSliderTicksLabels:getTicksLabel(),
      },()=>{
        ReactDOM.unmountComponentAtNode(this.refs["slider-ref"]);
        ReactDOM.render(<ReactBootstrapSlider
                          id="slider-id"
                          ticks={this.state.timeSliderTicks}
                          ticks_labels={this.state.timeSliderTicksLabels}
                          // ticks_snap_bounds={30}
                          tooltip= {'always'}
                          value={this.state.currentSliderValue}
                          slideStop={this.changeSliderValue}
                          formatter={function(val){
                            var selectTime = moment(val);
                            return selectTime.format('MM-DD HH:mm');
                          }}
                        />, this.refs["slider-ref"]); 
      });
      //TODO 并且重新获取下数据
    }
    
  };
  componentDidMount() {
    if (this.timeTicket) {
      clearInterval(this.timeTicket);
    }
    this.timeTicket = setInterval(this.fetchNewDate, timeInterval);
  };

  componentWillUnmount() {
    if (this.timeTicket) {
      clearInterval(this.timeTicket);
    }
  };
  getOption = () => ({
      visualMap: {
        min: 0,
        max: 300,
        splitNumber: 5,
        color: ['#FF7070', '#FFF2AD', '#90FFB7', '#50B9FF', '#0072ED'],
        showLabel:false,
        right:'7%',
        bottom:'4%'
      },
      geo3D: {
        map: this.state.map,
        viewControl:{
          alpha:60,
          distance: viewControlDistance[this.state.map] || 100,
        },
        roam: true,
        regionHeight:0.5,
      environment: 'auto',
        itemStyle: {
            borderColor: "#4096B9",
             borderWidth: 0,
             color: 'rgba(0,0,0,0.4)',//"#0A101C",
             opacity: 0.5,
        },
        label: {
            show: false,
            textStyle: {
                  color: '#f00', //地图初始化区域字体颜色
                  fontSize: 8,
                  opacity: 1,
                  backgroundColor: 'rgba(0,23,11,0)'
              },
          },
          emphasis: { //当鼠标放上去  地区区域是否显示名称
            label: {
              show: false
            },
            itemStyle: {
                color: 'rgba(0,0,0,0.5)'
            }
        },
          //shading: 'lambert',
          light: { //光照阴影
            main: {
                  color: '#fff', //光照颜色
                  intensity: 1.2, //光照强度
                  //shadowQuality: 'high', //阴影亮度
                  shadow: false, //是否显示阴影
                  alpha:55,
                 //  beta:10
 
              },
              ambient: {
                intensity: 0.3
            }
        }
    },
    series: [{
      name: '预测功率',
      type: "bar3D",
      animation: true,
      coordinateSystem: 'geo3D',
      barSize: 1, //柱子粗细
      shading: 'lambert',
      opacity: 1,
      bevelSize:0.3,
      label: {
        show: false,
        formatter: '{b}'
      },
      data: this.state.dataProvider[this.state.ticktack],
    }]
  });

  onChartClick = (param, echarts) => {
    console.log(param, echarts);
    this.select(param.data.province);
    this.setState({
      cnt: this.state.cnt + 1,
    })
  };
  select = (key) => {
    key = provinces[key];
    if (key) {
      if(key==='china'){
        this.props.switchPage(1);
        this.floatDirection = {left:'31%'};
        this.setState({
          dataProvider: dataProvider
        });
      } else {
        this.props.switchPage(2);
        this.floatDirection = {right:'31%'};
        this.setState({
          dataProvider: dataProviderFarm
        });
      }
      if(!loadedmaps[key] && (loadedmaps[key]=1))
          fetch('./maps/' + key + '.json')
          .then(res => res.json())
          .then(res => {echarts.registerMap(key, res)})
          .then(res => this.setState({ map: key,notMerge:true }));
      else
          this.setState({ map: key,notMerge:true });
    }
  };
  changeSliderValue  = e => {
    console.log("changeValue triggered",e.target.value);
    var clickValue = e.target.value;
    var tickValue = Math.floor((clickValue - startOfDayValue)/15);
    this.setState({
      currentSliderValue: clickValue,
      ticktack: tickValue % dataLength,
      playButtonOn: false
    });
    clearInterval(this.timeTicket);
  };
  clickPlay = (e) => {
    console.log("play button triggered",e.target);
    if (this.state.playButtonOn) {
      clearInterval(this.timeTicket);
    } else {
      this.timeTicket = setInterval(this.fetchNewDate, timeInterval);
    }
    this.setState({ playButtonOn: !this.state.playButtonOn });
  };

  render() {
    let onEvents = {
      'click': this.onChartClick
    };
    let playButtonClass = this.state.playButtonOn?'suspend':'play';
    return (
        <div className='map-container'style={this.floatDirection}>
          <ReactEcharts
            option={this.getOption()}
            onEvents={onEvents}
            notMerge={true}
            style={{width:'100%',height:'100%',position:'absolute'}}
          />
          <div style={{position:'absolute',top:22,left:22}}>
              <input type="button"
                className='back'
                onClick={()=>{this.select('China')}}
                value='返回'
                style={{float:'right', display: (this.state.map !== 'china')?'block':'none'}}
                />
          </div>
          <div id="time-container">
            <input type="button" className={`play-button ${playButtonClass}`} onClick={(e)=>this.clickPlay(e)} />
            <div id="slider-container" ref="slider-ref">
              <ReactBootstrapSlider
                id="slider-id"
                ticks={this.state.timeSliderTicks}
                ticks_labels={this.state.timeSliderTicksLabels}
                // ticks_snap_bounds={30}
                tooltip= {'always'}
                value={this.state.currentSliderValue}
                slideStop={this.changeSliderValue}
                formatter={function(val){
                  var selectTime = moment(val);
                  return selectTime.format('MM-DD HH:mm');
                }}
              />
            </div>
          </div>
        </div>
    );
  }
}
