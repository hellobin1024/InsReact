import React from 'react';
import '../../css/components/forms/TdBasicElement/TdBasicElement.css';



/**
 * date:
 * Thu Apr 14 2016 17:16:03 GMT+0800 (CST)
 *
 *
 */




var TdElement=React.createClass({
    clickCb:function(){
        if(this.state.editEnable==true)
        {

        }else{
            if(this.props.data!==undefined&&this.props.data!==null)
                this.props.clickCb(this.props.data);
        }
    },
    getInitialState:function(){
        //是否为编辑状态
        var editEnable;
        if(this.props.editEnable!==undefined&&this.props.editEnable!==null)
            editEnable=this.props.editEnable;


        return({
            editEnable:editEnable
        })
    },
    render:function(){



       return (
           <td  rowSpan={this.props.rowSpan!==undefined&&this.props.rowSpan!==null?this.props.rowSpan:1}
                colSpan={this.props.colSpan!==undefined&&this.props.colSpan!==null?this.props.colSpan:1}
                 onClick={this.clickCb} className="microsoft-font" >
                {this.props.children}


            </td>);
    }

});

export default TdElement;