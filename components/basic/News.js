/**
 * Created by danding on 16/10/30.
 */
import React from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router'
import NewsInfo from '../../entrys/insurance/modules/News.jsx';
import '../../css/components/basic/News.css';

var News=React.createClass({

    clickCb:function (evt) {
        var target = evt.target;
        var index = $(target).attr("data-index");
        if (index !== undefined && index !== null) {
            var info = this.state.contentMapping[index];
            if (info !== undefined && info !== null) {
                var ob = new Object();
                ob.comp = "panel";
                //TODO:change the structor of ob
                var detail = [
                    {row: ['title=>标题|span|' + info.title]},
                    {row: ['content=>内容|span|' + info.content]},
                    {row: ['author=>作者|span|' + info.author]},
                    {row: ['返回|return|']}
                ];
                ob.data = detail;
                this.props.clickCb(this.state.data,ob,this.state.contentMapping);
                //ob.data = detail;
                //this.setState({hiddenInfo: ob, isEnter:true});
            }
        }
    },

    getInitialState:function(){
        let data=null;
        if(this.props.data!==undefined&&this.props.data!==null)
            data=this.props.data;

        var contentMapping = new Object();
        return ({data: data, data$initialed: null, hiddenInfo: null, contentMapping: contentMapping, isEnter:false});
    },
    render:function(){

        var ins=null;
        if(this.state.data!==undefined&&this.state.data!==null)
        {
            var lis=[];
            var clickCb = this.clickCb;
            var state = this.state; //���������state

            var newsData = this.state.data[0];  //ֻ��һ�����͵����� �ʲ���dataѭ��
            var newsList = newsData.newsList;
            var k=0;
            if (newsList !== undefined && newsList !== null) {
                newsList.map(function(item,i) {
                    if(i<=6){ //只显示6条记录
                        var content = item.content;
                        var author = item.author;
                        var title = item.title;
                        var date = item.newsTimeStr;
                        state.contentMapping[k] = {
                            content: content,
                            author : author,
                            title  : title
                        }

                        if(date!==undefined&&date!==null)
                            lis.push(
                                <li key={i}>
                                    <a className="news_a">
                                        <span className="title" data-index={k++} onClick={clickCb}>{title}</span>
                                    </a>
                                    <span className='new-date'>{date}</span>
                                </li>
                            );
                        else
                            lis.push(
                                <li key={i}>
                                    <a className="news_a">
                                        <span className="title" data-index={k++} onClick={clickCb}>{title}</span>
                                    </a>
                                </li>);
                    }
                });
            }

            ins=
                <ul>
                    {lis}
                </ul>;
        } else{}

        if(this.state.isEnter!=undefined && this.state.isEnter!=null && this.state.isEnter==true){
            return(
                <NewsInfo
                    data={this.state.data}
                    auto={true}
                    hiddenInfo={this.state.hiddenInfo}
                    contentMapping={this.state.contentMapping}
                    />
            );
        }else{
            return (<div className='Ul'>{ins}</div>);
        }
    }
});

module.exports=News;