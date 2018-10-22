import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import ReactEcharts from 'echarts-for-react';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import moment from 'moment';
import echarts from 'echarts';
import 'echarts-gl';
import china from './maps/china.json';
import './index.css';
// import cityGeoInfo from './maps/cityGeoInfo_pro.json';
import farmGeoInfo from './maps/farmGeoInfo_pro.json';
import Utils from './dao';
import {get7DaysData, getTicks, getTicksLabel, getMaxPower,
  getBannerData, getFarmData, getApproItem, getPowerLabelItem} from './dao.js';
// mock
// import mockPowerArray from '../../mock/cityPower_new.json';
// import mockPowerArrayFarm from '../../mock/farmPower_new.json';
// import mockElectric from '../../mock/electricNet_new.json';

var cityGeoInfo = farmGeoInfo;
var provinces = {"新疆": "xinjiang", "新疆维吾尔自治区": "xinjiang", "西藏": "xizang", "西藏自治区": "xizang", "青海": "qinghai", "甘肃": "gansu", "宁夏回族自治区": "ningxia", "陕西": "shanxi1","山西":"shanxi",
 "四川": "sichuan", "云南": "yunnan", "贵州": "guizhou", "重庆": "chongqing", "湖北": "hubei", "湖南": "hunan",
 "广西": "guangxi", "广西壮族自治区": "guangxi", "广东": "guangdong", "海南": "hainan", "江西": "jiangxi", "福建": "fujian", "澳门特别行政区": "aomen",
 "浙江": "zhejiang", "上海": "shanghai", "江苏": "jiangsu", "山东": "shandong", "河北": "hebei", "河南": "henan",
 "北京": "beijing", "天津": "tianjin", "辽宁": "liaoning", "吉林": "jilin", "黑龙江": "heilongjiang", "内蒙古": "neimenggu","内蒙古自治区":"neimenggu",
 "安徽": "anhui", "香港":"xianggang", "China":"china", "World":"world"};
var cityRootNum = 1/3;// 市级功率开方数据平衡
var farmRootNum = 1;// 场站功率开方数据平衡
var dataLength = 24 * 7;//96 * 7;// modify for pro
var timeSpace = 60 * 60 * 1000;//间隔为1小时
var startOfDayValue = moment().startOf('day').valueOf();
var maxSliderValue = startOfDayValue + 7*24*60*60*1000;
// 手动调整每个省份的地图显示距离，避免地图在echarts组件内显示不全
var viewControlDistance = {"china":70,"jiangsu":80,"guangdong":80,"shanxi":100,"shanxi1":100};
var mockElectric = {};
var mockPowerArray = [];
var mockPowerArrayFarm = [];
var dataProvider=[] , dataProviderMax, dataProviderFarm=[], dataProviderFarmMax;
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
 var timeInterval = 500;//ms 定时器
 var timeSliderTicks = getTicks();
 var timeSliderTicksLabels = getTicksLabel();
