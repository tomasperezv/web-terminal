/**
 * @object Cursor
 */
var Cursor = (function(EventEmitter) {

  /**
   * @constructor 
   */
  var Cursor = function() {
    this.content = '';
    EventEmitter.apply(this);
  };

  Cursor.prototype = new EventEmitter();

  /**
   * @type {String} CONTENT_CHANGE
   */
  Cursor.CONTENT_CHANGE = 'content-change';

  /**
   * @method listen
   * @public
   */
  Cursor.prototype.listen = function() {

    var self = this;

    document.addEventListener('keypress', function(eventData) {
      if (self.isValid(eventData.keyCode)) {
        self.content += String.fromCharCode(eventData.keyCode);
        self.emit(Cursor.CONTENT_CHANGE, self.content);
      }
    }, false);

  };

  /**
   * @method isValid
   * @public
   */
  Cursor.prototype.isValid = function() {
    // TODO: extend with filter for invalid characters
    return true;
  };

  return Cursor;

})(EventEmitter);
