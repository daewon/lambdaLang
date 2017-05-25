function InputStream(input) {
  return new function() {
    var pos = 0;
    var line = 1;
    var col = 0;
    var that = this;

    this.next = function() {
      var ch = input.charAt(pos);
      pos += 1;

      if (ch == "\n") {
        line += 1;
        col = 0 ;
      } else {
        col += 1;
      }

      return ch;
    };

    this.peek = function() {
      return input.charAt(pos);
    };

    this.eof = function() {
      return that.peek() == "";
    };

    this.fail = function(msg) {
      throw new Error(`${msg} (${line}:${col}`);
    };

    this.debug = function() {
      console.log(`line: ${line}, col: ${col}, pos: ${pos}`);
    };
  };
}


var stream = InputStream("daewon\njeong\nlang");

while(stream.peek()) {
  var ch = stream.next();
  stream.debug();
}
