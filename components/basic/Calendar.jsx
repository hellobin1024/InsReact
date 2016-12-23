import React from 'react';
import {render} from 'react-dom';

/**
 * data: "12-02-2012"
 *
 */
var Calendar = React.createClass({
    getInitialState  : function () {
        var data = this.props.data;
        return ({data: data});
    },
    render           : function () {
        if (this.props.ctrlName !== undefined && this.props.ctrlName !== null) {
            return (
                <div className="input-append date" data-date={this.state.data} ref="datetimepicker"
                     data-date-format="yyyy-mm-dd hh:ii">
                    <input className="file" size="16" type="text" name={this.props.ctrlName} defaultValue={this.state.data} style={{width:"100%"}}/>
                    <span className="add-on">
                        <i className="icon-th"></i>
                    </span>
                </div>
            );
        }
        else {
            return (<div></div>);
        }
    },
    componentDidMount: function () {
        var $datetimepicker = $(this.refs.datetimepicker);
        $datetimepicker.datetimepicker('setStartDate', '2016-01-01');
        $datetimepicker.datetimepicker('').on('changeDate', function (ev) {
            $datetimepicker.children(".file")[0].value = ev.date;
            $datetimepicker.datetimepicker('hide');
        });

    }

});
module.exports = Calendar;