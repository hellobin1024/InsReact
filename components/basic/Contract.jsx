import React from 'react';
import {render} from 'react-dom';
import Panel from '../panel/Panel.jsx';
import '../../css/components/basic/contract.css';

/**
 * component Contract refrence AspectJ
 * {add|contract|{data}}
 */

var Contract = React.createClass({
    clickCb:function()
    {
        if(this.state.before==true)
            this.setState({before:false});
        else
            this.setState({before: true});
    },
    getInitialState:function(){

        return ({before:true});
    },
    render:function(){

        var icon=null;
        var ctrl=null;

        if(this.state.before==true)
            icon=<div className={""+this.props.type!==""?this.props.type:"default"} onClick={this.clickCb}>
            </div>
        else{
            switch(this.props['data-comp'])
            {
                case 'panel':
                    ctrl=<Panel
                        bean={this.props.bean}
                        autoComplete={true}
                        auto={true}
                        returnCb={this.clickCb}
                        />;
                    break;
                default:
                    break;
            }
            icon=<div className={""+this.props.type!==""?this.props.type:"default"} onClick={this.clickCb}>
                {ctrl}
            </div>
        }

        return (<div className="Contract">
                    {icon}
                </div>)
    }
});
module.exports=Contract;
