import React from 'react';
import { Carousel } from 'element-react';
import "./index.css"

import 'element-theme-default';

// const data = {
// 	total: '123324134',
// 	list: [
// 		    {name: '华东电网',electic: 99999},
//       	{name: '华南电网',electic: 88888},
//       	{name: '华西电网',electic: 77777},
//       	{name: '华北电网',electic: 66666},
//       	{name: '华东电网2',electic: 55555},
//       	{name: '华南电网2',electic: 45454},
//       	{name: '华西电网2',electic: 34343},
//       	{name: '华北电网2',electic: 23232},
//       	{name: '华东电网3',electic: 12121},
//       	{name: '华南电网3',electic: 11111},
//       	{name: '华西电网3',electic: 9999},
//       	{name: '华北电网3',electic: 8888},
//       	{name: '华东电网4',electic: 7777}
// 	]
// }
export default class Banner extends React.Component {
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
    // 添加序号
    addAttribute (arr) {
      arr.forEach((item, index) => {
        item.index = (index + 1) < 10 ? '0' + (index + 1) : (index + 1);
      });
    }
    // 五个一分
    splitArray (num,arr)
    {
        var temp = [],i;
        for (i = 0;i < arr.length;){
          temp.push(arr.slice(i,i += num))
        } 
        return temp;
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
    let html = '';
    let color = '';
    let totalNum = this.add_comma_toThousands(this.props.propsData.total);
    let firstElectic = this.props.propsData.list[0].electic;
    let colorArray = ['#FF7070', '#FFF2AD', '#90FFB7', '#50B9FF', '#0072ED'];
    this.addAttribute(this.props.propsData.list)
    const listHtml = this.splitArray(5, this.props.propsData.list).map((item, index) => {
      html = '';
      item.forEach((place, index) => {
        // html += `<div><p style="width:${((place.electic/firstElectic)*100).toFixed(0)}%">${place.index}</p><p>${place.name}</p><p>${place.electic}</p></div>`;
        if (((place.electic/firstElectic)*100).toFixed(0) >= 80) {
          color = colorArray[0]
        } else if (((place.electic/firstElectic)*100).toFixed(0) >= 60) {
          color = colorArray[1]
        } else if (((place.electic/firstElectic)*100).toFixed(0) >= 40) {
          color = colorArray[2]
        } else if (((place.electic/firstElectic)*100).toFixed(0) >= 20) {
          color = colorArray[3]
        } else if (((place.electic/firstElectic)*100).toFixed(0) >= 0) {
          color = colorArray[4]
        }

        html += `
            <li class="item">
              <div class="serialNumberBox">
                <span class="dot1"></span>
                <span class="dot2"></span>
                <span class="dot3"></span>
                <span class="dot4"></span>
                ${place.index}
              </div>
              <div class="progressArea">
                <div class="descBox">
                  <p class="name">${place.name}：</p>
                  <p class="electic">${place.electic}</p>
                </div>
                <div class="progressBox">
                  <div class="progressBar" style="width:${((place.electic/firstElectic)*100).toFixed(0)}%;background-color:${color};"></div>
                </div>
              </div>
            </li>
          `
      })
      return html;
    })
    return (
        <div className={`bannerContainer ${this.props.className}`}>
          <div className="header">
            <div className="titleArea">
              <span className="colorBulk"></span>
              <div className="textArea">
                <p className="name">全国发电量</p>
                <p className="littleName">POWER GENERATION</p>
              </div>
            </div>
            <div className="totalText">
              <p className="electicNum">{totalNum}</p>
              <span className="unitText">MW</span>
            </div>
          </div>
          <div className="content">
            <div className="titleArea">
              <span className="colorBulk"></span>
              <div className="textArea">
                <p className="name">未来一周发电量排行</p>
                <p className="littleName">LIST</p>
              </div>
            </div>
            <div className="carouselArea">
              <Carousel indicatorPosition="outside" height="444px">
                {
                  listHtml.map((item, index) => {
                      return (
                        <Carousel.Item key={index} >
                          <ul className="bannerArea" dangerouslySetInnerHTML = {{ __html:item }}></ul>
                        </Carousel.Item>
                      )
                  })
                }
              </Carousel>
            </div>
          </div>
        </div>
      )
  }
}
