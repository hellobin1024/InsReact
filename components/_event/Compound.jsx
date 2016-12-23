import React from 'react';
import util from 'util';
import A from './A.jsx';
import B from './B.jsx';

var Compound=React.createClass({
    cb: function (ob) {
        console.log('ob=' + ob);
    },
    render:function(){

        return (<div>
            <A/>
            <B/>
        </div>);
    }
});


export default Compound