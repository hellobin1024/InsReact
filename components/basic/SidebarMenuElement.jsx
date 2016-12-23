import React from 'react';
import '../../css/components/basic/SidebarMenuElement/sidebarMenu.css';

var SidebarMenuElement=React.createClass({
    clickCb:function(evt) {
        //非treeview列表项的点击事件
        var target=evt.target;
        var $target = $(target);
        var ob;
        if(target.nodeName==="A")
        {
            ob = $target.parent("li");
        }
        if(target.nodeName==="I")
            ob = $target.parent("a").parent("li");
        if(target.nodeName==="SPAN")
            ob=$target.parent("a").parent("li");
        var index = ob.attr("data-index");
        if(index!==undefined&&index!==null) {
            var url=".."+this.state.data[index].controller;
            console.log("url=" + url);
            $("#centerFrame").attr("src", url+"?userName="+this.state.query.params.userName);
        }
    },
    subClickCb:function(evt){
        //点击子菜单的回调函数
        var target=evt.target;
        var $target = $(target);
        var ob;
        if(target.nodeName==="A")
        {
            ob = $target.parent("li");
        }
        if(target.nodeName==="I")
            ob = $target.parent("a").parent("li");
        if(target.nodeName==="SPAN")
            ob=$target.parent("a").parent("li");
        var index = ob.attr("data-index");
        if(index!==undefined&&index!==null) {
            var url=".."+this.state.data[index].controller;
            console.log("url=" + url);
            $("#centerFrame").attr("src", url+"?userName="+this.state.query.params.userName);
        }


    }
    ,
    clickTreeCb:function(evt){
        //treeview列表项的点击事件
        var target=evt.target;
        var $target=$(target);
        var ob;
        if(target.nodeName==="A")
        {
            ob=$target.parent("li");
        }
        if(target.nodeName==="I")
        {
            ob=$target.parent("a").parent("li");
        }
        if(target.nodeName==="SPAN")
        {
            ob=$target.parent("a").parent("li");
        }

        var isActive = ob.hasClass('active');
        var menu=ob.children('.treeview-menu').first();
        var btn=ob.children('a').first();
        if(isActive) {
            //Slide up to close menu
            menu.slideUp();
            isActive = false;
            btn.children(".fa-angle-down").first().removeClass("fa-angle-down").addClass("fa-angle-left");
            btn.parent("li").removeClass("active");
        }else{
            menu.slideDown();
            isActive = true;
            btn.children(".fa-angle-left").first().removeClass("fa-angle-left").addClass("fa-angle-down");
            btn.parent("li").addClass("active");
        }


        var origin$left=ob.children("a").first().css("margin-left");
        menu.find("li > a").each(function() {
            var pad = parseInt(origin$left) + 10;
            $(this).css({"margin-left": pad + "px"});
        });

    },
    data$inital:function(){
        if(this.state.query!==undefined&&this.state.query!==null) {
            $.ajax({
                type: 'POST',
                url: this.state.query.url,
                dataType: 'json',
                data: this.state.query.params,
                cache: false,
                success: function(data) {
                    if(data!==undefined&&data!==null&&data.length>0) {
                        this.setProps({data: data, data$initialed: true})
                    }
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }
            });
        }

    },
    getInitialState:function(){
        var data;
        var data$initialed=false;
        if(this.props.data!==undefined&&this.props.data!==null) {
            data = this.props.data;
            data$initialed=true;
        }
        var query;
        var auto;
        var projName;
        if(this.props["data-options"]!==undefined&&this.props["data-options"]!==null) {
            var data$options=this.props["data-options"];
            if(data$options.query!==null&&data$options.query!==undefined)
            {
                query=data$options.query;
            }
            if(data$options.auto!==null&&data$options!==undefined)
                auto=data$options.auto;
            if(data$options.projName!==undefined&&data$options.projName!==null)
                projName=data$options.projName;
        }


        return ({
            data:data,projName:projName,auto:auto,query:query,data$initialed:data$initialed
        })

       },
    componentWillReceiveProps(props){
        if(props.data!==undefined&&props.data!==null) {
            this.setState({data:props.data,data$initialed:true});
        }

    },
    render:function(){


        if(this.state.data$initialed!==true)
        {
            if(this.state.auto===true)
            {
                this.data$inital();
            }
            return (<ul className="sidebar-menu">
                    </ul>);
        }else{//数据已经初始化
            var data;
            if(this.state.data!==undefined&&this.state.data!==null) {
                data=this.state.data;
            }
            var li$s;
            if(data!==undefined&&data!==null) {
                li$s=new Array();
                var proj=this.state.projName;
                var clickTreeCb=this.clickTreeCb;
                var un$tree$clickCb=this.clickCb;
                var subClickCb=this.subClickCb;
                data.map(function(item,i) {
                        var parent;
                        var parent$href=".."+item.controller;
                        var children;


                        children=new Array();
                        if (item.isLeaf == 0) {
                            //可展开列表项
                            if(item.pid!=-1)
                            {
                                data.map(function(child,j){
                                    if(child.pid==item.authorityId)
                                    {
                                        var href=".."+item.controller;
                                        children.push(
                                            <li key={j} data-index={j} onClick={subClickCb}>
                                                <a href="javascript:void(0)">
                                                <i className="fa fa-angle-double-right"></i>
                                                {child["authorityName"]}
                                            </a>
                                            </li>
                                        );
                                    }
                                });
                                parent= (
                                    <li className="treeview" key={i} onClick={clickTreeCb} >
                                    <a href="javascript:void(0)">
                                        <i className="fa fa-bar-chart-o"></i>
                                        <span>{item["authorityName"]}</span>
                                        <i className="fa fa-angle-left pull-right"></i>
                                    </a>
                                    <ul className="treeview-menu">
                                        {children}
                                    </ul>
                                </li>);
                                li$s.push(parent);
                            }else{//如果本列表项不是treeview
                                parent= (
                                    <li key={i} onClick={un$tree$clickCb} data-index={i}>
                                        <a href="javascript:void(0)">
                                            <i className="fa fa-th"></i>
                                            {item["authorityName"]}
                                        </a>
                                    </li>);
                                li$s.push(parent);
                            }

                        }

                    }
                )
            }


            return (
                <ul className="sidebar-menu">
                    {li$s}
                </ul>
            )
        }
    }
});

export default SidebarMenuElement;