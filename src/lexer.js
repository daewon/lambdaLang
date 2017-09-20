class InputStream {
  constructor(input) {
    this.input = input;

    this.pos = 0;
    this.line = 1;
    this.col = 0;
  }

  next() {
    const ch = this.input.charAt(this.pos++);
    if (ch == "\n") this.line++, this.col = 0; else this.col++;

    return ch;
  }

  peek() {
    return this.input.charAt(this.pos);
  }

  eof() {
    return this.peek() == "";
  }

  croak(msg) {
    throw new Error(msg + " (" + this.line + ":" + this.col + ")");
  }
}

class TokenStream {
  constructor(input) {
    this.input = input;

    this.current = null;
    this.KEYWORDS = ["if", "then", "else",  "lambda",  "λ",  "true",  "false"];
  }

  is_keyword(x) {
    return this.KEYWORDS.includes(x);
  }

  is_digit(ch) {
    return /[0-9]/i.test(ch);
  }

  is_id_start(ch) {
    return /[a-zλ_]/i.test(ch);
  }

  is_id(ch) {
    return this.is_id_start(ch) || "?!-<>=0123456789".includes(ch);
  }

  is_op_char(ch) {
    return "+-*/%=&|<>!".includes(ch);
  }

  is_punc(ch) {
    return ",;(){}[]".includes(ch);
  }

  is_whitespace(ch) {
    return " \t\n".includes(ch);
  }

  read_while(predicate) {
    const arr = [];
    while (!this.input.eof() && predicate(this.input.peek())) {
      arr.push(this.input.next());
    }

    return arr.join("");
  }

  read_number() {
    let has_dot = false;
    let number = this.read_while(ch => {
      if (ch == ".") {
        if (has_dot) { return false; }
        has_dot = true;

        return true;
      }

      return this.is_digit(ch);
    });

    return { type: "num", value: parseFloat(number) };
  }

  read_ident() {
    const id = this.read_while(this.is_id.bind(this));

    return {
      type  : this.is_keyword(id) ? "kw" : "var",
      value : id
    };
  }

  read_escaped(end) {
    let escaped = false, arr = [];
    this.input.next();

    while (!this.input.eof()) {
      const ch = this.input.next();
      if (escaped) {
        arr.push(ch);
        escaped = false;
      } else if (ch == "\\") {
        escaped = true;
      } else if (ch == end) {
        break;
      } else {
        arr.push(ch);
      }
    }

    return arr.join("");
  }

  read_string() {
    return { type: "str", value: this.read_escaped('"') };
  }

  skip_comment() {
    this.read_while(ch => { return ch != "\n"; });
    this.input.next();
  }

  read_next() {
    this.read_while(this.is_whitespace);
    if (this.input.eof()) { return null; };

    const ch = this.input.peek();

    if (ch == "#") {
      this.skip_comment();
      return this.read_next();
    }

    if (ch == '"') { return this.read_string(); }
    if (this.is_digit(ch)) { return this.read_number(); }
    if (this.is_id_start(ch)) { return this.read_ident(); }
    if (this.is_punc(ch)) {
      return {
        type  : "punc",
        value : this.input.next()
      };
    }

    if (this.is_op_char(ch)) {
      return {
        type  : "op",
        value : this.read_while(this.is_op_char)
      };
    }

    this.input.croak("Can't handle character: " + ch);
  };

  peek() {
    if (!this.current) {
      this.current = this.read_next();
    }

    return this.current;
  }

  next() {
    const tok = this.current;
    this.current = null;

    return tok || this.read_next();
  }

  eof() {
    return this.peek() == null;
  }
}

exports.InputStream = InputStream;
exports.TokenStream = TokenStream;
