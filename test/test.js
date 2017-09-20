const assert = require("assert");
const lexer = require("../src/lexer");

const Is = lexer.InputStream;
const Ts = lexer.TokenStream;

describe("Lexer", () => {

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
    const ts = new Ts(new Is("if name"));

    it("identifier", () => {
      assert.deepEqual(ts.next(), { type: "kw", value: "if" });
      assert.deepEqual(ts.next(), { type: "var", value: "name" });
    });
  });
});
