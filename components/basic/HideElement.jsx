import React from 'react';
import '../../css/components/basic/hideElement.css';



/**
 * component HideElement
 * 1.dataField,指示本组件需要载入的内容字段
 */
var HideElement=React.createClass({
    foldCb:function(){
        if(this.props.name!==undefined&&this.props.name!==null)
            this.props.foldCb(this.props.name);
    },
    render:function() {

        var hideTrs;
        if (this.props.info !== undefined && this.props.info !== null) {
            var info = this.props.info;
            var content;
            if(info[this.props.dataField].length>1)
            {
                 content=info[this.props.dataField];
                var reg=/\<(.*?)\>/;
                var re=reg.exec(content);
                if (re !== null && re !== undefined && re[1] !== undefined && re[1] !== null)
                {
                    content=<div dangerouslySetInnerHTML={{__html:content}} />;
                }
            }
                hideTrs = ( <tr>
                    <td>
                        {content}
                    </td>
                </tr>);
        }


        return (
            <table className="table table-bordered center hideTable">
                <thead>
                <tr >
                    <th colSpan={1}>
                        {this.props.info.title}
                        <span className="glyphicon glyphicon-menu-up folding"
                                              onClick={this.foldCb}></span>
                    </th>
                </tr>
                </thead>
                <tbody>
                {hideTrs}
                </tbody>
            </table>)
    }
});
export default HideElement;
