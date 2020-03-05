/**
 *  Preparser module : (https://github.com/rtoal/plainscript/blob/master/src/syntax/preparser.ts)
 *
 */

module.exports = source => {
  const stack = [0];
  const result = "";
  const input = source.endsWith("\n") ? source : `${source}\n`;
  const lineRegex = /( *)([^\n]*\n)/g;

  for (
    let match = lineRegex.exec(input);
    match != null;
    match = lineRegex.exec(input)
  ) {
    const [indent, content] = [match[1].length, match[2]];

    if (content === "\n") {
      result += content;
    } else if (/\s/.test(content[0])) {
      throw new Error(
        "Illegal whitespace character: \\u{" +
          content.charCodeAt(0).toString(16) +
          "}"
      );
    } else if (indent === stack[stack.length - 1]) {
      result += content;
    } else if (indent > stack[stack.length - 1]) {
      stack.push(indent);
      result += `⇨${content}`;
    } else {
      for (let dedents = 1; true; dedents += 1) {
        const nextStep = (stack.pop(), stack[stack.length - 1]);
        if (indent > nextStep) {
          throw new Error("Indent Error");
        } else if (indent === nextStep) {
          result += "" + "⇦".repeat(dedents) + content;
          break;
        }
      }
    }
  }
  if (stack.length > 1) {
    result += "⇦".repeat(stack.length - 1) + "\n";
  }
  return result;
};
