import React from 'react';
import TodoStore from '../_event/TodoStore.js';


var InputElement=React.createClass({
    changeCb:function(evt)
    {
        var target=evt.target;
        var content=$(target).val();
        this.setState({content:content});
    },
    getInitialState:function(){
        var content;
        if(this.props.content!==undefined&&this.props.content!==null)
        {
            content=this.props.content;
        }
        var subscribe;
        if(this.props.subscribe!==undefined&&this.props.subscribe!==null)
            subscribe=this.props.subscribe;
        return {content:content,subscribe:subscribe};
    },
    render:function() {
        console.log();

        return (<input id={this.props.id} type={this.props.type}
                       className={this.props.className}
                        placeholder={this.props.placeholder}
                       value={this.state.content!==undefined&&this.state.content!==null?
                       this.state.content:null}  onChange={this.changeCb}/>);

    },
    componentDidMount:function(){
        //注册订阅
        if(this.state.subscribe!==undefined&&this.state.subscribe!==null)
        {
            var subscribe=this.state.subscribe;
            var instance=this;
            subscribe.map(function(item,i) {
                if(item['type']!==undefined&&item['type']!==null) {
                    TodoStore.addChangeListener(item['type'],item['callback'].bind(instance));
                }
            });
        }
    },
    componentWillUnmount:function()
    {
        //销毁订阅
        if(this.state.subscribe!==undefined&&this.state.subscribe!==null) {
            var subscribe=this.state.subscribe;
            subscribe.map(function(item,i) {
                if(item['type']!==undefined&&item['type']!==null) {
                    TodoStore.removeChangeListener(item['type'],item['callback']);
                }
            });
        }
    }
});
export default InputElement