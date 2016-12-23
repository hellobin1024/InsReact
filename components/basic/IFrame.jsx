import React from 'react';
import {render} from 'react-dom';
var ProxyQ=require('../proxy/ProxyQ');



let IFrame=React.createClass({
    fetch:function(){
        ProxyQ.queryHandle(
            null,
            '/bsuims/reactPageDataRequest.do',
            {
                reactActionName:'getTabInfoReact',
                reactPageName:'freshmanWelcomeWorkbenchRulePage',
                category:this.props.category
            },
            null,
            function(response){
                var ob={};
                if(response.campusNum!==undefined&&response.campusNum!==null)
                {
                    ob.campusNum=response.campusNum;
                    ob.synthesis=window.Deploy.getResourceDeployPrefix()+'/downloads/material_'+response.campusNum+this.props.category+'.html';
                }
                this.setState(ob);
            }.bind(this)
        );
    },
    getWidth:function(){
     return this.props.width!==undefined&&this.props.width!==null?this.props.width:"100%";
   },
    getHeight:function(){
        return this.props.height!==undefined&&this.props.height!==null?this.props.height:"100%";
    },
    getStyle:function(){
        return this.props.style;
    },
    getSrc:function(){
        let src=null;
        if(this.props.src!==undefined&&this.props.src!==null)
        {
            src=this.props.src;
            if(this.props.params!==null&&this.props.params!==undefined)
            {
                src += "?";
                for(let property in this.props.params)
                {
                    src+=property+'='+this.props.params[property];
                    src+='&';
                }
                src=src.substring(0,src.length-1);
            }
        }

        return src;
    },
    getInitialState:function(){
        var category=null;
        if(this.props.category!==undefined&&this.props.category!==null) {
            category=this.props.category;
        }
        return ({category:category,campusNum:null,synthesis:null});
    },
   render:function(){
       if(this.state.category!==undefined&&this.state.category!==null) {
           if (this.state.campusNum !== null && this.state.campusNum !== undefined)
           {
               return <iframe src={this.state.synthesis}
                              width={this.getWidth()}
                              height={this.getHeight()}
                              frameBorder="no"></iframe>
           }
           else{
               if (this.props.auto == true)
               {
                   this.fetch();
               }
               return (<div className="iframe"></div>);
           }
       }
       else{
           return <iframe src={this.getSrc()}
                          width={this.getWidth()}
                          height={this.getHeight()}
                          frameBorder="no"
                          style={this.getStyle()}></iframe>
       }
   }
});
module.exports=IFrame;