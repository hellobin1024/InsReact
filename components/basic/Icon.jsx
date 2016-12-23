import React from 'react';
import {render} from 'react-dom';
var Icon=React.createClass({
    clickCb:function(evt){
        var target=evt.target;
        var $target=$(target);
        var index = $target.attr("data-index");
        if(this.props.clickCb!==undefined&&this.props.clickCb!==null)
            this.props.clickCb(index);
    },
    render: function () {
        var tds=new Array();
        var clickCb=this.clickCb;
        var img=null;
        switch(this.props.data.type)
        {
            case "add":
                img=<img src='./images/add.png'
                                  onClick={clickCb}/>;
                break
            case "delete":
                img=<img src='./images/delte.png'
                         onClick={clickCb}/>;
                break;
            default:
                img=<img
                         />;
                break;
        }
        return(
            <div>
                {img}
            </div>)
    }

});

module.exports = Icon;

