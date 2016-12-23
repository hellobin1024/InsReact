import React from 'react';
import {render} from 'react-dom';
import '../../css/components/basic/scaleBar/scaleBar.css';
import Panel from '../panel/Panel.jsx';
import Attention from '../basic/Attention.jsx';
import Horizontal from '../basic/Horizontal.jsx';
import IFrame from '../basic/IFrame.jsx';
import Zoomer from '../basic/Zoomer.jsx';
var News=require('../../entrys/201513569/studentisp/newsWelcome/modules/News.jsx');
var Password = require('../../components/compounds/password/PasswordElement.jsx');
var SyncStore = require('../../components/flux/stores/SyncStore');

/**
 * 1.通过ScaleBar.jsx控件直接往Attention组件注入未完成业务
 */

var ScaleBar =React.createClass({
    _onChange           : function () {
        var stores = SyncStore.getAll();
        for (var id in stores) {
            console.log("id=" + stores[id].route);
            console.log("data=" + stores[id].data);
        }


        this.setState({_todos: stores});
    },
    _onDevote:function(){
        let devoting=SyncStore.isDevote();
        let notificationExist=false;
        let notificationIndex=-1;
        let k=0;
        this.state.data.map(function(item,i) {
            if(item.label=="通知")
            {
                notificationExist=true;
                notificationIndex=i;
            }
        });
        if(devoting)
        {
            if(!notificationExist)//如果不存在通知
            {
                let additional=
                {
                    "label": "通知",
                    "img": "/images/serviceHobby/ico/news.png",
                    "type": "News",
                    "content":
                    {
                        "query":
                        {
                            "url":"/bsuims/reactPageDataRequest.do",
                            "params":
                            {
                                "reactPageName":"groupNewsReactPage",
                                "reactActionName":"listTypeNewsUseReact"
                            }
                        },
                        "width":"880px",
                        "marginTop":"0px"
                    }
                }
                this.state.data.push(additional);
                this.setState({data:this.state.data});
            }
        }else{
            if(notificationExist)
            {
                var data=this.state.data;
                data.splice(notificationIndex,1);
                this.setState({data:data});
            }
        }
    },
    clickhide3:function(ref,sel1,sel2,sel3,sel4)
    {
        var category=this.refs[ref];
        var $category=$(category);
        var obj1=$category.find(sel1);
        $(obj1).click(function() {
            var obj2=$category.find(sel2);
            var obj3=$category.find(sel3);
            var obj4=$category.find(sel4);
            $(obj2).hide();
            $(obj3).animate({width:"0"}, 100);
            $(obj4).show();
            $(obj4).animate({width:"40px"}, 400);

        });
    },
    clickshow6:function(ref,sel1,sel2,sel3,sel4,sel5,sel6,cl)
    {
        var id;
        var screen_w=window.screen.width;
        var div_w;
        if(screen_w>960){
            div_w=(screen_w-960)/2+960;
        }else{
            div_w=960;
        }
        var category=this.refs[ref];
        var $category=$(category);
        var obj1=$category.find(sel1);
        var obj2=$category.find(sel2);
        var obj3=$category.find(sel3);
        var obj4=$category.find(sel4);
        var obj5=$category.find(sel5);
        var obj6=$category.find(sel6);
        $(obj1).click(function() {

            console.log();
            console.log();
            console.log();

            //cl=='hover'
            id=$(obj1).index($(this));
            $(obj1).removeClass(cl);
            //obj2=='.susp_show .susp_l li.sus',obj2高亮
            if($(obj2).eq(id).length>=1)
            {
                $(obj2).eq(id).addClass(cl);
                var ob=$(obj2).eq(id)[0];
                var background=null;
                if($(ob).css('background')!=''&&$(ob).css('background')!=null)
                    background=$(ob).css('background');
                else if($(ob).css('background-image')!=''&&$(ob).css('background-image')!=null)
                    background = $(ob).css('background-image');
                else
                {}
                var re=/url.*\)/;
                var img=re.exec(background)[0];
                $(obj2).eq(id).css("background","#fff "+img+" no-repeat 10px 30px");
            }


            $(obj3).hide();
            $(obj3).eq(id).show();
            $(obj5).hide();
            $(obj4).show();
            $(obj6).stop();
            $(obj6).animate({width: div_w}, 400);


        });

    },
    clickshow7:function(ref,sel1,sel2,cl)
    {
        var category=this.refs[ref];
        var $category=$(category);
        var id;
        var obj1=$category.find(sel1);
        var obj2=$category.find(sel2);
        $(obj1).click(function() {
            id=$(obj1).index($(this));
            var re=/url.*\)/;
            var background=null;
            var img;

            $(obj1).removeClass(cl);
            if($(obj1).css("background")!=''&&$(obj1).css('background')!==null)
                background=$(obj1).css("background");
            else if($(obj1).css("background-image")!=''&&$(obj1).css('background-image')!==null)
                background = $(obj1).css('background-image');
            else
            {}
            img=re.exec(background)[0];
            $(obj1).css("background",""+img+" no-repeat 10px 30px");


            if($(obj1).eq(id).css("background")!=''&&$(obj1).eq(id).css('background')!=null)
                background=$(obj1).eq(id).css("background");
            else if($(obj1).eq(id).css("background-image")!=''&&$(obj1).eq(id).css('background-image')!=null)
            {
                background=$(obj1).eq(id).css("background-image");
            }
            else{}
            img=re.exec(background)[0];
            $(obj1).eq(id).addClass(cl);
            $(obj1).eq(id).css("background","#fff "+img+" no-repeat 10px 30px");
            $(obj2).hide();
            $(obj2).eq(id).show();
        });
    },
    closeCb: function () {
        var ref = this.refs.sidebar;


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

        var data$initialed;
        var data;
        if(this.props.data!==undefined&&this.props.data!==null)
        {
            data = this.props.data;
            data$initialed=true;
        }

        var auto;
        if(this.props.auto!==undefined&&this.props.auto!==null)
            auto=this.props.auto;


        return ({data: data, data$initialed: data$initialed, auto: auto, _todos: null});
    },
    componentWillReceiveProps(props){
      var ob;
        if(this.props.data!==props.data)
        ob.data=props.data;
        this.setState(ob);
    },
    render:function(){
        if(this.state.data$initialed!==true&&(this.props.data==null||this.props.data==undefined))
        {
            if(this.state.auto==true)
                this.fetch();
            return (<div></div>)

        }else{

            var susp_nav;
            var susp_show;
            if(this.state.data!==undefined&&this.state.data!==null)
            {
                var suspends=new Array();
                var showNavs=new Array();
                var showContents=new Array();
                var state = this.state;
                state.data.map(function (item, i) {

                    var background = "url('" + App.getResourceDeployPrefix() + item.img + "') no-repeat 10px 30px";
                    /**
                     * 外围悬浮菜单
                     *
                     */
                    var sus_li_style={background:background};
                    suspends.push(
                        <li key={i} style={sus_li_style}
                                      className={"sus_li"}>
                        <span style={{marginLeft:"20px"}}>{item.label}</span>
                    </li>);
                    var sus = "sus_li sus" + " " + i;
                    var sus_li_sus = {sus: sus};
                    /**
                     * 悬浮展开菜单
                     */
                    showNavs.push(
                        <li className={sus} key={i} style={sus_li_style}>
                            <span style={{marginLeft:"20px"}}>{item.label}</span>
                        </li>);

                    //TODO:add component match,first check component type
                    var ctrl = null;
                    switch (item.type) {
                        case 'Panel':
                            console.log('panel in scalebar');
                            ctrl = <Panel bean={item.content.bean}
                                          auto={item.content.auto}
                                          autoComplete={true}
                                          highLight={item.content.highLight}
                                          title={item.content.title}
                                >
                            </Panel>
                            break;
                        case 'Horizontal':
                            ctrl = <Horizontal query={item.content.query}
                                          auto={item.content.auto}
                                          highLight={item.content.highLight}>
                            </Horizontal>
                            break;
                        case 'password':
                            ctrl = <Password title={item.content.title} action={item.content.action}/>
                            break;
                        case 'Attention':
                            var _todos = null;
                            if (state._todos !== undefined && state._todos !== null)
                                _todos = state._todos;
                            ctrl = <Attention {...item.content} data={_todos}/>
                            break;
                        case 'News':
                            ctrl=<News
                                    query={item.content.query}
                                    auto={true}
                                    width={item.content.width}
                                    marginTop={item.content.marginTop}
                                />;
                            break;
                        case 'IFrame':
                            ctrl=<IFrame
                                    src={item.content.src}
                                    data={item.content.data}
                                    width={item.content.width}
                                    height={item.content.height}
                                />
                            break;
                        case 'Zoomer':
                            ctrl=<Zoomer
                                    auto={item.content.auto}
                                    width={item.content.width}
                                    height={item.content.height}
                                    style={item.content.style}
                                />
                            break;
                        default:
                            ctrl = item.content;
                            break;
                    }
                    showContents.push(
                        <div className="susp_r" style={{display: "block",paddingLeft:"10%",paddingTop:"20px"}} key={i}>
                            {ctrl}
                        </div>
                    );

                });

                susp_nav = <div className="suspend susp_nav" id="suspend" style={{width:"60px", display:"block"}}>
                            <ul>
                                {suspends}
                            </ul>
                        </div>

                susp_show=
                    <div className="susp_show" style={{width:"0px"}}>
                        <div className="susp_l susp_nav">
                            <ul>
                                {showNavs}
                            </ul>
                        </div>
                        {showContents}
                        <div style={{position:"absolute",bottom:"20px",right:"20px"}}>
                            <button className="btn_close btn-danger" style={{width:"140px",border:"0px"}}> 关闭</button>
                        </div>
                    </div>
            }


            return (
                <div className="sidebar" ref="sidebar">
                    {susp_nav}
                    <div id="fadee" className="shade" ></div>
                    {susp_show}
                </div>
            )


        }
    },
    componentDidUpdate:function(){
        this.clickshow6("sidebar",".susp_nav>ul>li",".susp_show .susp_l li.sus",".susp_show .susp_r","#fadee","#suspend",".susp_show","hover");

        this.clickshow7("sidebar",".susp_show .susp_l li.sus",".susp_show .susp_r","hover");

        this.clickhide3("sidebar",".btn_close","#fadee",".susp_show","#suspend");
    },
    componentDidMount:function(){

        //add event changeListener
        SyncStore.addChangeListener(this._onChange);
        //add devote listner
        SyncStore.addDevoteListener(this._onDevote);


        var category=this.refs.sidebar;
        var $category=$(category);
        var fadee=$category.find("#fadee");
        var susp_show=$category.find(".susp_show");
        var suspend=$category.find("#suspend");
        var sidebar$li=$category.find(".sidebar li");
        console.log();
        console.log();
        $(fadee).click(function() {

            $(fadee).hide();
            $(susp_show).animate({width:0}, 100);
            $(suspend).show();
            $(sidebar$li).removeClass("hover");
            var lis=$category.find(".susp_show .sus_li.sus");
            lis.map(function(i,li) {
                var background=null;
                if($(li).css('background')!=''&&$(li).css('background')!=null)
                    background = $(li).css('background');
                else if($(li).css('background-image')!=''&&$(li).css('background-image')!=null)
                    background = $(li).css('background-image');
                else
                {}
                var re=/url.*\)/;
                var img=re.exec(background)[0];
                $(li).css("background",""+img+" no-repeat 10px 30px");
            });
        });

        $(suspend).mouseover(function() {
            $(this).stop();
            $(this).animate({width: "140px"}, 400);
        });
        $(suspend).mouseout(function(){
            $(this).stop();
            $(this).animate({width: "60px"}, 400);
        });

        this.clickshow6("sidebar",".susp_nav>ul>li",".susp_show .susp_l li.sus",".susp_show .susp_r","#fadee","#suspend",".susp_show","hover");

        this.clickshow7("sidebar",".susp_show .susp_l li.sus",".susp_show .susp_r","hover");

        this.clickhide3("sidebar",".btn_close","#fadee",".susp_show","#suspend")
    },
    componentWillUnmount: function () {
        //remove event changeListener
        SyncStore.removeChangeListener(this._onChange);
        SyncStore.removeDevoteListener(this._onDevote);
    }
});

module.exports = ScaleBar;