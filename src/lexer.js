exports.InputStream = InputStream
exports.TokenStream = TokenStream

function InputStream(input) {
  return new function() {
    let _pos = 0;
    let _line = 1;
    let _col = 0;

    // EXPOSE
    return new function() {
      this.next = next;
      this.peek = peek;
      this.eof = eof;
      this.fail = fail;
      this.debug = debug;
    };

    /** private  **/
    function next() {
      let ch = input.charAt(_pos);
      _pos += 1;

      if (ch == "\n") {
        _line += 1;
        _col = 0 ;
      } else {
        _col += 1;
      }

      return ch;
    };

    function peek() {
      return input.charAt(_pos);
    };

    function eof() {
      return self.peek() == "";
    };

    function fail(msg) {
      throw new Error(`${msg} (${_line}:${_col}`);
    };

    function debug() {
      console.log(`line: ${_line}, col: ${_col}, pos: ${_pos}`);
    };
  };
}

function TokenStream(inputStream) {
  let KEYWORDS = ["if", "then", "else", "lambda", "true", "false"];

  var _status= {
    current: null
  };

  /**
     public apis
  **/
  return {
    next: next,
    peek: peek,
    eof: eof,
    error: inputStream.error
  };

  function next() {
  };

  function peek() {
  };

  function eof() {
  };

  function punc(v) { return { type: "punc", value: v }; } ;
  function num(n) { return { type: "num", value: n };  };
  function str(str) { return { type: "str", value: str }; }
  function keyword(kwd) { return { type: "keyword", value: kwd  }; }
  function variable(variable) { return { type: "variable", value: variable }; }
  function op(op) { return { type: "op", value: op }; }
}

