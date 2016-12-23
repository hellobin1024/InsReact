import React from 'react';
import {render} from 'react-dom';
var ProxyQ = require('../../../components/proxy/ProxyQ');
/**
 * upload
 */
var img=null;
var Upload = React.createClass({

    clickCb: function () {
        var $file = $(this.refs.file);
        $file.click();
    },

    getInitialState: function () {
        return ({data: null});
    },

    render: function () {
        if (this.props.ctrlName !== undefined && this.props.ctrlName !== null) {
            return (
                <div>
                    <input type="file" style={{display:"none"}} ref="file"/>
                    <input type="hidden" name={this.props.ctrlName} ref="ctrl"/>

                    <div className="input-append">
                        <div style={{float:'left'}}>
                            <input className="input" style={{borderRadius: '4px',width: '352px'}} name="filename" type="text" ref="pathPreview"/>
                        </div>
                        <div>
                            <a className="UploadBtn" style={{height: '33px',width: '75px',lineHeight:'32px'}} onClick={this.clickCb}>
                                <span >选择文件</span>
                            </a>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (<div></div>);
        }
    },

    componentDidMount: function () {
        var file = this.refs.file;
        var $file = $(file);
        var $ctrl = $(this.refs.ctrl);
        var $pathPreview = $(this.refs.pathPreview);
        var ref=this;
        $file.change(function () {
            $pathPreview.val($(this).val());
            if (window.FileReader) {

                var source = file.files[0];
                var fr = new FileReader();
                fr.onloadend = function (e) {
                    $ctrl.val(e.target.result);
                    img=$ctrl.val();
                    if(ref.props.callbackParent!=null&&ref.props.callbackParent!=undefined)
                        ref.props.callbackParent(img);
                };
                fr.readAsDataURL(source);
            }
        });
    }
});
module.exports = Upload;