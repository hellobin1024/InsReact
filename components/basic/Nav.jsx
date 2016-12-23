import React from 'react';
import {render} from 'react-dom';
import { Link } from 'react-router'
import '../../css/components/basic/nav/nav.css';
var SyncStore = require('../../components/flux/stores/SyncStore');
var ProxyQ=require('../../components/proxy/ProxyQ');
var config=require('../../config.json');
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
    _onChange           : function () {
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
        return ({data: data, data$initialed: data$initialed, auto: auto, fieldCount: fieldCount});
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
                   <div className="logo">
                        <a>
                            <img src={this.props.logo}/>
                        </a>
                   </div>)
            }


            var nav;
            if(this.state.data!==undefined&&this.state.data!==null)
            {

                var lis = new Array();
                var linkCb=this.linkCb;
                this.state.data.map(function(first,i) {
                    var mnavL_left;
                    //三级菜单
                    if(first.sub[0].sub!==undefined&&first.sub[0].sub!==null)
                    {
                        var tz_2=new Array();

                        //进入二级
                        first.sub.map(function(second,j) {
                            var cells=new Array();
                            var k=0;
                            cells.push(
                                <td className="tz_td_nav" key={k++}>
                                    <table className="cell" width="100%">
                                        <tbody>
                                        <tr>
                                            <td className="blue_td">
                                                <a href="javascript:void(0)" target="_blank">{second.label} &gt;</a>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>);
                            //进入三级
                            second.sub.map(function(third,z) {
                                cells.push(
                                    <td className="tz_td_cell" key={k++}>
                                        <table className="cell" width="100%">
                                            <tbody>
                                            <tr>
                                                <td className="mtt_td1">
                                                    <Link
                                                        to={App.getAppRoute()+(third.route!==undefined&&third.route!==null?third.route:"/password/modify")}
                                                        onClick={linkCb}>{third.label}</Link>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>);
                            });


                            tz_2.push(
                                <div key={j}>
                                    <div className="tz_2" style={{marginLeft:"20px"}}>
                                        <table className="cell" width="100%">
                                            <tbody>
                                            <tr>
                                                {cells}
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="xian"></div>
                                </div>
                                );

                        });

                        lis.push(
                            <li className="" style={{marginLeft: "-2.57143px"}} key={i}>
                                <a href="javascript:void(0)" className="nav_a" >{first.label}</a>

                                <div className="mnavL" style={{display: "none",height:"150px"}}>
                                    <div className="mnavL_info">
                                        <div className="mnavL_left_LL fl clearfix" style={{position:"relative"}}>
                                            {tz_2}
                                        </div>
                                    </div>
                                </div>
                            </li>);
                    }
                    else//二级菜单
                    {
                        var cells=new Array();
                        var k=0;
                        cells.push(
                            <td className="tz_td_nav" key={k++}>
                                <table className="cell" width="100%">
                                    <tbody>
                                    <tr>
                                        <td className="blue_td">
                                            <a href="javascript:void(0)" target="_blank">{first.label} &gt;</a>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>);
                        first.sub.map(function(second,j) {
                            cells.push(
                                <td className=" tz_td_cell" key={k++}>
                                    <table className="cell" width="100%">
                                        <tbody>
                                        <tr>
                                            <td className="mtt_td1">
                                                <Link
                                                    to={App.getAppRoute()+(second.route!==undefined&&second.route!==null?second.route:"/password/modify")}
                                                    onClick={linkCb}>{second.label}</Link>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>);
                        });

                        mnavL_left=
                            <div className="mnavL_left_LL fl clearfix" style={{top:"0px"}}>
                                <div className="tz_2" style={{marginLeft:"20px"}}>
                                    <table className="cell" width="100%">
                                        <tbody>
                                        <tr>
                                            {cells}
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        lis.push(
                            <li className="" style={{marginLeft: "-2.57143px"}} key={i}>
                                <a href="javascript:void(0)" className="nav_a" >{first.label}</a>

                                <div className="mnavL" style={{display: "none",height:"60px"}}>
                                    <div className="mnavL_info">
                                        {mnavL_left}
                                    </div>
                                </div>
                            </li>);
                    }



                });
                //TODO:assign value to nav
                nav =
                    <div className="nav">
                        <ul ref="ul">
                            {lis}
                        </ul>
                    </div>
            }


            return (
                <div className="Nav">
                    <div className="navigation">
                        <div className="center">
                            <ul className="link">
                                <li><a id="bell" href="javascript:void(0)" className="fa fa-bell-o"
                                       style={{marginTop:"10px"}}><span
                                    style={{color:"#f00", paddingLeft:"3px"}}>{this.state.fieldCount}</span></a>

                                </li>
                                <li><a href="javascript:void(0)">刷新</a></li>
                                <em className="global-top-item global-top-seperator">|</em>
                                <li> <a
                                    href="javascript:void(0)"
                                    onClick={this.logOut}>退出</a>


                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="header_box">
                        <div className="header">
                            {logo}
                            {nav}
                        </div>
                    </div>
                    <div className="topbg"></div>
                </div>);
        }
    },
    componentDidMount:function(){
        SyncStore.addChangeListener(this._onChange);
        this.menushow("ul","li",".mnavL","hover");
    },
    componentWillUnmount: function () {
        SyncStore.removeChangeListener(this._onChange);
    }
});

module.exports = Nav;