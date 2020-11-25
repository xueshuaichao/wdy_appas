import Vue from 'vue';

const EVENT_NAME = {
  FIELD_CLEAR_DEPENDENCE: 'fieldClearDependence',
  FIELD_DEFAULT_VALUE_COMPUTE: 'filedDefaultValueCompute'
};

const _ob = new Vue();

const Observer = {
  emit: function (eventName, ...args) {
    _ob.$emit(eventName, ...args);
  },
  on: function (eventName, callback) {
    _ob.$on(eventName, callback);
  },
  off: function(eventName, callback) {
    _ob.$off(eventName, callback);
  }
};

export {
  EVENT_NAME,
  Observer
};
