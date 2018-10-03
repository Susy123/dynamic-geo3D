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

export function get7DaysData(resPower,cityGeoInfo){
    let data = [];
    let length = resPower[0].power.length;
    for(let i = 0; i<length;i++){
        let dataI = resPower.map(item=>({
            "name":item.name,
            "value":cityGeoInfo[item.name].lonlat.concat(item.power[i]),
            "province":cityGeoInfo[item.name].province
        }));

        data.push(dataI);
    }
    return data;
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