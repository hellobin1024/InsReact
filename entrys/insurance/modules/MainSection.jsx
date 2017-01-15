import React from 'react';
import {render} from 'react-dom';

import Nav from '../component/Navigator.jsx';
import MENU from '../data/menus.json';
import Footer from '../component/Footer.jsx';
import App from '../modules/App.jsx';
import MainPage from '../modules/MainPage.jsx';
import PersonalCenter from '../modules/PersonalCenter.jsx';
import Consultation from '../modules/Consultation.jsx'
import News from '../modules/News.jsx';
import AboutUs from '../modules/AboutUs.jsx';
import PersonInfo from '../modules/PersonInfo.jsx';
import LifeInsurance from '../modules/lifeInsurance.jsx';
import CarInsurance from '../modules/CarInsurance.jsx';
import lifeDetail from '../modules/lifeDetails.jsx';

var config=require('../../../config.json');
import '../../../css/insurancems/components/mainSection.css';
var SyncActions = require('../../../components/flux/actions/SyncActions');


var MainSection = React.createClass({
    iframeLoad:function(evt)
    {
        var target=evt.target;
        //$("#mainFrame").context.documentElement.scrollHeight
        var height=null;
        height=target.contentDocument.body.scrollHeight;
        target.height=height;
            //height=document.body.scrollHeight;
    },

    getInitialState: function () {
        var route = new Array();
        route.push(undefined);
        return ({route: route});
    },

    render:function(){
        var path=this.props.route.path;
        var ctrl;
        var breadcrumb;
        var label;
        var data=this.props.route.data;
        if(path!==undefined&&path!==null)
        {
            var route = this.state.route;
            if (route.length != 1)
                route.splice(0, 1);
            route.push(path);

            switch(path)
            {
                case window.App.getAppRoute() + "/":
                    ctrl = <App></App>;
                    label = "主页";
                    break;
                case window.App.getAppRoute() + "/mainPage":
                    ctrl = <MainPage></MainPage>;
                    label = "主页";
                    break;
                //case window.App.getAppRoute() + "/lifeDetail":
                //    ctrl = <lifeDetail></lifeDetail>;
                //    label = "寿险详情";
                //    break;
                case window.App.getAppRoute() + "/news":
                    //ctrl = <News query={{
                    //                         url:"/bsuims/reactPageDataRequest.do",
                    //                        params:{
                    //                            reactPageName:"groupNewsReactPage",
                    //                            reactActionName:"listTypeNewsUseReact"
                    //                        }
                    //                     }}
                    //             auto={true}/>;
                    //label = "新闻查询业务";
                    //break;
                    ctrl = <News></News>;
                    label = "新闻资讯";
                    break;
                case window.App.getAppRoute() + "/personalCenter":
                    ctrl = <PersonalCenter></PersonalCenter>;
                    label = "个人中心";
                    break;
                case window.App.getAppRoute() + "/consult":
                    ctrl = <Consultation></Consultation>;
                    label = "业务咨询";
                    break;
                case window.App.getAppRoute() + "/aboutUs":
                    ctrl = <AboutUs></AboutUs>;
                    label = "关于我们";
                    break;
                case window.App.getAppRoute() + "/personInfo":
                    ctrl = <PersonInfo></PersonInfo>;
                    label = "关于我们";
                    break;
                case window.App.getAppRoute() + "/lifeInsurance":
                    ctrl = <LifeInsurance></LifeInsurance>;
                    label = "关于我们";
                    break;
                case window.App.getAppRoute() + "/carInsurance":
                    ctrl = <CarInsurance></CarInsurance>;
                    label = "关于我们";
                    break;

                default:
                    var reg=/.*\.do.*[\.do|\.jsp]?.*/;

                    var re=reg.exec(path);
                    console.log('data===' + data);
                    console.log('origin path==='+path);
                    var proxyServer="";
                    if(window.App.getModel()=="debug")
                    {
                        if(window.App.getAppRoute()=="")
                        {
                            console.log('......');
                            var proxy=config.devServer.proxy;
                            for (var field in proxy)
                            {
                                var re = /\/(.*?)\//;
                                proxyServer= re.exec(field)[1];
                                break;
                            }
                        }
                        else if(window.App.getAppRoute().indexOf("/")!=-1)
                        {
                            var re = /^(\/.*?)\//;
                            proxyServer= re.exec(window.App.getAppRoute())[1];
                        }
                    }else{
                        proxyServer='';
                    }


                    if(re!==undefined&&re!==null)
                    {
                        //TODO:iframe component render
                        path=path.replace(window.App.getAppRoute(),"");
                        console.log('iframe in mainsection,path=' + path);
                        ctrl=
                            <iframe style={{width:"100%",position:"relative"}} id="mainFrame"
                                     frameBorder="0" scrolling="no" src={proxyServer+path+(data!=null&&data!==undefined?data:"")} onLoad={this.iframeLoad}
                                />

                    }else{

                    }
                    break;
            }

            var paths=path.split("/");
            var spans=new Array();
            if(paths[0]==""&&paths[1]=="")
            {
                spans.push(<span className="separator" key={0}>/</span>);
            }else{
                var k=0;
                paths.map(function(item,i) {
                    if(i==0)
                        spans.push(<span className="separator" key={k++}></span>);
                    else
                    {
                        spans.push(<span className="path-segment" key={k++}>{item}</span>);
                        if(i!==paths.length-1)
                            spans.push(<span className="separator" key={k++}>/</span>);
                    }

                });
            }
            breadcrumb =
                <div className="crumb_box">
                    <div className="crumb_title">
                        <span className="crumb_title_content">{spans}</span>

                        <div className="crumb_detail">{label}</div>
                    </div>
                </div>
        }

        //remove breadcrumb by zyy,yeah i am so native

        return (
            <div style={{margin: "0px auto 0 auto",width:"100%"}} className="baba">
                <div ref="mainSection" className="mainSection"
                     style={{display:"none",marginLeft:"auto",marginRight:"auto",marginBottom:"auto"}}>
                    <div style={{width:'100%'}}>
                        <Nav logo={window.App.getResourceDeployPrefix()+"/images/logo.png"} data={MENU} />
                    </div>
                    {ctrl}
                </div>

                <div className="footer"
                     style={{background:'url('+window.App.getResourceDeployPrefix()+'/images/footer.png) no-repeat',backgroundSize:'100%',
                        position:'fixed',bottom:'0',width:'100%',height:'5%'}}>
                    <Footer/>
                </div>
            </div>
        );


    },
    componentDidMount: function() {
        //TodoStore.addChangeListener(this._onChange);
        $(this.refs["mainSection"]).slideDown(300);
    },
    componentWillUnmount: function() {
        //TODO:emit change
        $(this.refs["mainSection"]).slideUp(300);
        //TodoStore.removeChangeListener(this._onChange);
    }
});
module.exports = MainSection;