import React from 'react';
import TdBasicElement from '../TdBasicElement.jsx';
import TdOpElement from '../TdOpElement.jsx';
/**
 * @property multiEnable
 * @property tdData
 */

var TdWrapper=React.createClass({
    clickHandler:function(ob){
        console.log();
        console.log();
        console.log();
        console.log();
        console.log();
        console.log("ob=" + ob);
    },
   render:function(){
       var multiEnable=this.props.multiEnable;
       if(multiEnable===1||multiEnable===false)
       {
           if(this.props.tdBasic===true)
           return (<TdBasicElement width={this.props.width} updateFlag={this.props.updateFlag}
               clickHandler={this.clickHandler} tdData={this.props.tdData} rowSpan={this.props.rowSpan}/>);
           else if(this.props.tdBasic=="op")
           {
               return (<TdOpElement width={this.props.width}
                                       opHandle={this.props.opHandle}
                                    op={this.props.op}
                                      />);
           }
           else{
               return (<td></td>);
           }
       }
       else{
            return (<td></td>);
       }

   }
});
export default TdWrapper