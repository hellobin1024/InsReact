import React from 'react';

/**
 *
 * LiElement
 * 1.prop expand={true|false},仅当父组件为多层列表时使用,表明列表本层级是否展开
 * 2.prop head={true|other},仅当父组件为多层级列表时使用,表明该LiElement为列表该层级的第一子项
 * 3.prop title,列表项标题
 * 4.data-pos,列表在一级数据的序号
 * 5.data-index,列表在二级数据的序号
 * 6.clickCb,过滤回调的react组件
 */
var LiElement=React.createClass({
    clickCb:function(evt){
        var target=this.refs.host;
        this.props.clickCb(target);
    },
    render:function(){
        var span;
        var spanStyle={float:"right"};
        //head option can be optional
        if(this.props.head!==undefined&&this.props.head!==null)
        {
            if(this.props.head==true)
            {

                if(this.props.expand==true)
                {
                    span=<span className="glyphicon glyphicon-menu-up" style={spanStyle}
                               aria-hidden="true">
                    </span>
                }
                else if(this.props.expand==false){
                    span=<span className="glyphicon glyphicon-menu-down" style={spanStyle}
                               aria-hidden="true">
                    </span>
                }
                else{}
            }
        }



        return(
            <li className={this.props.className} onClick={this.clickCb}
                   data-pos={this.props["data-pos"]} data-index={this.props["data-index"]} ref="host" link={this.props.link}>
            {span}
            {this.props.title}
            {this.props.children}
        </li>);

    }
});
export default LiElement;