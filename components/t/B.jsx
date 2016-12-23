import React from 'react';
var B=React.createClass({

    render:function(){

        var {type,
            ...other}=this.props;
        for(var field in other) {
            console.log(field + ":" + other[field]);
        }
        return (<div>
            {type}
            </div>)
    }
});
module.exports=B;