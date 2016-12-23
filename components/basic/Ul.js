/**
 * Created by danding on 16/10/30.
 */
import React from 'react';
import {render} from 'react-dom';


var Ul=React.createClass({


    getInitialState:function(){
        let data=null;
        if(this.props.data!==undefined&&this.props.data!==null)
            data=this.props.data;


        return ({data: data});
    },
    render:function(){

        var ins=null;
        if(this.state.data!==undefined&&this.state.data!==null)
        {
            var lis=[];
            this.state.data.map(function(item,i) {
                lis.push(<li key={i}>{item.text}</li>);
            })
            ins=
                <ul>
                    {lis}
                </ul>;
        }
        else{}
        return (<div className='Ul'>{ins}</div>)

    }
});

module.exports=Ul;