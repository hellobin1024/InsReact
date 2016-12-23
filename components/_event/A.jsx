import React from 'react';
var  TodoStore = require('./TodoStore');

var A=React.createClass({
    cb:function(ob){
        console.log("a knows,it is on fire");
    },
    handle:function(evt) {
        TodoStore.emitChange('change','this component is A');
    },
    render:function(){

        var alignStyle={
            textAlign:"center"
        }
        return (<div style={alignStyle} >
          <button onClick={this.handle}>my name is A</button>
          </div>)  ;
    },
    componentDidMount:function(){
        TodoStore.addChangeListener('change',this.cb);
    },
    componentWillUnmount:function(){
        TodoStore.removeChangeListener('change',this.cb);
    }
})
export default A