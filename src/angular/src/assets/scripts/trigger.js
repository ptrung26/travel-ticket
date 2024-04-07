var ora = window.ora || {};
ora.test = function () {
  console.log('Test Orenda module succsess');
};

ora.custom = ora.custom || {};
/* CheckNullEmptyUndefined *********************************************/
ora.equalEmpty = function (val1, val2) {
  if (val1 === {} && val2 === {}) {
    return true;
  }
  if ((val1 === null || val1 === undefined || val1 === '') && (val2 === null || val2 === undefined || val2 === '')) {
    return true;
  }
  return false;
};
/* NOTIFICATION *********************************************/
ora.notify = ora.notify || {};
ora.message = ora.message || {};
/* UI *******************************************************/
ora.ui = ora.ui || {};
/* UI BUSY */
//Defines UI Busy API, not implements it
ora.ui.setBusy = function (message) {
  ora.event.trigger('ora.ui.setBusy', message);
};

ora.ui.clearBusy = function () {
  ora.event.trigger('ora.ui.clearBusy');
};

ora.notify.error = function (message, title, options) {
  ora.event.trigger('event.notify.error', {
    message,
    title,
    options,
  });
};
ora.notify.info = function (message, title, options) {
  ora.event.trigger('event.notify.info', {
    message,
    title,
    options,
  });
};
ora.notify.warn = function (message, title, options) {
  ora.event.trigger('event.notify.warn', {
    message,
    title,
    options,
  });
};
ora.notify.success = function (message, title, options) {
  ora.event.trigger('event.notify.success', {
    message,
    title,
    options,
  });
};

ora.message.error = function (message, options) {
  ora.event.trigger('event.message.error', {
    message,
    options,
  });
};
ora.message.info = function (message, options) {
  ora.event.trigger('event.message.info', {
    message,
    options,
  });
};
ora.message.warn = function (message, options) {
  ora.event.trigger('event.message.warn', {
    message,
    options,
  });
};
ora.message.success = function (message, options) {
  ora.event.trigger('event.message.success', {
    message,
    options,
  });
};
ora.message.confirm = function (message, title, onOk, onCancel, options, confirmType) {
  ora.event.trigger('event.message.confirm', {
    message,
    title,
    onOk,
    onCancel,
    options,
    confirmType,
  });
};
ora.downloadFile = function (urlService, basePath, fileToken) {
  ora.event.trigger('event.downloadFile', {
    urlService,
    basePath,
    fileToken,
  });
};

/* SIMPLE EVENT BUS *****************************************/
ora.event = (function () {
  var _callbacks = {};

  var on = function (eventName, callback) {
    if (!_callbacks[eventName]) {
      _callbacks[eventName] = [];
    }

    _callbacks[eventName].push(callback);
  };

  var off = function (eventName, callback) {
    var callbacks = _callbacks[eventName];
    if (!callbacks) {
      return;
    }

    var index = -1;
    for (var i = 0; i < callbacks.length; i++) {
      if (callbacks[i] === callback) {
        index = i;
        break;
      }
    }

    if (index < 0) {
      return;
    }

    _callbacks[eventName].splice(index, 1);
  };

  var trigger = function (eventName) {
    var callbacks = _callbacks[eventName];
    if (!callbacks || !callbacks.length) {
      return;
    }

    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < callbacks.length; i++) {
      callbacks[i].apply(this, args);
    }
  };

  // Public interface ///////////////////////////////////////////////////

  return {
    on: on,
    off: off,
    trigger: trigger,
  };
})();
ora.flattenData = function collect(array, groupKey, result) {
  array.forEach(function (el) {
    if (el[groupKey]) {
      collect(el[groupKey], groupKey, result);
    } else {
      result.push(el);
    }
  });
};
