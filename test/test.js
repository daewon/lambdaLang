const assert = require("assert");
const lexer = require("../src/lexer");

const Is = lexer.InputStream;
const Ts = lexer.TokenStream;

describe("Lexer", () => {
  const parse = text => new Ts(new Is(text));

  describe("InputStream", () => {
    const str = "abcdefg{}[] ";
    const is = new Is(str);

    it("next", () => {
      str.split("").forEach(ch => {
        assert.equal(is.peek(), ch);
        assert.equal(is.next(), ch); // advance
      });

      assert.equal(is.eof(), true);
    });
  });

  describe("TokenStream", () => {

    it("string", () => {
      const text = `this "is" text 100 if then else`;
      const ts = parse(text);

      assert.deepEqual(ts.next(), { type: "var", value: "this" });
      assert.deepEqual(ts.next(), { type: "str", value: "is" });
      assert.deepEqual(ts.next(), { type: "var", value: "text" });
    });

    it("number", () => {
      const ts = new Ts(new Is("if name"));
      assert.deepEqual(ts.next(), { type: "kw", value: "if" });
      assert.deepEqual(ts.next(), { type: "var", value: "name" });
    });

    it("identifier", () => {
      const ts = new Ts(new Is("if name"));
      assert.deepEqual(ts.next(), { type: "kw", value: "if" });
      assert.deepEqual(ts.next(), { type: "var", value: "name" });
    });

    it("comment", () => {
      const text = `
      # this is comment
      "this is string includes # comment char"
      # ignored
      10`;
      const ts = new Ts(new Is(text));

      assert.deepEqual(ts.next(), { type: "str", value: "this is string includes # comment char" });
      assert.deepEqual(ts.next(), { type: "num", value: 10 });
      assert.equal(ts.eof(), true);
    });

    it("program", () => {
      const text = `
      # this is comment
      "this is string includes # comment char"
      # ignored
      10`;
      const ts = new Ts(new Is(text));

      assert.deepEqual(ts.next(), { type: "str", value: "this is string includes # comment char" });
      assert.deepEqual(ts.next(), { type: "num", value: 10 });
      assert.equal(ts.eof(), true);
    });
  });
});
