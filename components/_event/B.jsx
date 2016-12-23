/**
 * Created by dandi_000 on 2016/3/1.
 */
var  React=require('react');
var TodoStore=require('./TodoStore');



var B=React.createClass({
    cb:function(ob)
    {
        console.log("b knows,it is on fire");
    },
    handle:function(evt) {
        TodoStore.emitChange('change','this component is B');
    },
    render:function(){
        var alignStyle={textAlign:"center"};
        return(<div style={alignStyle}>
            <button onClick={this.handle}>my name is B</button>
            </div>);
    },
    componentDidMount:function(){
        TodoStore.addChangeListener('change',this.cb);
    },
    componentWillUnmount:function(){
        TodoStore.removeChangeListener('change',this.cb);
    }
})

export default B