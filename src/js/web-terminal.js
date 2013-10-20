/**
 * @object WebTerminal
 */
var WebTerminal = (function() {

  /**
   * @constructor
   * @param {Object} config
   */
  var WebTerminal = function(config) {

    /**
     * @var {Object} config
     */
    this.config = {
      containerSelector: config.containerSelector || '#terminal',
      className: 'terminal',
      templates: {
        'line': ''
      }
    };

    this._listeners = {};

  };

  /**
   * @param {String} eventId
   * @param {Function} callback
   * @method attach
   * @public
   */
  WebTerminal.prototype.attach = function(eventId, callback) {

    if (typeof this._listeners[eventId] === 'undefined') {
      this._listeners[eventId] = [];
    }

    this._listeners[eventId].push(callback);

  };

  /**
   * Preload templates via AJAX request, from the resources folder.
   *
   * @method _loadTemplates
   */
  WebTerminal.prototype._loadTemplates = function() {

    var self = this;
    var pendingResources = 0;
    var templates = this.config.templates;
    for (var key in templates) {
      if (templates.hasOwnProperty(key) && templates[key].length === 0) {
        pendingResources++;
        AjaxEngine.get('./templates/' + key, '', function(content) {

          pendingResources--;
          templates[key] = content;

          if (pendingResources === 0) {
            self._emit('ready');
          }

        });
      }
    }
  };

  /**
   * @param {String} eventId
   * @param {undefined|Object} data 
   * @method _emit
   * @private
   */
  WebTerminal.prototype._emit = function(eventId, data) {

    if (typeof this._listeners[eventId] !== 'undefined') {

      for(var i = 0; i < this._listeners[eventId].length; i++) {
        if (typeof this._listeners[eventId][i] === 'function') {
          this._listeners[eventId][i](data);
        }
      }

    }

  };

  /**
   * @method _addLine
   * @private
   */
  WebTerminal.prototype._addLine = function() {

    var content = Mustache.render(this.config.templates['line'], {
      'context': 'asdf'
    });

    var node = document.createElement('div');
    node.innerHTML = content;

    this.container.appendChild(node);

  };

  /**
   * @method _render
   * @private
   */
  WebTerminal.prototype._render = function() {
    this.container = document.querySelector(this.config.containerSelector);
    if (this.container !== null) {
      // @see https://developer.mozilla.org/en-US/docs/Web/API/Element.classList
      this.container.classList.add(this.config.className);

      this._addLine();

    }
  }

  /**
   * @method init
   * @public
   */
  WebTerminal.prototype.init = function() {
    this._loadTemplates();

    var self = this;
    this.attach('ready', function() {
      self._render();
    });

  };

  return WebTerminal;

})();
