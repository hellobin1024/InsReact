import React from 'react';
import '../../css/insurancems/components/li.css';
import Panel from '../../components/panel/Panel.jsx';
import Hide from '../../components/basic/Hide.jsx';
var ProxyQ = require('../proxy/ProxyQ');


/**
 * TODO:merge Li into News component
 *
 */

var Li = React.createClass({
    returnCb:function () {
        this.setState({hiddenInfo: null,leftReturn:true});
        $(this.refs.contentDiv).slideDown();
        $(this.refs.pagination).slideDown();
    },
    cancelCb: function () {

    },
    clickCb:function (evt) {
        var target = evt.target;
        var index = $(target).attr("data-index");
        if (index !== undefined && index !== null) {
            var info = this.state.contentMapping[index];
            if (info !== undefined && info !== null) {
                var ob = new Object();
                ob.comp = "panel";
                //TODO:change the structor of ob
                var data = [
                    {row: ['title=>标题|span|' + info.title]},
                    {row: ['content=>内容|span|' + info.content]},
                    {row: ['author=>作者|span' + (info.author !== undefined && info.author !== null ? '|' + info.author : '')]},
                    {row: ['返回|return|']}
                ];
                ob.data = data;
                this.setState({hiddenInfo: ob , leftReturn:false});
                $(this.refs.contentDiv).slideUp();
                $(this.refs.pagination).slideUp();
            }
        }
    },
    pageCb:function (evt) {
        var target = evt.target;
        var index = $(target).attr("data-index");
        if (index !== undefined && index !== null) {
            var params = this.state.pageInfo;
            console.log("pageInfo=======" + params);
            params.pageNum = index;
            this.goGetPaginationData(params);
        }
    },
    fetch:function () {
        if (this.props.query !== undefined && this.props.query !== null) {
            ProxyQ.queryHandle(
                null,
                this.props.query.url,
                this.props.query.params,
                null,
                function (response) {
                    var data;
                    var ob = new Object();
                    if (Object.prototype.toString.call(response.data) != '[object Array]')
                        data = response.data;
                    ob.data$initialed = true;
                    if (data !== undefined && data !== null)
                        ob.data = data;
                    this.setState(ob);
                }.bind(this)
            )
        }
    },
    goGetPaginationData:function (ob) {
        if (this.props.query !== undefined && this.props.query !== null) {
            var params = this.props.query.params;
            if (ob !== undefined && ob !== null) {
                if (Object.prototype.toString.call(params) != '[object Object]')
                    params = eval('(' + params + ')');
                if (Object.prototype.toString.call(ob) != '[object Object]')
                    params = Object.assign(params, eval('(' + ob + ')'));
                else
                    params = Object.assign(params, ob);
            }
            ProxyQ.queryHandle(
                null,
                this.props.query.url,
                params,
                null,
                function (response) {
                    var data;
                    var ob = new Object();
                    //单页数据
                    if (Object.prototype.toString.call(response.data) == '[object Array]') {
                        response.data.map(function (row, i) {
                            console.log(i + ":" + row.toString());
                        });
                        data = response.data;
                    }
                    ob.data$initialed = true;
                    if (data !== undefined && data !== null)
                        ob.data = data;
                    //分页标签
                    if (response.nextPage !== undefined && response.nextPage !== null)
                        ob.nextPage = response.nextPage;
                    if (response.previousPage !== undefined && response.previousPage !== null)
                        ob.previousPage = response.previousPage;
                    if (response.currentPage !== undefined && response.currentPage !== null)
                        ob.currentPage = response.currentPage;
                    if (response.lastPage !== undefined && response.lastPage !== null)
                        ob.lastPage = response.lastPage;
                    if (response.firstPage !== undefined && response.firstPage !== null)
                        ob.firstPage = response.firstPage;
                    //分页的其它消息参数
                    if (response.params !== undefined && response.params !== null) {
                        ob.pageInfo = response.params;
                    }
                    this.setState(ob);
                }.bind(this)
            )
        }
    },
    getInitialState:function () {
        var data$initialed;
        var data;
        if (this.props.data !== undefined && this.props.data !== null) {
            data = this.props.data;
            data$initialed = true;
        }

        var auto;
        if (this.props.auto === true || this.props.auto === "true")
            auto = true;

        var currentPage;
        if (this.props.pagination !== undefined && this.props.pagination !== null) {
            currentPage = 1;
        }

        var contentMapping = null;
        return ({data     : data,
            auto          : auto,
            data$initialed: data$initialed,
            currentPage   : currentPage,
            contentMapping: contentMapping,
        });
    },

    componentWillReceiveProps:function(){
        this.setState({leftReturn:true})
    },

    render:function () {
        var lis = new Array();
        if (this.state.data$initialed !== true && (this.props.data == null || this.props.data == undefined)) {
            //分页组件拉取数据
            if (this.props.pagination !== undefined && this.props.pagination !== null) {
                if (this.state.auto == true)
                    this.goGetPaginationData();
                return <div></div>;
            } else {
                if (this.state.auto == true)
                    this.fetch();
                return <div></div>
            }
        } else {
            var cb = null;
            cb = this.clickCb;
            var state = this.state;
            state.contentMapping = new Object();
            this.state.data.map(function (item, i) {
                state.contentMapping[i] = item;
                lis.push(
                    <li key={i}>
                        <a className="news_a">
                            <span className="new-title" data-index={i} onClick={cb}>{item.label}</span>
                        </a>
                        <span className='li-new-date'>{item.newsTimeStr}</span>
                    </li>);
            });
        }

        var pagination = null;
        if (this.props.pagination !== undefined && this.props.pagination !== null) {

            var currentPage = <li key={this.state.currentPage} className="active">
                <a href="javascript:void(0);" data-index={this.state.currentPage}
                   onClick={this.pageCb}>{this.state.currentPage}</a>
            </li>
            var previousPage = null;
            if (this.state.currentPage != 1)
                previousPage = <li key={this.state.previousPage}>
                    <a href="javascript:void(0);" data-index={this.state.previousPage}
                       onClick={this.pageCb}>{this.state.previousPage}</a>
                </li>
            var nextPage = null;
            if (this.state.currentPage != this.state.lastPage)
                nextPage = <li key={this.state.nextPage}>
                    <a href="javascript:void(0);" data-index={this.state.nextPage}
                       onClick={this.pageCb}>{this.state.nextPage}</a>
                </li>
            var firstPage = null;
            if (this.state.currentPage > 2)
                firstPage = <li key={this.state.firstPage}>
                    <a href="javascript:void(0);" data-index={this.state.firstPage}
                       onClick={this.pageCb}>{this.state.firstPage}</a>
                </li>
            var lastPage = null;
            if (this.state.currentPage < this.state.lastPage - 1)
                lastPage = <li key={this.state.lastPage}>
                    <a href="javascript:void(0);" data-index={this.state.lastPage}
                       onClick={this.pageCb}>{this.state.lastPage}</a>
                </li>

            pagination =
                <ul className="pagination pagination-lg" ref="pages" style={{marginLeft:"40%"}}>
                    {firstPage}
                    {previousPage}
                    {currentPage}
                    {nextPage}
                    <li key={-1}>
                        <a href="javascript:void(0);">....</a>
                    </li>
                    {lastPage}
                </ul>;
        }


        var hide;
        if (this.state.hiddenInfo !== undefined && this.state.hiddenInfo !== null) {
            if (this.state.hiddenInfo.comp !== undefined && this.state.hiddenInfo.comp !== null) {
                var hide$c = null;
                switch (this.state.hiddenInfo.comp) {
                    case 'panel':
                        hide$c = <Panel
                            padding="0px"
                            autoComplete={true}
                            data={this.state.hiddenInfo.data}
                            returnCb={this.returnCb}
                            />;
                        break;
                    default:
                        break;
                }
                hide =
                    <Hide>
                        {hide$c}
                    </Hide>
            }
        }

        var returnBtn = null;
        if (this.props.returnCb !== undefined && this.props.returnCb !== null) {
            var props = this.props;
            var cb = function () {
                props.returnCb();
            }
            if(this.state.leftReturn !==false){
                returnBtn = <button onClick={cb} className="icon-chevron-left" style={{width:'4%',fontSize:'1.4em'}}></button>
            }
        }

        return (
            <div className="clearfix Li" ref="Li">
                <div style={{marginBottom:"15px"}}>
                    {returnBtn}
                </div>
                <div ref="hideDiv">
                    {hide}
                </div>
                <div ref="contentDiv">
                    <ul className="list">
                        {lis}
                    </ul>
                </div>
                <div ref="pagination">
                    {pagination}
                </div>
            </div>)
    }
});
module.exports = Li;