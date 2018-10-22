import React from 'react';
import "./index.css"

import 'element-theme-default';

export default class Banner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.leftSizeChange = this._leftSizeChange.bind(this);
    this.resize = this.resize.bind(this);
  }

    componentDidMount() {
      this.leftSizeChange();
      this.screenChange();
    }
    componentWillReceiveProps (nextProps) {
        // console.log(nextProps)
    }
    screenChange() {
      window.addEventListener('resize', this.resize);
    }
    resize () {
      this.leftSizeChange()
    }
    _leftSizeChange () {
        this.refs.titleContainer.style.left = document.getElementById("bannerBox").offsetWidth + 28.444 + "px";
    }
  render() {
    return (
      <div className={`titleContainer ${this.props.className}`} ref="titleContainer">
            <span className="square left1"></span>
            <span className="square left2"></span>
            <span className="square right1"></span>
            <span className="square right2"></span>
            全国所有风场发电态势感知
          </div>
      )
  }
}

