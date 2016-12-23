import React from 'react';
import ButtonElement from './ButtonElement.jsx';
import MenuLinkElement from './MenuLinkElement.jsx';
import TodoStore from '../_event/TodoStore.js';


/**
 * @property, title{String}
 * @property, data{link,title}
 * @property,  auto{false|undefined|null|xxx},
 * this prop will forbid component get menu from server-end if this prop is set to true;
 * u can set any-value  to enable dynamic menu-fetch;
 * @property,   query{params:xxx,url:xxx}
 * @property,   subscribe:{type:xxx,cb:xxx}
 * this prop component subscribe the message of the type you specified
 * @property,  ctrlName
 * a input name which use to identify this field in back-end
 * @example
 *
 *
 */

var DropDownButtonElement=React.createClass({
    initialData:function(){
        if(this.props.query!==undefined&&this.props.query!==null)
        {
            $.ajax({
                type: 'POST',
                url: this.props.query.url,
                dataType: 'json',
                data: this.props.query.params,
                cache: false,
                success: function(data) {
                    if(data!==undefined&&data!==null&&data.length>0)
                        this.setState({data:data,data$initialed:true});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }
            });
        }
    },
    /**
     * 选中事件的回调函数
     * @param ob
     */
    selectCb:function(ob){
        if(ob!==undefined&&ob!==null)
        {
            //index属性等价选中项所位于的列表位置
            if(ob.index!==null&&ob.index!==undefined)
                this.setState({selectedIndex:ob.index});
        }
    },
    getInitialState:function(){


        //数据初始化的状态
        var data$initialed;
        if(this.props.data!==undefined&&this.props.data!==null)
            data$initialed=true;
        //是否参与事件订阅
        var subscribe;
        if(this.props.subscribe!==undefined&&this.props.subscribe!==null)
            subscribe=this.props.subscribe;
        //选中项的位置标识
        var selectedIndex;
        if(this.props.selectedIndex!==undefined&&this.props.selectedIndex!==null)
            selectedIndex=this.props.selectedIndex;


        return {data$initialed:data$initialed,subscribe:subscribe
        ,selectedIndex:selectedIndex};
    },
    render:function(){
        var t_menu;
        if(this.state.data$initialed===true)
        {
            var selectCb=this.selectCb;
             t_menu=this.props.data.map(function(item,i) {
                return(
                    <MenuLinkElement link={item.link} title={item.title} key={i} data-index={i} selectCb={selectCb}/>
                )
            })
        }else{
            if(this.props.auto===true)
            {
                this.initialData();
            }
        }

        var title;
        if(this.state.selectedIndex!==null&&this.state.selectedIndex!==undefined)
            title=this.props.data[this.state.selectedIndex]["title"];
        else
        {
            if(this.props.title!==undefined&&this.props.title!==null)
                title=this.props.title;
        }
        return(
            <div className="btn-group">
                <input name={this.props.ctrlName} style={{display:"none"}}></input>
                <ButtonElement type="button" buttonClass="btn btn-default dropdown-toggle"
                            data-toggle="dropdown" aria-haspopup="true"
                            aria-expanded="false" title={title} >
                    <span className="caret"></span>
                </ButtonElement>
                <ul className="dropdown-menu">
                     {t_menu}
                </ul>
            </div>)
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

export default DropDownButtonElement