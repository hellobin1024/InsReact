import React from 'react';

var CheckBoxElement =React.createClass({
    clickCb:function(evt){
        var target=evt.target;
        if($(target).attr("data-index")!==null&&$(target).attr("data-index")!==undefined)
        {
            var index=$(target).attr("data-index");
            if(!isNaN(parseInt(index)))
            this.props.checkCb(index);
        }
    },
    render:function(){
        if(this.props.checked===true)
            return (
                <input type="checkbox" aria-label="..."
                       value={this.props.value} onChange={this.clickCb} checked="checked" data-index={this.props["data-index"]}/>
            );
        else
        return (
            <input type="checkbox" aria-label="..."
                   value={this.props.value} onChange={this.clickCb} data-index={this.props["data-index"]} />
        );
    }
})

export default CheckBoxElement;