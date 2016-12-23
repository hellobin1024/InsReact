var  EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = 'fire';

var TodoStore = Object.assign({}, EventEmitter.prototype, {


    emitChange: function(type) {
        if(arguments.length>1)
            this.emit(type,arguments[1]);
        else
            this.emit(type);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(type,callback) {
        this.on(type, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(type,callback) {
        this.removeListener(type, callback);
    },

});

module.exports = TodoStore;