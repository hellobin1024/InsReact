import React from 'react';
import {render} from 'react-dom';


/**
 * data: "12-02-2012"
 *
 */
var Calendar = React.createClass({
    getInitialState  : function () {
        var data = this.props.data;
        return ({data: data
        });
    },
    render           : function () {
        if (this.props.ctrlName !== undefined && this.props.ctrlName !== null) {
            return (
                <div className="input-append date" data-date={this.state.data} ref="datetimepicker"
                     data-date-format="yyyy-mm-dd" style={{float:'left',marginLeft:'-2%',marginTop:'-3px'}}>
                             <span className="add-on" >
                                 <i className="icon-calendar" style={{backgroundColor:'#999',padding:'11.5px'}}
                                 ></i>
                             </span>
                    <input className="file" size="16"   type="text" name={this.props.ctrlName}  defaultValue={this.state.data} style={{width:"62%",height:"37px"}}/>
                </div>
            );
        }
        else {
            return (<div>失败</div>);
        }
    },
    componentDidMount: function () {
        var $datetimepicker = $(this.refs.datetimepicker);
        $datetimepicker.datetimepicker('setStartDate', '2016-01-01');
        var ref=this;
        $datetimepicker.datetimepicker('').on('changeDate', function (ev) {
            $datetimepicker.children(".file")[0].value = ev.date;
            $datetimepicker.datetimepicker('hide');
            var date = $datetimepicker.children(".file")[0].value;
            if(ref.props.callbackParent!=null&&ref.props.callbackParent!=undefined)
                ref.props.callbackParent(date);
        });

    }

});
module.exports = Calendar;