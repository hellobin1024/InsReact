import React from 'react';
import {render} from 'react-dom';


var OrdinaryTr=React.createClass({
    clickCb:function(){
      if(this.props.clickCb!==undefined&&this.props.clickCb!==null)
      {
          if(this.props["data-index"]!==undefined&&this.props["data-index"]!==null)
          {
              var ob=new Object();
              ob.field=this.props.dataField;
              ob.index=this.props["data-index"];
              this.props.clickCb(ob);
          }else{
              this.props.clickCb(null);
          }
      }
    },
    render:function(){




        return (
            <tr onClick={this.clickCb}>
                {this.props.children}
            </tr>)
    }
});
export default OrdinaryTr;