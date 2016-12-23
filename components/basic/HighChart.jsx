import React from 'react';
import {render} from 'react-dom';
var ProxyQ = require('../proxy/ProxyQ');

/**
 * 1.query属性的params键必填
 * 2.data数据结构 var config = {
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 295.6, 454.4]
        }]
    };

 * 3.props type:['line','column']
 * 4.props title:String
 * 5.props subtitle:String
 * 6.props xAxis:[] required
 * 7.props series:[] required
 *
 * 8.对于同一份数据,如何从折线图|饼图|柱状图  去展示
 * 9.如何在同个视图中渲染多份数据,并进行对比
 *
 * */

var HighChart=React.createClass({
    fetch:function(){

        ProxyQ.queryHandle(
            null,
            '/bsuims/reactPageDataRequest.do',
            this.props.query.params,
            null,
            function(response)
            {
                let config=null;
                if(response.config!==undefined&&response.config!==null)
                    config=response.config;
                this.setState({config: config});
            }
        );

    },
    getInitialState:function(){

        let series=null;
        if(this.props.series!==undefined&&this.props.series!==null)
            series=this.props.series;

        let auto=null;
        if(this.props.auto!==undefined&&this.props.auto!==null)
            auto=this.props.auto;
        else
            auto=false;

        let xAxis;
        if(this.props.xAxis!==undefined&&this.props.xAxis!==null)
            xAxis=this.props.xAxis;


        let type=null;
        if(this.props.type!==undefined&&this.props.type!==null)
            type=this.props.type;

        let title=null;
        if(this.props.title!==undefined&&this.props.title!==null)
            title=this.props.title;

        let subtitle=null;
        if(this.props.subtitle!==undefined&&this.props.subtitle!==null)
            subtitle=this.props.subtitle;

        let tooltip=null;
        if(this.props.tooltip!==undefined&&this.props.tooltip!==null)
            tooltip=this.props.tooltip;

        let plotOptions=null;
        if(this.props.plotOptions!==undefined&&this.props.plotOptions!==null)
            plotOptions=this.props.plotOptions;

        let yAxis=null;
        if(this.props.yAxis!==undefined&&this.props.yAxis!==null)
            yAxis=this.props.yAxis;

        let drilldown=null;
        if(this.props.drilldown!==undefined&&this.props.drilldown)
        {
            drilldown=this.props.drilldown;
        }

        return({auto:auto,type:type,xAxis:xAxis,series:series,title:title,subtitle:subtitle,tooltip:tooltip,plotOptions:plotOptions,yAxis:yAxis,
            drilldown:drilldown});
    },
    render:function(){

        if(this.state.xAxis!==undefined&&this.state.xAxis!==null&&this.state.series!==undefined&&this.state.series!==null)
        {
            let config={
                chart: {
                    type: this.state.type!==undefined&&this.state.type!==null?this.state.type:'line'
                },
                title: {
                    text: this.state.title!==undefined&&this.state.title!==null?this.state.title:''
                },
                subtitle: {
                    text: this.state.subtitle!==undefined&&this.state.subtitle!==null?this.state.subtitle:''
                },
                xAxis: this.state.xAxis,
                yAxis: {min: 0},
                series:this.state.series
            };
            if(this.state.tooltip!==undefined&&this.state.tooltip!==null)
                config = Object.assign(config, {tooltip: this.state.tooltip});
            if(this.state.plotOptions!==undefined&&this.state.plotOptions!==null)
                config=Object.assign(config,{plotOptions:this.state.plotOptions});
            if(this.state.yAxis!==undefined&&this.state.yAxis!==null)
                config = Object.assign(config, {yAxis: this.state.yAxis});
            if(this.state.drilldown!==undefined&&this.state.drilldown!==null)
                config = Object.assign(config, this.state.drilldown);


            return(
                <div className="HighChart" ref="high">
                </div>);
        }else{
            if(this.state.auto==true)
                this.fetch();
            return(<div className="HighChart"></div>);
        }
    },
    componentDidUpdate:function(){

    },
    componentDidMount:function(){
        var high=this.refs.high;
        $(high).highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Browser market shares. January, 2015 to May, 2015'
            },
            subtitle: {
                text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'Total percent market share'
                }

            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.1f}%'
                    }
                }
            },

            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
            },

            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: [{
                    name: 'Microsoft Internet Explorer',
                    y: 56.33,
                    drilldown: 'Microsoft Internet Explorer'
                }, {
                    name: 'Chrome',
                    y: 24.03,
                    drilldown: 'Chrome'
                }, {
                    name: 'Firefox',
                    y: 10.38,
                    drilldown: 'Firefox'
                }, {
                    name: 'Safari',
                    y: 4.77,
                    drilldown: 'Safari'
                }, {
                    name: 'Opera',
                    y: 0.91,
                    drilldown: 'Opera'
                }, {
                    name: 'Proprietary or Undetectable',
                    y: 0.2,
                    drilldown: null
                }]
            }],
            drilldown: {
                series: [{
                    name: 'Microsoft Internet Explorer',
                    id: 'Microsoft Internet Explorer',
                    data: [
                        [
                            'v11.0',
                            24.13
                        ],
                        [
                            'v8.0',
                            17.2
                        ],
                        [
                            'v9.0',
                            8.11
                        ],
                        [
                            'v10.0',
                            5.33
                        ],
                        [
                            'v6.0',
                            1.06
                        ],
                        [
                            'v7.0',
                            0.5
                        ]
                    ]
                }, {
                    name: 'Chrome',
                    id: 'Chrome',
                    data: [
                        [
                            'v40.0',
                            5
                        ],
                        [
                            'v41.0',
                            4.32
                        ],
                        [
                            'v42.0',
                            3.68
                        ],
                        [
                            'v39.0',
                            2.96
                        ],
                        [
                            'v36.0',
                            2.53
                        ],
                        [
                            'v43.0',
                            1.45
                        ],
                        [
                            'v31.0',
                            1.24
                        ],
                        [
                            'v35.0',
                            0.85
                        ],
                        [
                            'v38.0',
                            0.6
                        ],
                        [
                            'v32.0',
                            0.55
                        ],
                        [
                            'v37.0',
                            0.38
                        ],
                        [
                            'v33.0',
                            0.19
                        ],
                        [
                            'v34.0',
                            0.14
                        ],
                        [
                            'v30.0',
                            0.14
                        ]
                    ]
                }, {
                    name: 'Firefox',
                    id: 'Firefox',
                    data: [
                        [
                            'v35',
                            2.76
                        ],
                        [
                            'v36',
                            2.32
                        ],
                        [
                            'v37',
                            2.31
                        ],
                        [
                            'v34',
                            1.27
                        ],
                        [
                            'v38',
                            1.02
                        ],
                        [
                            'v31',
                            0.33
                        ],
                        [
                            'v33',
                            0.22
                        ],
                        [
                            'v32',
                            0.15
                        ]
                    ]
                }, {
                    name: 'Safari',
                    id: 'Safari',
                    data: [
                        [
                            'v8.0',
                            2.56
                        ],
                        [
                            'v7.1',
                            0.77
                        ],
                        [
                            'v5.1',
                            0.42
                        ],
                        [
                            'v5.0',
                            0.3
                        ],
                        [
                            'v6.1',
                            0.29
                        ],
                        [
                            'v7.0',
                            0.26
                        ],
                        [
                            'v6.2',
                            0.17
                        ]
                    ]
                }, {
                    name: 'Opera',
                    id: 'Opera',
                    data: [
                        [
                            'v12.x',
                            0.34
                        ],
                        [
                            'v28',
                            0.24
                        ],
                        [
                            'v27',
                            0.17
                        ],
                        [
                            'v29',
                            0.16
                        ]
                    ]
                }]
            }});


    }
});
module.exports=HighChart;