import React from 'react';
import {render} from 'react-dom';


var Span=React.createClass({
    fetch:function(){
        this.queryHandle(
            null,
            this.props.query.url,
            this.props.query.params,
            null,
            function(response){
                //这里需要统一规范后台返回的数据格式
                if(response.data!==undefined&&response.data!==null&&response.data!="")
                    this.setState({data:response.data,data$initialed:true});
                else
                    console.log("type of response is wrong");
            }.bind(this)
        );
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


        var data$initialed;
        if(data!==undefined&&data!==null)
        {
            data$initialed=true;
        }
        else
            data$initialed=false;

        return({data:data,data$initialed:data$initialed,auto:auto});

    },
    render:function(){

        var content=null;
        if(this.state.data$initialed==false&&(this.props.data==null||this.props.data==undefined))
        {
            if(this.state.auto==true)
                this.fetch();
        }else{
            content=this.state.data;
        }
        return (<span>{content}</span>)

    }
});
export default Span;