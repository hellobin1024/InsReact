import React from 'react';
import {render} from 'react-dom';
import '../../css/components/basic/horizontal.css';
var ProxyQ = require('../proxy/ProxyQ');

/**
 *
 */

var Horizontal = React.createClass({
    fetch          : function () {
        ProxyQ.queryHandle(
            null,
            this.props.query.url,
            this.props.query.params,
            'json',
            function (response) {
                var ob = new Object();
                var data = null;
                data = response.arr;
                if (data !== null) {
                    ob.data$initialed = true;
                    ob.data = data;
                }
                if(response.filterField!==undefined&&response.filterField!==null) {
                    ob.filterField=response.filterField;
                }
                if (response.translation !== undefined && response.translation !== null) {
                    ob.translation = response.translation;
                }
                this.setState(ob);
            }.bind(this)
        )
    },
    getInitialState: function () {
        var data$initialed = false;
        var data;
        if (this.props.data !== undefined && this.props.data !== null) {
            data = this.props.data;
            data$initialed = true;
        }
        var filterField=null;
        if(this.props.filterField!==undefined&&this.props.filterField!==null) {
            filterField=this.props.filterField;
        }
        return ({data: data, data$initialed: data$initialed,filterField:filterField});
    },
    getStyle       : function () {
        var ob = new Object();
        if (this.props.width !== undefined && this.props.width !== null)
            ob.width = this.props.width;
        else
            ob.width="100%";
        if(this.props.marginLeft!==undefined&&this.props.marginLeft!==null) {
            ob.marginLeft=this.props.marginLeft;
        }
        if(this.props.paddingLeft!==undefined&&this.props.paddingLeft!==null)
            ob.paddingLeft=this.props.paddingLeft;
        return ob;
    },
    render         : function () {
        if (this.state.data !== undefined && this.state.data !== null) {
            var trs = new Array();
            var state = this.state;
            var k = 0;


            /**
             * generate part by data
             */
            if(state.filterField!==null&&state.filterField!==null) {
                for(var field in state.filterField)
                {
                    if(state.data[field]!==undefined&&state.data[field]!==null) {
                        var label=null;
                        if(state.translation[field]!==undefined&&state.translation[field]!==null)
                        {
                            label = state.translation[field];
                        }
                        else
                            label=field;
                        trs.push(
                            <tr key={k++}>
                                <td key={0}>{label}</td>
                                <td key={1}>{state.data[field]}</td>
                            </tr>
                        );
                    }
                }
            }else{
                for (var field in state.data) {

                    var label = null;
                    if (state.translation[field] !== undefined && state.translation[field] !== null)
                        label = state.translation[field];
                    else
                        label = field;
                    trs.push(
                        <tr key={k++}>
                            <td key={0}>{label}</td>
                            <td key={1}>{state.data[field]}</td>
                        </tr>
                    );
                }
            }
            let title=null;
            if(this.props.title!==undefined&&this.props.title!==null)
            {
                title=
                    <thead>
                    <tr><th colSpan={2}>{this.props.title}</th></tr>
                    </thead>
            }
            /**
             * render part
             */
            return (
                <div className="horizontal" style={this.getStyle()}>
                    <table className={"table table-bordered center "+(this.props.highLight==true?"highLight":"")}>
                        {title}
                        <tbody>
                        {trs}
                        </tbody>
                    </table>
                </div>
            )
        }
        else {
            if (this.props.auto == true && this.state.data$initialed == false)
                this.fetch();

            return (
                <div className={"row horizontal"+(this.props.highLight==true?" highLight":"")} style={this.getStyle()}>
                    <div className="col-sm-12">
                        <table></table>
                    </div>
                </div>);
        }
    }
});
module.exports = Horizontal;