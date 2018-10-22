import React from 'react';
import { Carousel } from 'element-react';
import "./index.css"

import 'element-theme-default';

export default class Banner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.autoResize = this._autoResize.bind(this);
    this.resize = this.resize.bind(this);
  }

    componentDidMount() {
      this.autoResize('el', 'box');
      this.screenChange();
    }
    componentWillReceiveProps (nextProps) {
        // console.log(nextProps)
        // this.draw(nextProps.data)
    }
    screenChange() {
      window.addEventListener('resize', this.resize);
    }
    resize () {
      this.autoResize('el', 'box')
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
    _autoResize (elRef, box, direction) {
      let zooms = (window.innerHeight / 1080).toFixed(3); // 当前网页的高度/UI效果图高度 = 缩放的比例
      let el = this.refs[elRef];
      let elWidth = el.offsetWidth;
      let elHeight = el.offsetHeight;
      //	parseInt(540*0.613-540)/2/0.613
      //  parseInt(elWidth*zooms-elWidth)/2/zooms 宽度: 缩放后的宽度比原来的宽度之差的一半，再除以缩放的比例，是在当前网页需要x轴位移的真正距离。
      let leftRange = direction === 'right' ? Math.abs(parseInt(elWidth*zooms-elWidth, 10)/2/zooms) : parseInt(elWidth*zooms-elWidth, 10)/2/zooms;
      let topRange = parseInt(elHeight*zooms-elHeight, 10)/2/zooms;
      el.style.transform=`scale(${zooms}) translate(${leftRange}px, ${topRange}px)`;
      this.refs[box].style.width = elWidth * zooms + "px";
  }
  render() {
    let html = '';
    let color = '';
    let totalNum = this.add_comma_toThousands(this.props.propsData.total);
    let firstElectic = this.props.propsData.list[0].electric;
    let colorArray = ['#FF7070', '#FFF2AD', '#90FFB7', '#50B9FF', '#0072ED'];
    this.addAttribute(this.props.propsData.list)
    const listHtml = this.splitArray(5, this.props.propsData.list).map((item, index) => {
      html = '';
      item.forEach((place, index) => {
        // html += `<div><p style="width:${((place.electric/firstElectic)*100).toFixed(0)}%">${place.index}</p><p>${place.name}</p><p>${place.electric}</p></div>`;
        if (((place.electric/firstElectic)*100).toFixed(0) >= 80) {
          color = colorArray[0]
        } else if (((place.electric/firstElectic)*100).toFixed(0) >= 60) {
          color = colorArray[1]
        } else if (((place.electric/firstElectic)*100).toFixed(0) >= 40) {
          color = colorArray[2]
        } else if (((place.electric/firstElectic)*100).toFixed(0) >= 20) {
          color = colorArray[3]
        } else if (((place.electric/firstElectic)*100).toFixed(0) >= 0) {
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
                  <p class="electric">${this.add_comma_toThousands(place.electric)} MW</p>
                </div>
                <div class="progressBox">
                  <div class="progressBar" style="width:${((place.electric/firstElectic)*100).toFixed(0)}%;background-color:${color};"></div>
                </div>
              </div>
            </li>
          `
      })
      return html;
    })
    return (
        <div className={`box ${this.props.className}`} ref="box" id='bannerBox'>
          <div className={`bannerContainer ${this.props.className}`} ref="el">
            <div className="logo"></div>
            <div className="header">
              <div className="titleArea">
                <span className="colorBulk"></span>
                <div className="textArea">
                  <p className="name">全国功率</p>
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
                  <p className="name">区域功率</p>
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
        </div>
      )
  }
}

