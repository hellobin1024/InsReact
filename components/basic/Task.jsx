import React from 'react';
import {render} from 'react-dom';
var ProxyQ = require('../../components/proxy/ProxyQ');
import  '../../css/components/basic/task.css';
/**
 *
 *
 * 任务安排控件
 * 1.数据结构
 *
 *
 *
 */


var Task = React.createClass({
    fetch          : function () {
        ProxyQ.queryHandle(
            null,
            this.props.query.url,
            this.props.query.params,
            'json',
            function (response) {
                var data;
                var ob = new Object();
                if (Object.prototype.toString.call(response) != '[object Array]')
                    if (response.arr !== undefined && response.arr !== null)
                        if (Object.prototype.toString.call(response.arr) == '[object Array]')
                            data = response.arr;
                        else
                            data = response;
                ob.data$initialed = true;
                this.setState(ob);
            }.bind(this)
        )

    },
    getInitialState: function () {
        var auto;
        if (this.props.auto !== undefined && this.props.auto !== null)
            auto = this.props.auto;
        var data;
        var data$initialed;
        if (this.props.data !== undefined && this.props.data !== null) {
            data = this.props.data;
            data$initialed = true;
        }
        else
            data$initialed = false;
        var timeSpan = null;
        if (this.props.timeSpan !== undefined && this.props.timeSpan !== null)
            timeSpan = this.props.timeSpan;


        return ({data$initialed: data$initialed, data: data, auto: auto, timeSpan: timeSpan});
    },
    componentWillReceiveProps(props)
    {
        var ob = new Object();
        if (props.data !== undefined && props.data !== null) {
            ob.data = props.data;
            ob.data$initialed = true;
        }

        this.setState(ob);
    },
    render         : function () {

        if (this.state.data$initialed !== true && (this.props.data == null || this.props.data == undefined)) {
            if (this.state.autoFetch == true)
                this.fetch();
            return (
                <table>
                </table>
            )
        }
        else {
            var state = this.state;
            var trs = new Array();
            var fills = new Array();
            //初始化每天的任务位移
            var highLight=this.props.highLight;
            var gradient=this.props.gradient;
            for (var i = 0; i < 7; i++)
                fills.push({"data-index": 0, "row-offset": 1});
            //塞入课程,每次遍历单个row
            for (var i = 0; i < 12; i++) {
                var tds = new Array();
                if (i == 0) {
                    tds.push(<td className={highLight==true?"highLight":gradient==true?"gradient":""} key={-1}>节/周</td>);
                    tds.push(<td className={highLight==true?"highLight":gradient==true?"gradient":""} key={0}>一</td>);
                    tds.push(<td className={highLight==true?"highLight":gradient==true?"gradient":""} key={1}>二</td>);
                    tds.push(<td className={highLight==true?"highLight":gradient==true?"gradient":""} key={2}>三</td>);
                    tds.push(<td className={highLight==true?"highLight":gradient==true?"gradient":""} key={3}>四</td>);
                    tds.push(<td className={highLight==true?"highLight":gradient==true?"gradient":""} key={4}>五</td>);
                    tds.push(<td className={highLight==true?"highLight":gradient==true?"gradient":""} key={5}>六</td>);
                    tds.push(<td className={highLight==true?"highLight":gradient==true?"gradient":""} key={6}>日</td>);
                    trs.push(<tr className={highLight==true?"highLight":gradient==true?"gradient":""} key={i}>{tds}</tr>);
                    continue;
                }
                tds.push(<td key={-1}>{i}</td>);
                for (var j = 0; j < 7; j++) {
                    var day = this.state.data[j];
                    if ((fills[j]["data-index"] + 1) <= day.length)//如果当天还有未塞入的任务
                    {
                        if (i >= fills[j]["row-offset"]) {
                            var task = day[fills[j]["data-index"]++];
                            tds.push(<td key={j} rowSpan={task.rowSpan} className={highLight==true?"center highLight":gradient==true?"center gradient":"center"}>{task.name}</td>);
                            fills[j]["row-offset"] = parseInt(fills[j]["row-offset"]) + parseInt(task.rowSpan);
                        } else {
                        }
                    } else {//当天已无需要塞入任务
                        if (i >= fills[j]["row-offset"])
                            tds.push(<td key={j}></td>);
                        else {
                        }
                    }
                }
                trs.push(<tr key={i}>{tds}</tr>);
            }

            var thead = null;
            if (this.props.title !== undefined && this.props.title !== null) {
                thead = <thead>
                <tr>
                    <th rowSpan={8}>{this.props.title}</th>
                </tr>
                </thead>
            }
            return (
                <table className="task table table-bordered center">
                    {thead}
                    <tbody>
                    {trs}
                    </tbody>
                </table>
            )
        }


    }
});
module.exports = Task;