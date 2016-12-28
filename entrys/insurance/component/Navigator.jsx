import React from 'react';
import {render} from 'react-dom';
import { Link } from 'react-router'
import { browserHistory } from 'react-router'

import '../../../css/components/basic/nav/nav.css';
var SyncStore = require('../../../components/flux/stores/SyncStore');
var ProxyQ=require('../../../components/proxy/ProxyQ');
var config=require('../../../config.json');
/**
 * 1.
 * 1>,二级菜单做成堆叠式的表格
 * 2>,三级菜单做成多行式布局
 * 3>,
 */

var Nav=React.createClass({

    logOut: function () {
        var path = null;
        var model ='';
        var pre = "";
        if(window.App.getModel()=="debug")
        {
            if(window.App.getAppRoute()=="")
            {
                console.log('......');
                var proxy=config.devServer.proxy;
                for (var field in proxy)
                {
                    var re = /\/(.*?)\//;
                    path= re.exec(field)[1];
                    break;
                }
            }
            else if(window.App.getAppRoute().indexOf("/")!=-1)
            {
                var re = /^(\/.*?)\//;
                path= re.exec(window.App.getAppRoute())[1];
            }
        }else{
            path='';
        }
        var str = path + "/bsuims/bsMainFrameLogout.do?contextName=" + model
            + "&contextPath=" + path;
        if (pre != null && pre != "")
            str = str + "&paraItemName=" + pre;
        window.location.href = str;


    },

    _home:function(){
        browserHistory.push(window.App.getAppRoute()+"/");
    },

    _onChange: function () {
        var stores = SyncStore.getAll();
        var fieldCount = 0;
        for (var field in stores) {
            fieldCount++;
        }
        if (fieldCount >= 1) {
            //TODO:swing the bell
            App.swing("#bell");
        } else {
            App.unSwing("#bell");
        }
        this.setState({fieldCount: fieldCount});


        //for (var id in stores) {
        //    console.log("id=" + stores[id].route);
        //    console.log("data=" + stores[id].data);
        //}


    },
    linkCb:function(evt){
        //var target=evt.target;
        //evt.preventDefault();
    },
    fetch:function(){
        this.queryHandle(
            null,
            this.props.query.url,
            this.props.query.params,
            'json',
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
    _logOut:function(){
        ProxyQ.queryHandle(
            null,
            "/bsuims/serviceHobbyLogout.do",
            {
            },
            null,
            function(response){
                //这里需要统一规范后台返回的数据格式
                console.log("log successfully!");
            }.bind(this)
        );
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
    menushow:function(ref$ob,sel1,sel2,cl){
    //this function would make global pollute
        var index,id,timer,divcreate;
        divcreate=false;
        var ref=this.refs[ref$ob];
        if(ref!==undefined&&ref!==null)
        {
            var obj1=$(ref).find(sel1);

            $(obj1).hover(
                function(){
                    id=$(obj1).index(this);
                    $(obj1).removeClass(cl);
                    $(this).addClass(cl);
                    hidecur();
                    $(obj2).eq(id).stop(true,true).delay(400).slideDown(200, function(){});
                    divcreate=true;
                    index=id;

                },function(){
                    id=$(obj1).index(this);
                    divcreate=false;
                    hidecur();
                    $(obj1).removeClass(cl);
                });

            var obj2=$(ref).find(sel2);
            $(obj2).hover(function () {
                    divcreate = true;
                    hidecur();
                },
                function () {
                    id = $(obj2).index(this);
                    divcreate = false;
                    hidecur();
                });

            function hidecur(){
                clearTimeout(timer);
                if(index!=id){$(obj2).eq(index).stop(true,true).delay(50).fadeOut("fast", function(){});	}
                timer=setTimeout(function(){
                    if(!divcreate){
                        $(obj2).eq(id).stop(true,true).delay(50).fadeOut("fast", function(){});
                    };
                },100);
            }
        }


    },

    getInitialState:function(){

        var data$initialed;

        var data;
        if(this.props.data!==undefined&&this.props.data!==null)
        {
            data = this.props.data;
                data$initialed=true;
        }
        else
        {
            if(this.props.data$initialed!==undefined&&this.props.data$initialed!==null)
                data$initialed=this.props.data$initialed;
        }


        var auto;
        if(this.props.auto===true||this.props.auto==="true")
            auto=true;
        var fieldCount = 0;
        return ({data: data, data$initialed: data$initialed, auto: auto, fieldCount: fieldCount,
            session: SyncStore.getNote(), url:null});
    },

    render:function(){
        if(this.state.data$initialed!==true&&(this.props.data==null||this.props.data==undefined))
        {
            if(this.state.auto==true)
                this.fetch();
            return (<div></div>)

        }else{

            var logo;
            if(this.props.logo!==undefined&&this.props.logo!==null)
            {
               logo=(
                   <div className="inline fleft" style={{padding:'2px 0px 0px 0px'}}>
                            <img src={this.props.logo}/>
                   </div>)
            }


            var nav;
            if(this.state.data!==undefined&&this.state.data!==null)
            {
                var lis = new Array();
                var splitIntoBranch = this.splitIntoBranch;
                var innerThis = this; //用在map()函数里面，外面的this不能在里面用
                this.state.data.map(function(first,i) {
                    if(first.label=='产品中心'){
                        lis.push(
                            <li className="dropdown" style={{width:'85px'}}>
                                <a data-toggle="dropdown" href="javascript:void(0)">
                                <span aria-hidden="true" >
                                </span><strong style={{fontWeight:'100'}}>{first.label}</strong>
                                </a>
                                <ul className="dropdown-menu">
                                    <li >
                                        <Link to={window.App.getAppRoute()+(first.route1!==undefined && first.route1!==null?first.route1:"/")}>
                                            <a>寿险</a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={window.App.getAppRoute()+(first.route2!==undefined && first.route2!==null?first.route2:"/")}>
                                            <a>车险</a>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        );
                    }
                    else{
                        lis.push(
                            <li className="nav-li" style={{marginLeft: "-2.57143px"}} key={i} >
                                <a href="javascript:void(0)" className="nav_a" >
                                    <Link to={window.App.getAppRoute()+(first.route!==undefined && first.route!==null?first.route:"/")}>
                                        {first.label}</Link>
                                </a>
                            </li>
                        );
                    }

                });

                //TODO:assign value to nav
                nav =
                    <div className="nav" style={{float:'right',paddingTop:'44px'}}>
                        <ul ref="ul">
                            {lis}
                        </ul>
                    </div>
            }

            return (
                <div >
                    <div className="header_box">
                        <div className="header_">
                            {logo}
                            {nav}
                        </div>
                    </div>
                </div>);
        }
    },
    componentDidMount:function(){
        SyncStore.addChangeListener(this._onChange);
        //this.menushow("ul","li",".mnavL","hover");
    },
    componentWillUnmount: function () {
        SyncStore.removeChangeListener(this._onChange);
    }
});

module.exports = Nav;