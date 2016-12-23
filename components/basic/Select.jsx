import React from 'react';
import {render} from 'react-dom';
import dict from '../../data/json/dictionary.json';


/**
 * 1.select组件扩展父组件表单提交触发
 */

var Select=React.createClass({
    dataInitial:function(){
            if(dict[this.props.ctrlName]!==undefined&&dict[this.props.ctrlName]!==null) {

                var ctrlName=this.props.ctrlName;

                    this.queryHandle(
                        null,
                        dict[this.props.ctrlName].url,
                        {
                            dictName:dict[this.props.ctrlName].alias
                        },
                        null,
                        function(response){
                            //这里需要统一规范后台返回的数据格式
                            if(response.arr!==undefined&&response.arr!==null)
                                this.setState({data:response.arr,data$initialed:true});
                            else
                                console.log("type of response is wrong");
                        }.bind(this)
                    );

            }

    },
    queryHandle:function(type,url,params,dataType,callback){
        $.ajax({
            type: type!==undefined&&type!==null?type:'POST',
            url: url,
            dataType: dataType!==undefined&&dataType!==null?dataType:'json',
            data: params,
            cache: false,
            success: function(response) {
                if(callback!==undefined&&callback!==null)
                    callback(response);
            },
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }
        });
    },
    selectCb:function(evt){
        var target=evt.target;
        var hidden=this.refs.hidden_field;
        hidden.value=target.value;
        if(this.props.selectCb!==null&&this.props.selectCb!==undefined)
        {
            this.props.selectCb(target.value);
        }
    },
    getInitialState:function(){
        var auto;
        if(this.props.auto!==undefined&&this.props.auto!==null)
        {
            auto=this.props.auto;
        }

        var data;
        if(this.props.data!==undefined&&this.props.data!==null)
        {
            data=this.props.data;
        }
        else if(dict[this.props.ctrlName]!==undefined&&dict[this.props.ctrlName]!==null)
        {
            if(Object.prototype.toString.call(dict[this.props.ctrlName].data)=='[object Array]')
                data=dict[this.props.ctrlName].data;
        }else{}

        var data$initialed;
        if(data!==undefined&&data!==null)
        {
            data$initialed=true;
        }
        else
            data$initialed=false;





       return({selectedIndex:-1,auto:auto,data$initialed:data$initialed,data:data});
    },
    componentWillReceiveProps(props){
        var ob=new Object();
        if(props.data!==undefined&&props.data!==null) {
            ob.data=props.data;
        }
        if(this.state.data$initialed==false)
        {
            ob.data$initialed=true;
        }
        if(props.disabled!==undefined&&props.disabled!==null)
            ob.disabled=props.disabled;
        this.setState(ob);

    },
    render:function(){
     if(this.state.data$initialed==true&&Object.prototype.toString.call(this.state.data)=='[object Array]'&&this.state.disabled!=true)
     {
         var options=new Array();
         var selectCb=this.selectCb;
         var selected = null;

         this.state.data.map(function(item,i) {
             if(item["selected"]!==undefined&&item["selected"]!==null)
             {
                 options.push(<option value={item.value} key={i} selected>{item.label}</option>);
                 if(item.value!==undefined&&item.value!==null)
                    selected=item.value;
             }
             else
                options.push(<option value={item.value} key={i}>{item.label}</option>);
         });
        return(
            <div style={{display:'inline'}}>
                <input name={this.props.ctrlName} style={{display:"none"}} value={selected!==null&&selected!==undefined?selected:''} ref="hidden_field"/>
                <select onChange={selectCb} style={{width:"100%"}} data-query={this.props["data-query"]!==null&&this.props["data-query"]!==undefined?this.props["data-query"]:null}>
                    {options}
                </select>
            </div>
        );
     }
     else{
         if(this.props.auto==true)
            this.dataInitial();

         return(<select ></select>);
     }


    }
});
export default Select;
