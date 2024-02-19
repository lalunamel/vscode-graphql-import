import * as vscode from "vscode";

const GRAPHQL_LANGUAGE_IDENTIFIER = "graphql";
const TRIGGER_CHARACTERS = ['"', "'"];

export function activate(context: vscode.ExtensionContext) {
  let completionProvider = vscode.languages.registerCompletionItemProvider(
    GRAPHQL_LANGUAGE_IDENTIFIER,
    {
      provideCompletionItems(document, position, token, context) {
        const lineText = document.lineAt(position.line).text;
        const firstSingleQuotePosition = lineText.indexOf("'");
        const lastSingleQuotePosition = lineText.lastIndexOf("'");
        const firstDoubleQuotePosition = lineText.indexOf('"');
        const lastDoubleQuotePosition = lineText.lastIndexOf('"');

        const lineStartsWithIndexExpression = lineText.startsWith("#import ");

        console.log("lineText", lineText);
        console.log(
          "lineStartsWithIndexExpression",
          lineStartsWithIndexExpression
        );

        if (lineStartsWithIndexExpression) {
          const cursorPosition = position.character;
          const usingSingleQuotes = firstSingleQuotePosition !== -1;
          const usingDoubleQuotes = firstDoubleQuotePosition !== -1;
          const hasClosingQuote = usingSingleQuotes
            ? firstSingleQuotePosition !== lastSingleQuotePosition
            : firstDoubleQuotePosition !== lastDoubleQuotePosition;

          console.log("cursorPosition", cursorPosition);
          console.log("firstDoubleQuotePosition", firstDoubleQuotePosition);
          console.log("lastDoubleQuotePosition", lastDoubleQuotePosition);

          let cursorWithinQuotes = false;
          if (usingSingleQuotes) {
            if (hasClosingQuote) {
              cursorWithinQuotes =
                cursorPosition > firstSingleQuotePosition &&
                cursorPosition <= lastSingleQuotePosition;
            } else {
              cursorWithinQuotes = cursorPosition > firstSingleQuotePosition;
            }
          }
          if (usingDoubleQuotes) {
            if (hasClosingQuote) {
              cursorWithinQuotes =
                cursorPosition > firstDoubleQuotePosition &&
                cursorPosition <= lastDoubleQuotePosition;
            } else {
              cursorWithinQuotes = cursorPosition > firstDoubleQuotePosition;
            }
          }
          console.log("cursorWithinQuotes", cursorWithinQuotes);
          if (cursorWithinQuotes) {
            return [new vscode.CompletionItem("butts")];
          }
        }
        return [];
      },
    },
    ...TRIGGER_CHARACTERS
  );

  context.subscriptions.push(completionProvider);
}
export function deactivate() {}
