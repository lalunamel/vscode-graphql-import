import * as vscode from "vscode";
import path from "node:path";

const GRAPHQL_LANGUAGE_IDENTIFIER = "graphql";
const TRIGGER_CHARACTERS = ['"', "'", "/"];
const URI_SCHEME_FILE = "file";

type AbsolutePath = string;
type RelativePath = string;

/**
 * Whether or not completions should be returned
 *
 * If the line the user is on starts with `#import '` or `#import "`
 * and the cursor is after that text, return true
 * Also return true if that quote is closed and the cursor is inside the closed section
 *
 * @param line The line the user is on
 * @param cursorPosition The user's caret/cursor position within that line
 */
export const shouldProvideCompletionItems = (
  line: string,
  cursorPosition: number
): boolean => {
  if (!line.startsWith("#import ")) return false;

  const quoteType = line.includes("'") ? "'" : line.includes('"') ? '"' : null;
  if (!quoteType) return false;

  const firstQuotePosition = line.indexOf(quoteType);
  const lastQuotePosition = line.lastIndexOf(quoteType);

  const cursorAfterFirstQuote = cursorPosition > firstQuotePosition;
  const onlyOneQuote = lastQuotePosition === firstQuotePosition;
  const cursorBeforeLastQuote = cursorPosition <= lastQuotePosition;
  return cursorAfterFirstQuote && (onlyOneQuote || cursorBeforeLastQuote);
};

/**
 * Gets the currently active file in the editor.
 * @returns {AbsolutePath | undefined} The path of the current file, or undefined if no file is active.
 */
const getCurrentFilePath = (): AbsolutePath | undefined => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return undefined;
  }

  const currentFileUri = activeEditor.document.uri;
  return currentFileUri.fsPath;
};

/**
 * Gets the absolute path of the currently active file in the editor.
 * @returns {AbsolutePath | undefined} The directory path of the current file, or undefined if no file is active.
 */
const getCurrentFileDirectoryPath = (): AbsolutePath | undefined => {
  const currentFile = getCurrentFilePath();
  if (currentFile === undefined) {
    return undefined;
  }
  return path.dirname(currentFile);
};

/**
 * Finds all .graphql files within a specified directory.
 * @param {string} directory The directory in which to search for .graphql files.
 * @returns {Promise<vscode.Uri[]>} A promise that resolves to an array of Uri objects pointing to .graphql files.
 */
const findGraphqlFilesInDirectory = async (
  directory: string | undefined
): Promise<vscode.Uri[]> => {
  if (directory === undefined) {
    return [];
  }

  const pattern = new vscode.RelativePattern(directory, "*.graphql");
  try {
    const graphqlFiles = await vscode.workspace.findFiles(pattern);
    return graphqlFiles;
  } catch (error) {
    console.error("Error finding .graphql files:", error);
    return [];
  }
};

export const getTextBetweenImportAndCursor = (
  line: string,
  cursorPosition: number
): string => {
  if (cursorPosition < "#import ".length + 1) {
    return "";
  }
  return line.substring("#import ".length + 1, cursorPosition);
};

const provideCompletionItems = async (
  document: vscode.TextDocument,
  position: vscode.Position,
  token: vscode.CancellationToken,
  context: vscode.CompletionContext
): Promise<vscode.CompletionItem[] | undefined> => {
  const lineText = document.lineAt(position.line).text;
  const cursorPosition = position.character;

  if (shouldProvideCompletionItems(lineText, cursorPosition)) {
    // Get the text entered by the user after `#import "`
    const enteredText = getTextBetweenImportAndCursor(lineText, cursorPosition);

    // Get the path to the currently active file's directory
    const currentFileDirectoryPath = getCurrentFileDirectoryPath();
    if (currentFileDirectoryPath === undefined) {
      return undefined;
    }

    // Join the two to create a path to search for graphql files
    const pathToSearch = path.join(currentFileDirectoryPath, enteredText);

    // Get the GraphQL files at that path
    const files = await findGraphqlFilesInDirectory(pathToSearch);
    // TODO: Also find folders at that path

    // Get just the last part (i.e. basename) of the files that were returned
    const fileNames = files.map((file) => path.basename(file.path));

    const completionItems = fileNames.map(
      (name) => new vscode.CompletionItem(name)
    );
    return completionItems;
  }
  return [new vscode.CompletionItem("foobar")];
};

export const activate = (context: vscode.ExtensionContext) => {
  console.log("extension activated");
  let completionProvider = vscode.languages.registerCompletionItemProvider(
    GRAPHQL_LANGUAGE_IDENTIFIER,
    { provideCompletionItems },
    ...TRIGGER_CHARACTERS
  );

  context.subscriptions.push(completionProvider);
};
export const deactivate = () => {};
