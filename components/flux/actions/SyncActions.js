/**
 * Created by outstudio on 16/6/8.
 */


var AppDispatcher = require('../dispatcher/AppDispatcher');
var SyncConstants = require('../constants/SyncConstants');

var SyncActions = {
    login:function(){
        AppDispatcher.dispatch({
            type:SyncConstants.TODO_LOG
        });
    },
    getNote:function(){
        AppDispatcher.dispatch({
            type:SyncConstants.GET_LOG
        });
    },


    create: function (ob) {
        AppDispatcher.dispatch({
            type: SyncConstants.TODO_CREATE,
            sync: ob
        });
    },

    updateData: function (route, ob, label) {
        AppDispatcher.dispatch({
            type : SyncConstants.TODO_UPDATE_DATA,
            route: route,
            sync : ob,
            label: label
        });
    },


    cleanRoute: function (route) {
        AppDispatcher.dispatch({
            type : SyncConstants.CLEAN_ROUTE,
            route: route
        });
    },


    cleanAll: function () {
        AppDispatcher.dispatch({
            type: SyncConstants.CLEAN_ALL
        });
    },

    pronounce: function () {
        AppDispatcher.dispatch({
            type: SyncConstants.TO_ALLIANCE
        });
    },

    setFinish:function(route){
        AppDispatcher.dispatch({
            type: SyncConstants.TODO_FINISH,
            route:route
        });
    },

    devoteInBusiness:function(ob) {
        AppDispatcher.dispatch({
            type: SyncConstants.BUSY_IN_BUSINESS,
            ob:ob
        });
    },
    updateRoute:function(ob){
        AppDispatcher.dispatch({
            type: SyncConstants.UPDATE_ROUTE,
            ob:ob
        });
    }

};

module.exports = SyncActions;