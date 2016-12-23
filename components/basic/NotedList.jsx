import React from 'react';
import {render} from 'react-dom';
import LiElement from '../../components/basic/LiElement.jsx';
import '../../css/components/basic/NotedList/notedList.css';

/**
 *
 *
 *
 *
 */
var NotedList=React.createClass({
    clickCb:function(target){

        var pos=$(target).attr("data-pos");//一维数组下标
        if(pos!==undefined&&pos!==null) {
            if (this.state.data !== undefined && this.state.data !== null) {
                var data = this.state.data;
                //支持针对特定外部dom元素发布事件
                if(this.props.triggerId!==undefined&&this.props.triggerId!==null)
                {
                    var obj=document.getElementById(this.props.triggerId);
                    var event=document.createEvent('CustomEvent');
                    event.initCustomEvent('iframe change',true,true,{obj:data[pos]});
                    //this may failed in ie-8
                    obj.dispatchEvent(event);
                }
                if(this.props.clickCb!==undefined&&this.props.clickCb!==null)
                {
                    this.props.clickCb(data[pos]);
                }
            }
        }
    },
    fetch:function(){
        this.queryHandle(
            null,
            this.props.query.url,
            this.props.query.params,
            'json',
            function(response){
                if(response.data!==undefined&&response.data!==null&&response.data!="")
                    this.setState({data:response.data,data$initialed:true});
            }.bind(this)
        )
    },
    queryHandle:function(type,url,params,dataType,callback){
        $.ajax({
            type: type!==undefined&&type!==null?type:'POST',
            url: url,
            dataType: dataType!==undefined&&dataType!==null?dataType:'json',
            data: params,
            cache: false,
            success: function(response) {
                if(callback!==undefined&&callback!==null)
                    callback(response);
            },
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }
        });
    },
    getInitialState:function(){

        var auto;
        if(this.props.auto!==undefined&&this.props.auto!==null)
        {
            auto=this.props.auto;
        }

        var title;
        if(this.props.title!==undefined&&this.props.title!==null)
        {
            title=this.props.title;
        }


        var data;
        if(this.props.data!==undefined&&this.props.data!==null)
        {
            data=this.props.data;
        }

        var data$initialed;
        if(data!==undefined&&data!==null)
            data$initialed=true;
        else
            data$initialed=false;

        var comp=null;
        if(this.props.comp!==undefined&&this.props.comp!==null)
        {
            comp=this.props.comp;
        }


        return({auto:auto,data$initialed:data$initialed,data:data,title:title,comp:comp});
    },
    render:function() {
        var title = null;
        var lis = null;
        if (this.state.data$initialed == false && (this.state.data == undefined || this.state.data == null)) {
            if (this.state.auto == true)
                this.fetch();
        } else {
            if (this.state.title !== undefined && this.state.title !== null)
                title = this.state.title;


            var data;
            //根据组件类型遍历数据
            if(this.state.comp!==undefined&&this.state.comp!==null)
            {
                data = this.state.data;
                var clickCb = this.clickCb;
                if(this.state.comp=="menu")
                {
                    if (Object.prototype.toString.call(data) == '[object Array]') {
                        lis = new Array();
                        data.map(function (item, i) {

                            lis.push(
                                <LiElement data-pos={i} key={i} clickCb={clickCb}>
                                    <a href="javascript:void(0)">{item.content}</a>
                                </LiElement>);
                        });
                    }
                }else{//comp,note
                    if(data!="")
                    {
                        var i=0;
                      for(var field in data)
                      {
                          if(lis==null)
                            lis=new Array();
                          var content=field+":    "+data[field];
                          lis.push(
                              <LiElement data-pos={i++} key={i++} clickCb={clickCb}>
                                <a href="javascript:void(0)">{content}</a>
                                </LiElement>)
                      }
                    }
                }


            }
        }

        var re;
        if (this.state.comp !== undefined && this.state.comp !== null) {
            switch (this.state.comp) {
                //菜单列表
                case "menu":
                    re = <div className="menuList">
                        <div className="nav-header" data-toggle="collapse" data-target="#notedList-menu">
                            {title}
                        </div>
                        <ul id="notedList-menu" className="nav nav-list collapse in">
                            {lis}
                        </ul>
                    </div>
                    break;
                //信息列表
                case "note":
                    re=<div className="notedList">
                            <h3>{title}</h3>
                            {lis}
                        </div>
                    break;
                default:
                    re=<div className="notedList">
                        <div className="nav-header" data-toggle="collapse" data-target="#notedList-menu">
                            {title}
                        </div>
                        <ul id="notedList-menu" className="nav nav-list collapse in">
                            {lis}
                        </ul>
                    </div>
                    break;
            }
        }

        return re;

    }


});
export default NotedList;