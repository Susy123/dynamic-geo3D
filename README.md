/** 一、全国界面 **/
// 1 各市的经纬度、所在省份 (直接提供json即可)
{
    '南通':{'lonlat':[130.23, 24.43],'province':'江苏'},
    '西安':{'lonlat':[130.23, 24.43],'province':'陕西'},
    '太原':{'lonlat':[130.23, 24.43],'province':'山西'}
}
// 2 各市级预测功率序列
// 请求参数：
region:'china',startTime:'2018-09-28T00:00:00Z',length:96*7
// 返回：
[
    {'name':'南通','power':[123.45,153.45,431.32,123,34]},
    {'name':'南通','power':[123.45,153.45,431.32,123,34]},
    {'name':'南通','power':[123.45,153.45,431.32,123,34]}
]
// 3 发电量 单位为MWh
// 请求参数：
startTime:'2018-09-28T00:00:00Z'
// 返回：
{
    'total': '123324134',
    'list': [
        {name: '华东电网',electric: 99999},
        {name: '华南电网',electric: 88888},
        {name: '华西电网',electric: 77777},
        {name: '华北电网',electric: 66666},
        {name: '华东电网2',electric: 55555},
        {name: '华南电网2',electric: 45454},
        {name: '华西电网2',electric: 34343},
        {name: '华北电网2',electric: 23232},
        {name: '华东电网3',electric: 12121},
        {name: '华南电网3',electric: 11111},
        {name: '华西电网3',electric: 9999},
        {name: '华北电网3',electric: 8888},
        {name: '华东电网4',electric: 7777}
    ]
}
/** 二、省级界面 **/
// 1 各风场的经纬度,场站信息 (直接提供json即可)
{
    'Farm01':{'lonlat':[231.34,34.23], 'address':'江苏省无锡市xxx街道', 'capacity':999}, //装机容量(capacity)单位为MW
    'Farm02':{'lonlat':[231.34,34.23], 'address':'江苏省无锡市xxx街道', 'capacity':999},
    'Farm03':{'lonlat':[231.34,34.23], 'address':'江苏省无锡市xxx街道', 'capacity':999}
}
// 2 该省份的风场级预测功率, 风速序列, 发电量
// 请求参数：
region:'江苏',startTime:'2018-09-28T00:00:00Z',length:96*7
// 返回：
[
    {'name':'Farm01','power':[123.45,153.45,431.32,123,34], 'wind':[1,1,1,1,1], 'electric':345},  // 发电量(electric)单位为kwh
    {'name':'Farm02','power':[123.45,153.45,431.32,123,34], 'wind':[1,1,1,1,1], 'electric':345},
    {'name':'Farm03','power':[123.45,153.45,431.32,123,34], 'wind':[1,1,1,1,1], 'electric':345}
]