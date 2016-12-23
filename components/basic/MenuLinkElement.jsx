import React from 'react';

var MenuLinkElement=React.createClass({
    clickCb:function(){
        if(this.props.selectCb!==undefined&&this.props.selectCb!==null)
        {
            if(this.props[data-index]!==undefined&&this.props[data-index]!==null&&!isNaN(parseInt(this.props["data-index"])))
                this.props.selectCb({title:this.props.title,index:this.props["data-index"]});
            else
                this.props.selectCb({title:this.props.title});
        }

    },
    render:function(){
        return (
            <li>
                <a href={this.props.link} onClick={this.clickCb}>
                    {this.props.title}
                </a>
            </li>);
    }
})

export default MenuLinkElement