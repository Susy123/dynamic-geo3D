import React, { PureComponent } from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';

import ReactEcharts from 'echarts-for-react';
import blueIcon from '../assets/images/blue_radio.png';
import greenIcon from '../assets/images/green_radio.png';
import radioRectangleBlue from '../assets/images/radioRectangleBlue.png';
import radioRectangleGreen from '../assets/images/radioRectangleGreen.png';
import "./index.css"

export default class LineChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

    componentDidMount() {
    }
    componentWillReceiveProps (nextProps) {
        console.log(nextProps)
        // this.draw(nextProps.data)
    }
    getPowerOption = (dataArray, timeArray) => {
        return {
          title: {
            text: '功率详情',
            textStyle: {
                color:'#EDF9FF',
                fontSize:20,
                fontWeight: 'normal',
                fontFamily: 'monospace'
            }
          },
          tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                z:9999,
                lineStyle: {
                    color: '#FFFFFF',
                    width: 2,
                    type: 'solid'
                }
            }
          },
          legend: {
            show: true,
            right: 'right',
            z: 2,
            textStyle: {
                color: '#edf9ffcc',
                fontSize:16,
                padding:[0, 0, 0, 10]
            },
            data:[{
                name:'预测功率',
                icon:`image://${radioRectangleBlue}`//格式为'image://+icon文件地址'，其中image::后的//不能省略
            }]
          },
          color:['#00CCFF'], // 线条的颜色
          toolbox: {
            feature: {
            //   saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              boundaryGap : false,
              axisLabel : { //y轴文字颜色
                textStyle: {
                    color: '#edf9ffcc'
                }
              },
              axisTick: { // 刻度
                  show: false,
                  lineStyle: {
                      width:2,
                      type: 'solid',
                      
                  }
              },
              axisLine:{ // x轴横线样式
                  show:true,
                  lineStyle:{
                      color: '#edf9ff80',
                      type: 'solid'
                  }
              },
              data : timeArray
            }
          ],
          yAxis : [
            {
                type : 'value',
                name:'MW',
                nameLocation: 'end',
                axisLabel : { //y轴文字颜色
                    textStyle: {
                        color: '#cbccd1'
                    }
                },
                nameTextStyle: {
                    color: '#cbccd1',
                    verticalAlign: 'middle',
                    align: 'center',
                    padding: [0, 45, 0, 0]
                },
                axisLine:{ // 线的颜色
                    show:false,
                    onZero:false
                },
                axisTick:{
                    show:false
                },
                splitLine:{ // 延伸出去的线的颜色样式
                    show:true,
                    lineStyle:{
                        type: 'dashed',
                        width: 1,
                        color: '#edf9ff80'
                    }
                }
                
            }
          ],
          series : [
            {
              name:'预测功率',
              type:'line',
              stack: '总量',
              zlevel:0,
              z:0,
              symbol: `image://${blueIcon}`,
              symbolSize: 20,
              showSymbol: false,
                itemStyle:{
                    normal:{
                        lineStyle:{
                            width:3,
                            type:'solid'  //'dotted'虚线 'solid'实线
                        }
                    }
                },
                areaStyle: {normal: {
                    color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#00CCFF'},
                                {offset: 1, color: 'transparent'}
                            ]
                    )
                }},
              data:dataArray
            }
          ]
        };
    }
    getWindSpeedOption = (dataArray, timeArray) => {
        return {
          title: {
            text: '风速详情',
            textStyle: {
                color:'#EDF9FF',
                fontSize:20,
                fontWeight: 'normal',
                fontFamily: 'monospace'
            }
          },
          tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                z:9999,
                lineStyle: {
                    color: '#FFFFFF',
                    width: 2,
                    type: 'solid'
                }
            }
          },
          legend: {
            show: true,
            right: 'right',
            z: 2,
            textStyle: {
                color: '#edf9ffcc',
                fontSize:16,
                padding:[0, 0, 0, 10]
            },
            data:[{
                name:'风速',
                icon:`image://${radioRectangleGreen}`//格式为'image://+icon文件地址'，其中image::后的//不能省略
            }]
          },
          color:['#65ECA7'], // 线条的颜色
          toolbox: {
            feature: {
            //   saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              boundaryGap : false,
              axisLabel : { //y轴文字颜色
                textStyle: {
                    color: '#edf9ffcc'
                }
              },
              axisTick: { // 刻度
                  show: false,
                  lineStyle: {
                      width:2,
                      type: 'solid',
                      
                  }
              },
              axisLine:{ // x轴横线样式
                  show:true,
                  lineStyle:{
                      color: '#edf9ff80',
                      type: 'solid'
                  }
              },
              data : timeArray
            }
          ],
          yAxis : [
            {
                type : 'value',
                name:'m/s',
                nameLocation: 'end',
                axisLabel : { //y轴文字颜色
                    textStyle: {
                        color: '#cbccd1'
                    }
                },
                nameTextStyle: {
                    color: '#cbccd1',
                    verticalAlign: 'middle',
                    align: 'center',
                    padding: [0, 45, 0, 0]
                },
                axisLine:{ // 线的颜色
                    show:false,
                    onZero:false
                },
                axisTick:{
                    show:false
                },
                splitLine:{ // 延伸出去的线的颜色样式
                    show:true,
                    lineStyle:{
                        type: 'dashed',
                        width: 1,
                        color: '#edf9ff80'
                    }
                }
                
            }
          ],
          series : [
            {
              name:'风速',
              type:'line',
              stack: '总量',
              zlevel:0,
              z:0,
              symbol: `image://${greenIcon}`,
              symbolSize: 20,
              showSymbol: false,
                itemStyle:{
                    normal:{
                        lineStyle:{
                            width:3,
                            type:'solid'  //'dotted'虚线 'solid'实线
                        }
                    }
                },
                areaStyle: {normal: {
                    color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#65ECA7'},
                                {offset: 1, color: 'transparent'}
                            ]
                    )
                }},
              data: dataArray
            }
          ]
        };
    }
    add_comma_toThousands(count) {    
      var num = (count || 0).toString();    
      var result = '';    
      while (num.length > 3) {        
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);    
      }    
      if (num) { 
        result = num + result; 
      }    
      return result;
    }
  render() {
      const capacity = this.add_comma_toThousands(this.props.propsData.capacity);
      const intradayElectric = this.add_comma_toThousands(this.props.propsData.intradayElectric);
    return (
        <div className={`lineContainer ${this.props.className}`}>
            <div className="header">
                <p className="name">{this.props.propsData.adress}</p>
                <p className="adress">地址：{this.props.propsData.detailAdress}</p>
                <div className="descBox">
                    <p className="capacity">容量：{capacity} WM</p>
                    <p className="electicNum">当日发电量：{intradayElectric} KW</p>
                </div>
            </div>
            <div className="content">
                <ReactEcharts
                    option={this.getPowerOption(this.props.propsData.powerData, this.props.propsData.timeData)}
                    style={{height: '350px', width: '100%'}}
                    className='react_for_echarts power' 
                />
                <ReactEcharts
                    option={this.getWindSpeedOption(this.props.propsData.windspeedData, this.props.propsData.timeData)}
                    style={{height: '350px', width: '100%'}}
                    className='react_for_echarts windspeed' 
                />
            </div>
        </div>
      )
  }
}

