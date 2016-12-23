import React from 'react';
import {render} from 'react-dom';
import Trans from '../../data/json/translation.json';
import Tab from '../../components/basic/Tab.jsx';
import Image from '../../components/basic/Image.jsx';
var ProxyQ = require("../../components/proxy/ProxyQ");
import '../../css/components/basic/customMenu.css';
/**
 * 1.downLimit,订制菜单数的最小下限
 * 2.upLimit,订制菜单数的最大上限
 * 3.recurse,递归循环,同时生成已选和未选2棵树
 * 4.customButton按钮关闭后,数据不再次刷新的原因
 */

var CustomMenu = React.createClass({
    recurseUnSelected  : function (leaf_key, in$param, out$param) {//将多级菜单形成2级菜单
        if (in$param !== null && in$param !== undefined) {
            var recurseUnSelected = this.recurseUnSelected;
            in$param.map(function (item, i) {
                if (item[leaf_key] !== undefined && item[leaf_key] !== null)//非叶结点
                {
                    recurseUnSelected(leaf_key, item[leaf_key], out$param);
                }
                else {//叶结点
                    var leaf = "{link:'',src:'" + "/images/function4.png" + "',type:'check',icon:'add',name:'" + item.name + "'," +
                        "id:'" + (item.id !== undefined && item.id !== null ? item.id : -1) + "'}|image";
                    out$param.push({menu: leaf});
                }
            });
        }
    },
    groupUnSelected    : function (leaf_key, in$param, out$param) {//就第一层导航进行分组
        if (out$param.tab == undefined || out$param.tab == null)
            out$param.tab = new Array();
        var recurseUnSelected = this.recurseUnSelected;
        in$param.map(function (first, i) {
            var tab = new Object();
            tab.name = first.name;
            tab.comp = new Object();
            tab.comp.name = "EmbedTable";
            tab.comp.embedCols = 4;
            tab.comp.data = {
                arr: [{
                    filterField: "menu",
                    border     : "none",
                    data       : []
                }
                ]
            };
            recurseUnSelected("sub", first[leaf_key], tab.comp.data.arr[0].data);
            out$param.push(tab);
        });

    },
    countLeaf          : function (leaf_key, in$param, out$param) {
        var countLeaf = this.countLeaf;
        in$param.map(function (node, i) {
            if (node[leaf_key] == undefined || node[leaf_key] == null) {
                out$param.count++;
            } else {
                countLeaf(leaf_key, node[leaf_key], out$param);
            }
        });
    },
    recurseSelectedMenu: function (leaf_key, global, in$param, out$param, selectEnable) {
        if (in$param !== undefined && in$param !== null) {
            var state = this.state;
            var recurseSelectedMenu = this.recurseSelectedMenu;
            in$param.map(function (item, i) {
                if (item[leaf_key] == undefined || item[leaf_key] == null) {
                    //增加已选中菜单的回调事件
                    var checkCb = function (ob) {
                        if (ob == true || ob == "true") {
                            console.log();
                            console.log();
                            console.log();
                            console.log();
                            state.menu[item.id] = false;
                        } else {
                            delete state.menu[item.id];
                        }
                    };
                    if (selectEnable == true) {
                        out$param.push(
                            <div key={global.index++}
                                 style={{position:"relative",paddingBottom:"15px",display:"inline-block",marginLeft:"30px"}}>
                                {state.customizing == true ?
                                    <Image link={item.link}
                                           src="/images/function4.png"
                                           id={item.id}
                                           type="check"
                                           checkCb={checkCb}
                                        /> : <Image link={item.link}
                                                    src="/images/function4.png"/>}
                            <span
                                style={{position:"absolute",color:"#fff",marginLeft:"-40px"}}>{item.name}</span>
                            </div>);
                    } else {
                        out$param.push(
                            <div key={global.index++}
                                 style={{position:"relative",paddingBottom:"15px",display:"inline-block",marginLeft:"30px"}}>
                                <Image link={item.link}
                                       src="/images/function4.png"/>
                            <span
                                style={{position:"absolute",color:"#fff",marginLeft:"-40px"}}>{item.name}</span>
                            </div>);
                    }
                }
                else {
                    recurseSelectedMenu(leaf_key, global, item[leaf_key], out$param, selectEnable);
                }
            });
        }
    },
    unselectedCb       : function (ob) {//已选中菜单的增加点击行为
        if (ob !== undefined && ob !== null) {
            var state = this.state;
            if (!isNaN(ob.index) && ob.checked !== undefined && ob.checked !== null) {
                if (ob.selected == true) {
                    state.menu[ob.index] = true;
                } else {
                    delete state.menu[ob.index];
                }
            }
        }

    },
    customCb           : function (evt) {//从服务器拉回菜单
        var customModal = this.refs["custom_modal"];
        var $customModal = $(customModal);
        var display = $customModal.css("display");
        if (display == "none") {
            this.setState({customizing: true});
            $customModal.modal("show");
        }
        else {

            $customModal.modal("hide");
        }

    },
    applyCb            : function (evt) {//定制按钮的提交
        var customModal = this.refs["custom_modal"];
        var $customModal = $(customModal);
        if (this.props.apply !== undefined && this.props.apply !== null) {
            var params = this.props.apply.params;
            if (this.state.menu == undefined && this.state.menu == null) {
                $customModal.modal("hide");
                return;
            }
            var menus = new Array();
            for (var index in this.state.menu) {
                menus.push({id: parseInt(index), selected: this.state.menu[index]});
            }
            params.menu = JSON.stringify(menus);
            ProxyQ.queryHandle(
                null,
                this.props.apply.url,
                params,
                'json',
                function (response) {
                    $customModal.modal("hide");
                    this.fetch();
                }.bind(this)
            );
        }
        else
            $customModal.modal("hide");
    },
    cancelCb           : function () {
        var customModal = this.refs["custom_modal"];
        var $customModal = $(customModal);
        $customModal.modal("hide");
        this.fetch();
    },
    fetch          : function () {
        ProxyQ.queryHandle(
            null,
            this.props.query.url,
            this.props.query.params,
            'json',
            function (response) {
                var ob = new Object();
                if (response.data !== undefined && response.data !== null) {
                    if (response.data.selected !== undefined && response.data.selected !== null && response.data.selected.length > 0)
                        ob.selected = response.data.selected;
                    if (response.data.unselected !== undefined && response.data.unselected !== null && response.data.unselected.length > 0)
                        ob.unselected = response.data.unselected;
                }
                ob.data$initialed = true;
                ob.customizing = false;
                this.setState(ob);
            }.bind(this)
        )

    },
    getInitialState: function () {
        var data;
        var data$initialed;
        if (this.props.data !== undefined && this.props.data !== null) {
            data = this.props.data;
            data$initialed = true;
        }
        else
            data$initialed = false;


        var menu = new Object();
        return ({
            downLimit     : 4,
            upLimit       : 8,
            data          : data,
            data$initialed: data$initialed,
            customizing   : false,
            menu: menu
        });
    },
    componentWillReceiveProps: function (props) {
        var ob = new Object();
        if (Object.prototype.toString.call(props.data) == "[object Array]") {
            ob.data = props.data;
        }
        this.setState(ob);
    },
    render         : function () {

        if (this.state.data$initialed !== true) {
            if (this.props.auto == true)
                this.fetch();

            return (
                <div></div>
            )

        } else {
            var selectedMenus = null;
            var unselectedMenus = new Object();
            var candidateMenus = null;
            unselectedMenus.arr = null;
            var customButton =
                <div key={-1}>
                    <div className="menu_custom">
                        <div className="functionalAreas">
                            <a href="javascript:void(0)" onClick={this.customCb}>
                                <i className="fa fa-cogs icon-switcher" style={{background:"transparent"}}></i>
                            </a>
                        </div>
                    </div>
                </div>

            if (this.state.data$initialed !== true) {
                if (this.props.auto == true || this.props.auto == "true")
                    this.fetch();
            } else {
                var unselectedCb = this.unselectedCb;
                var state = this.state;
                var global = new Object();
                global.index = 0;
                //搜集已选中菜单
                if (state.selected !== undefined && state.selected !== null && Object.prototype.toString.call(state.selected) == '[object Array]' && state.selected.length > 0) {
                    selectedMenus = new Array();
                    this.recurseSelectedMenu("sub", global, state.selected, selectedMenus, false);
                    candidateMenus = new Array();
                    this.recurseSelectedMenu("sub", global, state.selected, candidateMenus, true);
                }
                if (state.customizing == true) {
                    unselectedMenus.arr = new Array();
                    //搜集未选中菜单形成tab组件数据
                    if (state.unselected !== undefined && state.unselected !== null && Object.prototype.toString.call(state.unselected) == '[object Array]' && state.unselected.length > 0) {
                        this.groupUnSelected("sub", state.unselected, unselectedMenus.arr);
                    }
                }

                var countOb = new Object();
                countOb.count = 0;
                if (state.selected !== undefined && state.selected !== null) {
                    this.countLeaf("sub", state.selected, countOb);
                }
                return <div className="customMenu">
                    <div className="bottom">
                        <div>
                            {customButton}
                            <div style={{paddingLeft:"100px"}} className="selected">{selectedMenus}</div>
                        </div>
                        <div className="modal fade" ref="custom_modal" style={{display:"none"}}>
                            <div className="modal-dialog" style={{width:"980px"}}>
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="close" data-dismiss="modal"
                                                onClick={this.cancelCb}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                        <h4 className="modal-title" style={{textAlign:"left"}}>
                                            定制常用功能
                                        </h4>
                                        <h5 style={{textAlign:"right",marginRight:"7%"}}>您已选择了{countOb.count}个功能</h5>
                                    </div>
                                    <div className="modal-body" style={{padding:"15px"}}>
                                        <div className="uncandidate box">
                                            {candidateMenus}
                                        </div>
                                        <Tab
                                            data={unselectedMenus.arr}
                                            checkCb={unselectedCb}
                                            />
                                    </div>
                                    <div className="modal-footer" style={{borderTop:"0px"}}>
                                        <button type="button" className="btn btn-default" data-dismiss="modal">取消
                                        </button>
                                        <button type="button" className="btn btn-primary" onClick={this.applyCb}>提交更改
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            }

        }
    }
});
module.exports = CustomMenu;