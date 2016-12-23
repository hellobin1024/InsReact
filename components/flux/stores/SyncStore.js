var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var SyncConstants = require('../constants/SyncConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var PRONOUNCE_EVENT='pronounce';

var FINISH_EVENT = 'finish';

var DEVOTE_EVENT = 'devote';

var ROUTE_UPDATE_EVENT='route_update';

var _todos = {};

var _finishes={};

var _devote=false;

var _mustdone={};

var _note=false;//登录状态




/**
 * @param _finishes,迎新已完成的业务
 *
 */


function create(ob) {
    if (ob.route !== undefined && ob.route !== null && ob.data !== undefined && ob.data !== null) {
        var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
        _todos[id] = {
            id   : id,
            route: ob.route,
            data : ob.data,
            label: ob.label
        };
    }

}

function update(route, updates, label) {
    var catched = false;
    for (var id in _todos) {
        var todo = _todos[id];
        if (todo.route == route) {
            todo.data = updates;
            todo.label = label;
            catched = true;
            break;
        }
    }
    if (!catched) {
        create({route: route, data: updates, label: label});
    }
}

function getAll() {
    return _todos;
}

function setFinish(ob)
{
    _finishes[ob.route]=true;
}

function setDevote(ob)
{
    _devote=ob;
}
function updateRoute(ob){
    _mustdone=ob;
}


function destroy(id) {
    delete _todos[id];
}


function cleanRouteData(route) {
    for (var id in _todos) {
        var todo = _todos[id];
        if (todo.route == route)
            destroy(id);
    }
}

function cleanAll() {
    for (var id in _todos) {
        destroy(id);
    }
}


var SyncStore = assign({}, EventEmitter.prototype, {

    getNote:function(){
      return _note;
    },
    setNote:function(){
      _note=true;
    },

    getAll: function () {
        return _todos;
    },

    getFinishes:function(){
        return _finishes;
    },

    isDevote:function(){
        return _devote;
    },

    getIsDevote:function(){

    },

    getAllRoute:function(){
        return _mustdone;
    },

    getInContext: function (route) {
        if (route !== undefined && route !== null) {
            for (var id in _todos) {
                var todo = _todos[id];
                if (todo.route == route)
                    return todo.data;
            }
        }
        return null;
    },
    emitChange  : function () {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    emitPronounce:function(){
        this.emit(PRONOUNCE_EVENT);
    },

    addPronounceListener:function(callback){
        this.on(PRONOUNCE_EVENT, callback);
    },

    removePronounceListener: function (callback) {
        this.removeListener(PRONOUNCE_EVENT, callback);
    },

    emitFinish:function(){
        this.emit(FINISH_EVENT);
    },

    addFinishListener:function(callback) {
        this.on(FINISH_EVENT, callback);
    },

    removeFinishListener:function(callback) {
        this.removeListener(FINISH_EVENT, callback);
    },

    emitDevote:function(){
      this.emit(DEVOTE_EVENT);
    },

    addDevoteListener:function(callback) {
        this.on(DEVOTE_EVENT, callback);
    },

    removeDevoteListener:function(callback){
        this.removeListener(DEVOTE_EVENT,callback);
    }
});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
    var sync;

    switch (action.type) {
        case SyncConstants.TODO_LOG:
            SyncStore.setNote();
            break;
        case SyncConstants.GET_LOG:
            SyncStore.getNote();
            break;
        case SyncConstants.TODO_CREATE:
            sync = action.sync;
            if (sync !== '') {
                create(sync);
                SyncStore.emitChange();
            }
            break;

        case SyncConstants.TODO_UPDATE_DATA:
            sync = action.sync;
            if (sync !== '') {
                update(action.route, sync, action.label);
                SyncStore.emitChange();
            }
            break;

        case SyncConstants.CLEAN_ROUTE:
            cleanRouteData(action.route);
            SyncStore.emitChange();
            break;
        case SyncConstants.CLEAN_ALL:
            cleanAll();
            SyncStore.emitChange();
            break;
        case SyncConstants.TO_ALLIANCE:
            SyncStore.emitPronounce();
            break;
        case SyncConstants.TODO_FINISH:
            setFinish(action);
            SyncStore.emitFinish();
            break;
        case SyncConstants.BUSY_IN_BUSINESS:
            setDevote(action.ob);
            SyncStore.emitDevote();
            break;
        case SyncConstants.UPDATE_ROUTE:
            updateRoute(action.ob)
            break;
        default:
        // no op
    }
});

module.exports = SyncStore;