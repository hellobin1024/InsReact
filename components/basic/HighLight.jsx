import React from 'react';
import {render} from 'react-dom';
import Panel from '../panel/Panel.jsx';
import OrdinaryTable from '../forms/OrdinaryTable.jsx';
import Horizontal from '../basic/Horizontal.jsx';
var config=require('../../config.json');
import '../../css/components/basic/highLight.css';
var ProxyQ=require('../proxy/ProxyQ');


var HighLight = React.createClass({

    openWin:function(url){
        console.log('url=' + url);
        window.open(window.App.getAppRoute()+url);
    },

    render           : function () {
        var component = null;
        if (this.props.type !== undefined && this.props.type !== null) {
            var arr = this.props.type.split("|");
            if (arr.length >= 2)//如果为并列布局
            {
                var horiz = new Array();
                var comps = this.props.comps;
                arr.map(function (item, i) {
                    console.log("type===" + item);
                    switch (item) {
                        case "panel":
                            //70%
                            var paddingLeft = null;
                            if (comps[i].paddingLeft !== undefined && comps[i].paddingLeft !== null)
                                paddingLeft = comps[i].paddingLeft;
                            component =
                                <div style={{display:"inline-block",width:comps[i].width,float:"left"}} key={i}>
                                    <Panel
                                        title={comps[i].title}
                                        autoComplete={true}
                                        data={comps[i].data}
                                        highLight={true}
                                        paddingLeft={paddingLeft}
                                        />
                                </div>
                            break;
                        case "ordinaryTable":
                            //10%
                            component =
                                <div style={{display:"inline-block",width:comps[i].width,marginTop:"30px"}} key={i}>
                                    <OrdinaryTable
                                        highLight={true}
                                        title={comps[i].title}
                                        query={comps[i].query}
                                        autoFetch={true}
                                        filterField={comps[i].filterField}
                                        width="10%"
                                        display="inline-block"
                                        />
                                </div>
                            break;
                        case "horizontal":
                            component =
                                <div style={{display:"inline-block",width:comps[i].width,marginTop:"22px"}} key={i}>
                                    <Horizontal
                                        query={comps[i].query}
                                        auto={true}
                                        width="10%"
                                        display="inline-block"
                                        highLight={true}
                                        />
                                </div>
                            break;
                        default:
                            component = <div key={i}>
                                <table >
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                            break;
                    }
                    horiz.push(component);
                });
                component = <div>{horiz}</div>
            } else {
                switch (this.props.type) {
                    case "Panel":
                        component = <Panel
                            title={this.props.title}
                            autoComplete={true}
                            bean={this.props.bean}
                            query={this.props.query}
                            />
                        break;
                    case "OrdinaryTable":

                        console.log('...');
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
                        component =
                            <div>
                                <div >
                                    <iframe src={proxyServer+"/register/register_information.do"}  style={{border:"0px"}} frameBorder="0" width="980px" height="620px"></iframe>
                                </div>
                            </div>

                        break;
                    default:
                        component = <table >
                            <tbody>
                            </tbody>
                        </table>
                        break;
                }
            }

        }

        var folding = null;
        if (this.props.folding !== false) {
            folding = <div className="right" style={{width:"10%",float:"right",height:"100%"}}>
                <div className="menu on">
                    <i></i>
                    <i></i>
                    <i></i>
                </div>
            </div>
        }

        return (
            <div className="highLight" style={{height:"440px",position:"relative"}} ref="highLight">
                <div className="left"
                     style={{left:"11%",width:"80%",position:"absolute",float:"left",height: "100%",textAlign:"center"}}>
                    <div className="component">
                        {component}
                    </div>
                </div>
            </div>);
    },
    componentDidMount: function () {


        var $highLight = $(this.refs.highLight);
        $highLight.find(".menu").click(function () {
            $(this).toggleClass("on");
            $highLight.find(".component").fadeToggle();
            if (!$(this).hasClass("on"))
                $highLight.animate({height: '40px'});
            else
                $highLight.animate({height: '620px'});
        });
    }
});
module.exports = HighLight;