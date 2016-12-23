import React from 'react';
import {render} from 'react-dom';
var Panel = require('../../../components/panel/Panel.jsx');
var Li = require('../../../components/basic/Li.jsx');
import Hide from '../../../components/basic/Hide.jsx';
import '../../../css/insurancems/components/news.css';
var ProxyQ = require('../../../components/proxy/ProxyQ');


var News=React.createClass({
    returnCb:function () {
        this.setState({hiddenInfo: null});
        $(this.refs.contentDiv).slideDown();
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
                    {row: ['author=>作者|span|' + info.author]},
                    {row: ['返回|return|']}
                ];
                ob.data = data;
                this.setState({hiddenInfo: ob});
                $(this.refs.contentDiv).slideUp();
            }
        }
    },

    queryCb:function (evt) {
        var target = evt.target;
        var query = $(target).attr("data-query");
        if (Object.prototype.toString.call(query) == '[object String]')
            query = eval('(' + query + ')');
        for (var field in query) {
            console.log(field + ":" + query[field]);
        }
        var comp = $(target).attr("data-comp");
        if (query !== undefined && query !== null) {
            var ob = new Object();
            ob.comp = comp;
            //TODO:change the structor of ob
            ob.query = query;
            ob.auto = true;
            this.setState({hiddenInfo: ob});
            $(this.refs.contentDiv).slideUp();
        }

    },

    fetch:function(){
        ProxyQ.queryHandle(
            null,
            this.props.query.url,
            this.props.query.params,
            null,
            function(response){
                var data;
                var ob=new Object();
                if(Object.prototype.toString.call(response)!='[object Array]')
                    if(response.data!==undefined&&response.data!==null)
                        if(Object.prototype.toString.call(response.data)=='[object Array]')
                            data=response.data;
                        else
                            data=response;
                ob.data$initialed=true;
                if(data!==undefined&&data!==null)
                    ob.data=data;
                this.setState(ob);
            }.bind(this)
        )

    },

    getInitialState:function(){
        var data$initialed;

        var data;
        if(this.props.data!==undefined&&this.props.data!==null)
        {
            data = this.props.data;
            data$initialed=true;
        }

        var auto;
        if(this.props.auto===true||this.props.auto==="true")
            auto=true;
        var contentMapping = new Object();
        return ({data: data, data$initialed: data$initialed, auto: auto, contentMapping: contentMapping});
    },

    render:function () {
        if (this.state.data$initialed !== true && (this.props.data == null || this.props.data == undefined)) {
            if (this.state.auto == true)
                this.fetch();
            return (<div></div>)

        } else {
            var uls;
            if (this.state.data !== null && this.state.data !== undefined) {
                uls = new Array();
                //TODO:划分一级和二级新闻
                var k = 0;
                var state = this.state;
                var clickCb = this.clickCb;
                var queryCb = this.queryCb;
                this.state.data.map(function (item, i) {
                    var groupNews = item;

                    if (item.query !== undefined && item.query !== null) {
                        uls.push(<li key={k++} className="main">
                            <span>{groupNews.newsTypeName}</span>
                            <span onClick={queryCb} className="more" data-query={JSON.stringify(item.query)}
                                  data-comp={item.comp!==undefined&&item.comp!==null?item.comp:null}>more</span>
                        </li>);
                    }
                    else
                        uls.push(<li key={k++} className="main"><span>{groupNews.newsTypeName}</span></li>);
                    if (groupNews.newsList !== undefined && groupNews.newsList !== null) {
                        groupNews.newsList.map(function (news, j) {
                            var content = news.content;
                            var author = news.author;
                            var title = news.title;
                            state.contentMapping[k] = {
                                content: content,
                                author : author,
                                title  : title
                            }
                            var t = k;
                            var cb = clickCb;
                            uls.push(
                                <li key={k} className="vice">
                                    <span data-index={k++} onClick={cb}>{title}</span>
                                </li>);
                        });
                    }
                });
            }

            var hide;
            if (this.state.hiddenInfo !== undefined && this.state.hiddenInfo !== null) {
                if (this.state.hiddenInfo.comp !== undefined && this.state.hiddenInfo.comp !== null) {
                    var hide$c;
                    switch (this.state.hiddenInfo.comp) {
                        case 'panel':
                            hide$c = <Panel
                                padding="0px"
                                autoComplete={true}
                                data={this.state.hiddenInfo.data}
                                returnCb={this.returnCb}
                                />;
                            break;
                        case 'Li':
                            hide$c = <Li
                                auto={true}
                                query={this.state.hiddenInfo.query}
                                returnCb={this.returnCb}
                                pagination={true}
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


            return (
                <div className="section clearfix news" ref="news">

                    <div className="about-text">
                        <p style={{marginTop:'20px',textAlign:'center',fontSize:'2.5em'}}>
                            新闻资讯
                        </p>
                    </div>

                    <div ref="hideDiv">
                        {hide}
                    </div>
                    <div ref="contentDiv">
                        <ul className="list">
                            {uls}
                        </ul>
                    </div>
                    <div ref="pagination">
                        <li key={0} className="active">
                            <a href="javascript:void(0);"
                                >{}</a>
                        </li>
                    </div>
                </div>
            );
        }
    }
});
module.exports = News;