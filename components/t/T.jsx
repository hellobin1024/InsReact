import React from 'react';

var T=React.createClass({
    getInitialState:function(){
        return{title:"i am not pressed!"}
    },
    render:function(){
        var attr=this.props["data-query"];

        console.log("attr="+attr);
        return(<span>
            {this.state.title}
        </span>)

    }
})

export default T