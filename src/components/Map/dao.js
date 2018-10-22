import moment from 'moment';

var Utils={
    /*数字转换千分位*/
    thousandPointsFmt(number){
        if(number=='NaN' || number=='undefined' || number==="" || number===0)return 0;
        var num = number + "";  
        num = num.replace(new RegExp(",","g"),"");   
        
        var symble = "";   
        if(/^([-+]).*$/.test(num)) {   
            symble = num.replace(/^([-+]).*$/,"$1");   
            num = num.replace(/^([-+])(.*)$/,"$2");   
        }   
       
        if(/^[0-9]+(\.[0-9]+)?$/.test(num)) {   
            var num = num.replace(new RegExp("^[0]+","g"),"");   
            if(/^\./.test(num)) {
                num = "0" + num;
            }
       
            var decimal = num.replace(/^[0-9]+(\.[0-9]+)?$/,"$1");   
            var integer= num.replace(/^([0-9]+)(\.[0-9]+)?$/,"$1");   
       
            var re=/(\d+)(\d{3})/;  
       
            while(re.test(integer)){   
                integer = integer.replace(re,"$1,$2");  
            }   
            return symble + integer + decimal;   
       
        } else {   
            return number;   
        }   
    },
}

export default Utils;

export function get7DaysData(resPower,cityGeoInfo,sqrt=1){
    let data = [];
    let length = resPower[0].power.length;
    for(let i = 0; i<length;i++){
        let dataI = resPower.map(item=>{
            if(cityGeoInfo[item.name]===undefined){
                console.log('city info not contain: ',item.name);
                return null;
            }
            return {
                "name":item.name,
                "value":cityGeoInfo[item.name].lonlat.concat((Math.pow(item.power[i],sqrt)).toFixed(2)),
                "province":cityGeoInfo[item.name].province
            };
        });

        data.push(dataI);
    }
    return data;
}

export function getMaxPower(resPower){
    // let maxPowerList = resPower.map(item=>Math.max(...item.power));
    // let maxPower = Math.max(...maxPowerList);
    let farmPowerList = [];
    let maxPower = [];
    for(let i=0;i<24*7;i++){
        farmPowerList = resPower.map(item=>item.power[i]);
        maxPower.push(Math.max(...farmPowerList));
    }
    return maxPower;
}

export function getApproItem(maxPowerLabel){
    var avgItem = Math.ceil(maxPowerLabel/5);
    var numLength = avgItem.toString().length;
    var remainNum = 2;// 保留有效位数
    if(numLength>remainNum){
        var powerNum = Math.pow(10,numLength-remainNum);
        avgItem = Math.ceil(avgItem/powerNum) * powerNum;
    }
    return avgItem;
}

export function getPowerLabelItem(valueItem,powerNum){
    var powerLabelItem = [];
    for(let i=0;i<5;i++){
        powerLabelItem.push(Utils.thousandPointsFmt(Math.pow(valueItem*i,powerNum)));
    }
    return powerLabelItem;
}

export function getBannerData(tick, totalPower){
    var bannerData = {
        total: totalPower.total[tick],
        list: totalPower.list.map((item)=>({
            name: item.name,
            electric: item.electric[tick]
        })).sort((x,y)=>{
            if(x.electric>y.electric){
                return -1;
            } else {
                return 1;
            }
        })
        // [
        //       {name: '西北电网',electric: 1859239.2},
        //       {name: '华北电网',electric: 1573202.4},
        //       {name: '东北电网',electric: 1501693.2},
        //       {name: '华中电网',electric: 1001128.8},
        //       {name: '华东电网',electric: 715092},
        //       {name: '南方电网',electric: 500564.4}
        // ]
      };
    return bannerData;
}

export function getFarmData(farmName, allFarmData, farmInfo) {
    var farmDataTemp = allFarmData.filter((item)=>(item.name===farmName))[0];
    var farmInfoPar = farmInfo[farmName] || {};
    var farmData = {
        adress: farmName,
        detailAdress: farmInfoPar.address,
        capacity: farmInfoPar.capacity,
        intradayElectric: farmDataTemp.electric,
        powerData: farmDataTemp.power.slice(0, 24),
        windspeedData: farmDataTemp.wind.slice(0,24),
        timeData: [
          '0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00',
          '7:00',  '8:00', '9:00', '10:00', '11:00',
          '12:00', '13:00', '14:00', '15:00', '16:00',
          '17:00', '18:00', '19:00', '20:00', '21:00',
          '22:00', '23:00'].map((item)=>(moment().format('YYYY/MM/DD')+' '+item))
      }
      return farmData;
}


export function getTicksLabel() {
    var todayMO = moment();
    var labelList = [];
    var weekStrList = ['周日','周一','周二','周三','周四','周五','周六']
    for(var i=0;i<7;i++){
        labelList[i] = todayMO.format('MM-DD')
            + weekStrList[parseInt(todayMO.format('d'))];
        todayMO = todayMO.add(1,'d');
    }
    labelList[7]='';
    return labelList;
}
export function getTicks() {
    var startOfDay = moment().startOf('day');
    var tickList = [];
    for(var i = 0;i<8;i++){
        tickList[i] = startOfDay.valueOf()+i*24*60*60*1000;
    }
    return tickList;
}