export default class Map extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      map: 'china',
      notMerge: false,
      ticktack: 0,
      dataProvider: [],
      dataProviderMax: [],
      powerNum: cityRootNum,
      currentSliderValue: startOfDayValue,
      playButtonOn: true,
      timeSliderTicks:timeSliderTicks,
      timeSliderTicksLabels:timeSliderTicksLabels,
      loading: true
    };
  }
  timeTicket = null;// 播放定时器
  newDataTicket = null; // 更新数据源定时器
  floatDirection = {left:'0',right:'0'};
  updateData = () => {
    var tick = (this.state.ticktack + 1)%dataLength;
    var nextSliderValue = this.state.currentSliderValue+timeSpace;
    var nextSliderValueUse = nextSliderValue > maxSliderValue ? startOfDayValue : nextSliderValue;
    this.setState({
      ticktack: tick,
      currentSliderValue: nextSliderValueUse,
    });
    var bannerData = getBannerData(tick, mockElectric);
    this.props.updateBannerData(bannerData);
  };
  fetchNewData = () => {
    // 读秒定时器，每小时零5分请求数据更新数据源，零点更新slider
    // if 当前时间是00：00：00
    let now = moment();
    if(now.hour()===0&&now.minute()===0&&now.second()===1)
    {
      startOfDayValue = moment().startOf('day').valueOf();
      maxSliderValue = startOfDayValue + 7*24*60*60*1000;
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
      
    }
    if(now.minute()===5&&now.second()===1){
      // 并且重新获取下数据
      fetch('/stateforecast/power-generation')
          .then(res => res.json())
          .then(res => mockElectric = res);
      fetch('/stateforecast/forecast/farms')
          .then(res => res.json())
          .then(res => {
            mockPowerArray = res;
            dataProvider = get7DaysData(mockPowerArray,cityGeoInfo,cityRootNum);
            dataProviderMax = getMaxPower(mockPowerArray);
            this.setState({
              loading:false,
              dataProvider,
              dataProviderMax,
            });
          });
      if(this.provinceNow){
        // 处理数据
        fetch(`/stateforecast/forecast?${this.provinceNow}`)
          .then(res => res.json())
          .then(res => {
            mockPowerArrayFarm = res;
            dataProviderFarm = get7DaysData(mockPowerArrayFarm,farmGeoInfo,farmRootNum);
            dataProviderFarmMax = getMaxPower(mockPowerArrayFarm);
            this.selectFarm(dataProviderFarm[0][0].name);
            this.setState({
              loading:false,
              dataProvider: dataProviderFarm,
              dataProviderMax: dataProviderFarmMax,
              powerNum:farmRootNum
            });
          });
      }
    }
  };
  componentDidMount() {
    // 准备数据
    fetch('/stateforecast/power-generation')
          .then(res => res.json())
          .then(res => mockElectric = res);
    fetch('/stateforecast/forecast/farms')
          .then(res => res.json())
          .then(res => {
            mockPowerArray = res;
            dataProvider = get7DaysData(mockPowerArray,cityGeoInfo,cityRootNum);
            dataProviderMax = getMaxPower(mockPowerArray);
            this.setState({
              loading:false,
              dataProvider,
              dataProviderMax,
            });
          });


    if (this.timeTicket) {
      clearInterval(this.timeTicket);
    }
    clearInterval(this.newDataTicket);
    this.timeTicket = setInterval(this.updateData, timeInterval);
    this.newDataTicket = setInterval(this.fetchNewData, 1000);
  };

  componentWillUnmount() {
    if (this.timeTicket) {
      clearInterval(this.timeTicket);
    }
    clearInterval(this.newDataTicket);
  };
  getOption = () => {
    /** 均分maxPowerLabel,即均分真实power值 **/ 
    // var maxPowerLabel = this.state.dataProviderMax[this.state.ticktack];
    // // var maxValue = Math.pow(maxPowerLabel,this.state.powerNum);

    // var powerLableItem = getApproItem(maxPowerLabel);
    // // var valueItem = Math.ceil(maxValue/5);
    // var valueItem = [Math.pow(powerLableItem,this.state.powerNum),
    //   Math.pow(powerLableItem*2,this.state.powerNum),
    //   Math.pow(powerLableItem*3,this.state.powerNum),
    //   Math.pow(powerLableItem*4,this.state.powerNum),
    //   Math.pow(powerLableItem*5,this.state.powerNum)]
    // var thousandPointsFmt = Utils.thousandPointsFmt;
    // // 连续型数据平均分段 模式不会默认为 series.data 的 dataMin 和 dataMax，需自行定义
    // // 另最大最小差距过大，故对其分别进行2开方和3开方进行可视化矫正
    // var pieces = [
    //   {min:valueItem[3],max:valueItem[4],label:`${thousandPointsFmt(powerLableItem*5)}`},
    //   {min:valueItem[2],max:valueItem[3],label:`${thousandPointsFmt(powerLableItem*4)}`},
    //   {min:valueItem[1],max:valueItem[2],label:`${thousandPointsFmt(powerLableItem*3)}`},
    //   {min:valueItem[0],max:valueItem[1],label:`${thousandPointsFmt(powerLableItem*2)}`},
    //   {min:0,max:valueItem[0],label:`功率(MW)`},
    // ];
    /** 均分maxPowerLabel,即均分真实power值 **/ 

    /** 均分开放值 **/
    var maxPowerLabel = this.state.dataProviderMax[this.state.ticktack];
    var maxValue = Math.pow(maxPowerLabel,this.state.powerNum);

    // var powerLableItem = getApproItem(maxPowerLabel);
    var valueItem = getApproItem(maxValue);
    var powerLableItem = getPowerLabelItem(valueItem,this.state.powerNum);
    // 连续型数据平均分段 模式不会默认为 series.data 的 dataMin 和 dataMax，需自行定义
    // 另最大最小差距过大，故对其分别进行2开方和3开方进行可视化矫正
    var pieces = [
      {min:valueItem*4,max:valueItem*5,label:`${powerLableItem[4]}`},
      {min:valueItem*3,max:valueItem*4,label:`${powerLableItem[3]}`},
      {min:valueItem*2,max:valueItem*3,label:`${powerLableItem[2]}`},
      {min:valueItem,max:valueItem*2,label:`${powerLableItem[1]}`},
      {min:0,max:valueItem,label:`功率(MW)`},
    ];
    return {
      visualMap: {
        itemSymbol:'rect',
        itemWidth:'50px',
        itemHeight:'5px',
        itemGap:1,
        orient:'horizontal',
        splitNumber: 5,
        pieces: pieces,
        color: ['#d73027','#DC716C', '#E1C8B3', '#90FFB7', '#5BA8A8', '#0072ED'],
        // color: ['#d73027','#fdae61','#ffffbf','#4575b4'],
        // color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
        showLabel:false,
        textStyle:{
          color:'white'
        },
        // text:['MW'],//legend顶部text
        align:'bottom',
        bottom:this.state.map==='china'?'35px':'80px',
        right:'3%'
      },
      geo3D: {
        map: this.state.map,
        viewControl:{
          alpha:45,
          // beta:-40,
          distance: viewControlDistance[this.state.map] || 100,
        },
        left:100,
        top:-100,
        roam: true,
        regionHeight:0.5,
        boxHeight:15,//可以控制柱子高度的空间
      environment: 'auto',
        itemStyle: {
            borderColor: '#ffffff',//'#1A1A1A',
             borderWidth: 0,
             color: 'rgba(56,54,54,0.6)',//'#383636',//'rgba(0,0,0,0.4)',//"#0A101C",
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
                color: 'rgba(56,54,54,0.4)'//'#383636'//'rgba(56,54,54,0.5)'
            }
        },
        postEffect: {
          enable: true,
          SSAO: {
              enable: true,
              radius: 2,
              intensity: 1.5
          }
      },
    //   light: {
    //     main: {
    //         intensity: 1,
    //         shadow: false,
    //         shadowQuality: 'high'
    //     },
    //     ambient: {
    //         intensity: 0.
    //     },
    //     ambientCubemap: {
    //         texture: '/maps/data-1491896094618-H1DmP-5px.hdr',
    //         exposure: 1,
    //         diffuseIntensity: 0.5
    //     }
    // }
          //shading: 'lambert',
          light: { //光照阴影
            main: {
                  color: '#fff', //光照颜色
                  intensity: 1.2, //光照强度
                  //shadowQuality: 'high', //阴影亮度
                  shadow: false, //是否显示阴影
                  alpha:55,
                  beta:0
 
              },
              ambient: {
                intensity: 0.5
            }
        }
    },
    series: [{
      name: '预测功率',
      type: "bar3D",
      animation: true,
      coordinateSystem: 'geo3D',
      barSize: 0.5, //柱子粗细
      minHeight: 0.5,
      shading: 'realistic',
      // shading: 'lambert',
      // itemStyle:{
      //   opacity: 0.8,
      // },
      bevelSize:0.3,
      label: {
        show: false,
        formatter: (param) => `${param.name}: ${(Math.pow(param.value[2],1/this.state.powerNum).toFixed(0))} MW`//{console.log(param)}
      },
      data: this.state.dataProvider[this.state.ticktack],
    }]
  }
};

  onChartClick = (param) => {
    console.log(param);
    if(this.state.map === 'china'){
      this.select(param.data.province);
    } else {
      this.selectFarm(param.name);
    }
    
    // this.setState({
    //   cnt: this.state.cnt + 1,
    // })
  };
  selectFarm = (farmName) =>{
    var farmData = getFarmData(farmName,mockPowerArrayFarm,farmGeoInfo);
    this.props.selectFarm(farmData);
  };
  select = (province) => {
    var key = provinces[province];
    if (key) {
      if(key==='china'){
        this.props.switchPage(1);
        this.provinceNow = null;
        this.floatDirection = {left:'0',right:'0'};
        this.setState({
          dataProvider: dataProvider,
          dataProviderMax,
          powerNum:cityRootNum
        });
      } else {
        this.props.switchPage(2);
        this.floatDirection = {right:'30%'};
        this.setState({loading:true});
        this.provinceNow = province;
        // 处理数据
        fetch(`/stateforecast/forecast/farms?region=${province}`)
          .then(res => res.json())
          .then(res => {
            mockPowerArrayFarm = res;
            dataProviderFarm = get7DaysData(mockPowerArrayFarm,farmGeoInfo,farmRootNum);
            dataProviderFarmMax = getMaxPower(mockPowerArrayFarm);
            this.selectFarm(dataProviderFarm[0][0].name);
            this.setState({
              loading:false,
              dataProvider: dataProviderFarm,
              dataProviderMax: dataProviderFarmMax,
              powerNum:farmRootNum
            });
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
    // console.log("changeValue triggered",e.target.value);
    var clickValue = e.target.value;
    var tickValue = Math.floor((clickValue - startOfDayValue)/timeSpace);
    this.setState({
      currentSliderValue: clickValue,
      ticktack: tickValue % dataLength,
      playButtonOn: false
    });
    clearInterval(this.timeTicket);
    var bannerData = getBannerData(tickValue % dataLength, mockElectric);
    this.props.updateBannerData(bannerData);
  };
  clickPlay = (e) => {
    // console.log("play button triggered",e.target);
    if (this.state.playButtonOn) {
      clearInterval(this.timeTicket);
    } else {
      this.timeTicket = setInterval(this.updateData, timeInterval);
    }
    this.setState({ playButtonOn: !this.state.playButtonOn });
  };

  render() {
    let onEvents = {
      'click': this.onChartClick
    };
    let playButtonClass = this.state.playButtonOn?'suspend':'play';
    let isFirstPageClass = this.state.map==='china'?'first-page':'second-page';
    /** 求图例的label显示 **/
    var maxPowerLabel = this.state.dataProviderMax[this.state.ticktack];
    var maxValue = Math.pow(maxPowerLabel,this.state.powerNum);
    var valueItem = getApproItem(maxValue);
    var powerLableItem = getPowerLabelItem(valueItem,1/this.state.powerNum);
    // if(this.state.loading){
    //   return null;
    // } else 
    // {
      return (
        <div className={`map-container ${isFirstPageClass}`} style={this.floatDirection}>
          <ReactEcharts
            option={this.getOption()}
            onEvents={onEvents}
            notMerge={true}
            style={{width:'100%',height:'100%',position:'absolute'}}
          />
          <div style={{position:'absolute',top:22,left:22}}>
              {/* <label className='map-label'>全国风电出力态势感知</label> */}
              <input type="button"
                className='back'
                onClick={()=>{this.select('China')}}
                value='返回'
                style={{display: (this.state.map !== 'china')?'block':'none'}}
                />
          </div>
          <div className={`legend-label ${isFirstPageClass}`}>
            <label>MW</label>
            {powerLableItem.map((item,index)=>(index>0?<label>{item}</label>:''))}
          </div>
          <div id="time-container" className={isFirstPageClass}>
            <input type="button" className={`play-button ${playButtonClass} ${isFirstPageClass}`} onClick={(e)=>this.clickPlay(e)} />
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
    )
  // }
  }
}
