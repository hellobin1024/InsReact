import React from 'react';
import {render} from 'react-dom';
import '../../css/components/basic/tab.css';
import PanelTable from '../compounds/panelTable/PanelTable.jsx';
import Panel from '../../components/panel/Panel.jsx';
import OrdinaryTable from '../../components/forms/OrdinaryTable.jsx';
import EmbedTable from '../../components/forms/EmbedTable.jsx';
import Horizontal from '../../components/basic/Horizontal.jsx';
import Task from '../../components/basic/Task.jsx';
import Zoomer from '../../components/basic/Zoomer.jsx';
import IFrame from '../../components/basic/IFrame.jsx';


var Tab=React.createClass({
    recurseDataTab : function (leaf_key, global, in$param, out$param1, out$param) {
        if (in$param !== undefined && in$param !== null) {
            var dataTabCb = this.dataTabCb;
            var recurseDataTab = this.recurseDataTab;
            in$param.map(function (item, i) {
                console.log();
                console.log();
                console.log();
                if (item[leaf_key] == undefined || item[leaf_key] == null)//叶结点
                {
                    var comp = item.comp;
                    var entity = null;
                    switch (comp.name) {
                        case "PanelTable":
                            entity = <PanelTable
                                bean={comp.bean}
                                autoComplete={comp.autoComplete}
                                query={comp.query}
                                filterField={comp.filterField}/>
                            break;
                        case "Panel":
                            console.log('....');
                            console.log('....');
                            console.log('....');
                            entity = <Panel
                                bean={comp.bean}
                                autoComplete={comp.autoComplete}
                                auto={comp.auto}
                                title={comp.title}

                                />
                            break;
                        case "OrdinaryTable":
                            entity = <OrdinaryTable/>
                            break;
                        case "Horizontal":
                            entity=<Horizontal
                                query={comp.bean}
                                auto={comp.auto}
                                highLight={true}
                                />
                            break;
                        case "EmbedTable":
                            entity = <EmbedTable
                                data={comp.data}
                                embedCols={comp.embedCols}/>
                            break;
                        case "Task":
                            entity = <Task
                                data={comp.data}
                                width="980px"
                                />
                            break;
                        case "Zoomer":
                            console.log('zoomer');
                            entity = <Zoomer
                                src={comp.data}
                                />
                            break;
                        default:
                            entity = <div></div>
                            break;
                    }

                    if (out$param.comp == undefined || out$param.comp == null)
                        out$param.comp = new Array();
                    out$param.comp.push(<div key={global.index} data-index={parseInt(global.index)}
                                             style={{display:"none",width:"100%"}}>
                        {entity}
                    </div>);

                    out$param1.push(
                        <li key={i}>
                            <a href="#" className="auto" onClick={dataTabCb} data-index={global.index++}
                               data-leaf={true}>
                                <i className="fa fa-angle-right text-xs"></i>
                                {item.name}
                            </a>


                    </li>);
                } else {
                    var lis = new Array();
                    recurseDataTab(leaf_key, global, item[leaf_key], lis, out$param);
                    out$param1.push(<li key={i} data-index={i}>
                        <a onClick={dataTabCb} href="#" className="auto">
                            <i className=" text"></i>
                            <i className=" text-active"></i>
                            <i className=" text-xs"></i>
                            {item.name}
                        </a>
                        <ul style={{display:"none"}} className="nav dk text-sm">
                            {lis}
                        </ul>
                    </li>);

                }
            });
        }
    },
    recurse        : function (leaf_key, global, in$param, out$param, fieldFlag) {
        if (in$param !== undefined && in$param !== null) {
            in$param.map(function (item, i) {
                if (item[leaf_key] == null || item[leaf_key] == undefined)//已选叶结点
                {
                    out$param.push(
                        <div key={global.index++}>
                            {state.customizing == true ?
                                <Image link={source.link}
                                       src={source.src}
                                       type={source.type}
                                       checkCb={check}/> : <Image link={source.link}
                                                                  src={source.src}/>}
                        </div>);
                    if (item[fieldFlag] == true || item[fieldFlag] == "true")
                        this.state[fieldFlag].push(global.index++);
                } else {
                    this.recurse(leaf_key, global, item[leaf_key], out$param);
                }
            });
        }
    },
    tabCb:function(evt){
        var target=evt.target;
        var $target=$(target);
        var index = $target.attr("data-index");
        var $dataTabs=$(this.refs["dataTabs"]);
        var dataTabs = $dataTabs.children("div");
        for (var i = 0; i < dataTabs.length; i++) {

            var $dataTab=$(dataTabs[i]);
            if(i==index) {
                $dataTab.slideDown();
            }else{
                $dataTab.css("display", "none");
            }
        }
        this.setState({selected: index});
    },
    dataTabCb      : function (evt) {
        var target = evt.target;
        var $target = $(target);
        var leaf = $target.attr("data-leaf");
        if (leaf != undefined && leaf != null && (leaf == true || leaf == "true"))//叶结点的tab
        {
            var index = parseInt($target.attr("data-index"));
            var vice = $(this.refs["dataTabs"]).children("div")[this.state.selected];
            var components = $(vice).children(".comp").children("div");
            for (var i = 0; i < components.length; i++) {
                var component = components[i];
                var $comp = $(component);
                if (i == index) {
                    continue;
                }
                else {
                    $comp.css("display", "none");
                }
            }
            var component = components[index];
            var $comp = $(component);
            $comp.slideDown();
        } else {//非叶结点tab
            var $ul = $target.parent("li").children("ul");
            $ul.slideDown();
        }

    },
    getInitialState: function () {
        return ({selected: 0, secondSelected: -1});
    },
    render:function(){
        var tabs=new Array();
        var dataTabs = new Array();
        var tabCb=this.tabCb;
        var state=this.state;
        var recurseDataTab = this.recurseDataTab;
        if (this.props.data !== undefined && this.props.data !== null) {
            var props = this.props;
            this.props.data.map(function (first, i) {
                var dataTab = new Object();
                //一级tab
                tabs.push(
                    <li className={state.selected==i?"active":""} onClick={tabCb} key={i} data-index={i}>
                        {first.name}
                    </li>);
                //TODO:wjj
                if (first.comp !== undefined && first.comp !== null) {
                    var comp = first.comp;
                    var entity = null;
                    switch (comp.name) {
                        case "PanelTable":
                            entity = <PanelTable
                                bean={comp.bean}
                                autoComplete={comp.autoComplete}
                                query={comp.query}
                                filterField={comp.filterField}/>
                            break;
                        case "Horizontal":
                            entity=<Horizontal
                                query={comp.bean}
                                auto={comp.auto}
                                highLight={true}
                                width={comp.width}
                                title={comp.title}
                                marginLeft={comp.marginLeft}
                                paddingLeft={comp.paddingLeft}
                                />
                            break;
                        case "Panel":
                            entity = <Panel
                                bean={comp.bean}
                                autoComplete={comp.autoComplete}
                                title={comp.title}
                                auto={comp.auto}
                                highLight={comp.highLight}
                                paddingLeft={comp.paddingLeft}
                                />
                            break;
                        case "OrdinaryTable":
                            entity = <OrdinaryTable/>
                            break;
                        case "EmbedTable":
                            entity = <EmbedTable
                                data={comp.data}
                                embedCols={comp.embedCols}
                                checkCb={props.checkCb}/>
                            break;
                        case "Task":
                            entity = <Task
                                data={comp.data}
                                width="980px"
                                highLight={props.highLight}
                                gradient={props.gradient}
                                />
                            break;
                        case "Zoomer":
                            entity = <Zoomer
                                src={comp.data}
                                auto={comp.auto}
                                />
                            break;
                        case 'IFrame':
                            entity=<IFrame src={comp.data}
                                           category={comp.category}
                                           width={comp.width}
                                           auto={comp.auto}/>
                            break;
                        default:
                            entity = <div></div>
                            break;
                    }
                    dataTabs.push(
                        <div key={i} style={{display:state.selected==i?"block":"none"}} claseName="balabala">
                            {entity}
                        </div>
                    );
                } else {
                    var global = new Object();
                    global.index = 0;
                    var out$param1 = new Object();
                    out$param1.tab = new Array();
                    recurseDataTab("sub", global, first.sub, out$param1.tab, dataTab);
                    dataTabs.push(
                        <div key={i} style={{display:"none",width:"100%",height:"700px"}}>
                            <div className="bg-dark bk nav-xs" style={{backgroundColor:"rgb(77, 93, 110)"}}>
                                <div className="nav-primary">
                                    <ul className="nav" data-ride="collapse">
                                        {out$param1.tab}
                                    </ul>
                                </div>
                            </div>
                            <div className="comp" style={{width:"100%"}}>
                                {dataTab.comp}
                            </div>
                        </div>
                    );
                }

            });
        }

        var style = {};
        if (this.props.height !== undefined && this.props.height !== null)
            style = Object.assign(style, {height: this.props.height});
        if (this.props.width !== undefined && this.props.width !== null)
            style = Object.assign(style, {width: this.props.width});
        var highLight=this.props.highLight;
        var gradient=this.props.gradient;
        //<div className={{this.props.hightlight==true?"Tab hightlist":this.props.gradient==true?"Tab gradient":"Tab"}}>
        return (<div className={highLight==true?"Tab highLight":gradient==true?"Tab gradient":"Tab"} style={style}>
            <div className="tab">
                <ul style={{marginRight:"10%"}}>
                              {tabs}
                          </ul>
                    </div>
            <div ref="dataTabs" className="data-tab" style={{height:"100%"}}>
                        {dataTabs}
                    </div>
               </div>)
    }
});
module.exports = Tab;
