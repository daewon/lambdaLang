class InputStream {
  constructor(input) {
    this.input = input;

    this.pos = 0;
    this.line = 1;
    this.col = 0;
  }

  next() {
    const ch = this.input.charAt(this.pos++);
    if (ch == "\n") {
      this.line++;
      this.col = 0;
    } else {
      this.col++;
    }

    return ch;
  }

  peek() {
    return this.input.charAt(this.pos);
  }

  eof() {
    return this.peek() === "";
  }

  error(msg) {
    throw new Error(msg + " (" + this.line + ":" + this.col + ")");
  }
}

class TokenStream {
  constructor(input) {
    this.input = input;
    this.current = null;
  }

  isKeyword(kw) {
    const keywords = ["if", "then", "else",  "\\", "true",  "false"];
    return keywords.includes(kw);
  }

  isDigit(ch) {
    return /[0-9]/.test(ch);
  }

  isIdStart(ch) {
    return /[a-z_]/i.test(ch);
  }

  isId(ch) {
    return this.isIdStart(ch) || "?!-<>=0123456789".includes(ch);
  }

  isOpChar(ch) {
    return "+-*/%=&|<>!".includes(ch);
  }

  isPunc(ch) {
    return ",;(){}[]".includes(ch);
  }

  isWhitespace(ch) {
    return " \t\n".includes(ch);
  }

  readWhile(p) {
    const arr = [];

    while (!this.input.eof() && p(this.input.peek())) {
      arr.push(this.input.next());
    }

    return arr.join("");
  }

  readNumber() {
    let hasDot = false;
    const pIsNumber = ch => {
      if (ch === ".") {
        if (hasDot) { return false; } else { hasDot = true; }
        return true;
      };

      return this.isDigit(ch);
    };

    const number = this.reaWhile(pIsNumber);

    return { type: "num", value: parseFloat(number) };
  }

  readIdent() {
    const id = this.readWhile(this.isId.bind(this));
    return { type: this.isKeyword(id) ? "kw" : "var", value: id };
  }


  readEscaped(end) {
    let escaped = false;
    const arr = [];

    this.input.next();

    while (!this.input.eof()) {
      const ch = this.input.next();

      if (escaped) {
        arr.push(ch);
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === end) {
        break;
      } else {
        arr.push(ch);
      }
    }

    return arr.join("");
  }

  readString() {
    return { type: "str", value: this.readEscaped('"') };
  }

  readComment() {
    this.readWhile(ch => { return ch !== "\n"; });

    this.input.next();
  }

  readNext() {
    this.readWhile(this.isWhitespace.bind(this));

    if (this.input.eof()) { return null; };

    const ch = this.input.peek();

    if (ch === "#") {
      this.readComment();
      return this.readNext();
    }

    if (ch === '"') { return this.readString(); }
    if (this.isDigit(ch)) { return this.readNumber(); }
    if (this.isIdStart(ch)) { return this.readIdent(); }

    if (this.isPunc(ch)) {
      return { type: "punc", value: this.input.next() };
    }

    if (this.isOpChar(ch)) {
      return { type: "op", value: this.readWhile(this.isOpChar.bind(this)) };
    }

    this.input.error("Can't handle character: " + ch);
  };

  peek() {
    if (!this.current) {
      this.current = this.readNext();
    }

    return this.current;
  }

  next() {
    const token = this.current;
    this.current = null;

    return token || this.readNext();
  }

  eof() {
    return this.peek() == null;
  }
}

exports.InputStream = InputStream;
exports.TokenStream = TokenStream;
