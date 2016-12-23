import React from 'react';
import {render} from 'react-dom';
var ProxyQ = require('../../components/proxy/ProxyQ');
import { Link } from 'react-router'
import Icon from '../../components/basic/Icon.jsx';
var Image = React.createClass({
    checkCb: function (evt) {
        var target = evt.target;
        if (this.props.checkCb !== undefined && this.props.checkCb !== null)
            this.props.checkCb(target.checked);
    },
    render: function () {

        var image = null;
        if (this.props.src !== undefined && this.props.src !== null) {
            image = <img src={this.props.src} style={{marginTop:"10px"}}/>
        }

        var icon = null;
        if (this.props.type !== null && this.props.type !== undefined) {
            var ids = this.props.type.split("|");

            switch (ids[0]) {
                case 'icon':
                    icon = <Icon type={ids[1]}/>
                    break;
                case 'check':
                    icon = <input type="checkbox" style={{position:"absolute",left:"0px",bottom:"0px"}}
                                  onChange={this.checkCb}/>
                    break;
                default:
                    break;
            }
        }
        else {
        }
        var link = null;
        if (this.props.link !== undefined && this.props.link !== null)
            link = <Link to={this.props.link}>
                {image}
            </Link>
        else {
            link = <Link to=''>
                {image}
            </Link>
        }
        return (
            <div style={{position:"relative"}} className="image">
                {icon}
                {link}
            </div>)
    }
});
module.exports = Image;