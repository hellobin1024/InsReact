import React from 'react';
import {render} from 'react-dom';
var ProxyQ=require('../proxy/ProxyQ');

//var href=ProxyQ.getPrefix()+"/attachment/attachmentDownloadAttachmentBSFile.do?attachId="+this.props.attachId;

var Download=React.createClass({

    render:function() {
        var attach=null;
        if (this.props.attachId !== undefined && this.props.attachId !== null){
            var href=ProxyQ.getPrefix()+"/attachment/attachmentDownloadAttachmentBSFile.do?attachId="+this.props.attachId;
            attach=<a href={href}>{this.props.children}</a>;
        }else{
            var href=ProxyQ.getPrefix()+this.props.href;
            attach=<a href={href}>{this.props.title}</a>;
        }

        return(<div>
                {attach}
                </div>);

    }
});
export default Download;