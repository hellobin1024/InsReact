/**
 * Created by danding on 16/11/9.
 */

//TODO:js module enscapulation


var ob=function(){
    var threshold=10;
    var pageCategory=10;
    var getInitialDataIndex=function (capacity,pageIndex,callback) {
        let begin =pageIndex*threshold;
        let end = begin;
        for (let i = 0; i < threshold; i++) {
            if (end >= capacity)
                break;
            end++;
        }
        if(callback!==undefined&&callback!==null)
            callback({begin:begin,end:end});
    }.bind(this);

    return {
        threshold:threshold,
        pageCategory:pageCategory,
        getInitialDataIndex:getInitialDataIndex
    };
}




module.exports=ob();