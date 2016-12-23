import React from 'react';



var LinkElement=React.createClass({
    clickCb:function(evt){
        if(this.props.linkCb!==undefined&&this.props.linkCb!==null)
        {
            this.props.linkCb(evt);
        }

    },
    render:function(){
        var data$index;
        if(this.props["data-index"]!==null&&this.props["data-index"]!==undefined)
            data$index=this.props["data-index"];

        //link,上层组件传来的超链
        var link;
        if(this.props.to!==undefined&&this.props.to!==null)
            link=this.props.to;
        else
            link="javascript:void(0)";

        var alignStyle;
        if(this.props.align!==undefined&&this.props.align!==null)
            alignStyle={
                textAlign:this.props.align
            }


        var query;
        if(this.props["data-query"]!==undefined&&this.props["data-query"]!==null)
        {
            query=this.props["data-query"];
        }


        return (<a href={link}  className={this.props.linkClass} data-index={data$index}
                   onClick={this.clickCb} style={Object.assign({marginRight:"20px"},alignStyle)} data-query={query} data-comp={this.props["data-comp"]}>
            {this.props.children}</a>)
    }
});

export default LinkElement;