import React from 'react';
import {render} from 'react-dom';
import '../../css/components/basic/operation.css';

var Operation = React.createClass({
    operationCb: function (evt) {
        var target = evt.target;
        var $target = $(target);
        var index = this.props["data-index"];
        console.log("index====" + index);
        var query = this.props.query;
        if (Object.prototype.toString.call(query) == "[object String]")
            query = eval('(' + query + ')');
        query.params = Object.assign(query.params, {index: index});
        if (this.props.operationCb !== undefined && this.props.operationCb !== null)
            this.props.operationCb(query);
    },
    render     : function () {
        var operation = null;
        if (this.props.op !== undefined && this.props.op !== null) {
            switch (this.props.op) {
                case "+":
                    operation = <div className="add" onClick={this.operationCb}></div>
                    break;
                case "-":
                    operation = <div className="minus" onClick={this.operationCb}></div>
                    break;
                default:
                    break;
            }
        }
        return <div className="operation">{operation}</div>
    }
});
export default Operation;