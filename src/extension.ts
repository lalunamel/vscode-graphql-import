import * as vscode from "vscode";
import path from "node:path";

const GRAPHQL_LANGUAGE_IDENTIFIER = "graphql";
const TRIGGER_CHARACTERS = ['"', "'", "/"];

type AbsolutePath = string;

type File = {
  name: string;
  type: vscode.CompletionItemKind.Folder | vscode.CompletionItemKind.File;
};

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
 * Finds all .graphql files and all directories within a specified directory.
 * @param { AbsolutePath | undefined } path The directory in which to search for .graphql files and directories.
 * @returns {Promise<File[]>} A promise that resolves to an array of Uri objects pointing to .graphql files and directories.
 */
const findGraphqlFileAndDirectoryNames = async (
  path: AbsolutePath | undefined
): Promise<File[]> => {
  if (path === undefined) {
    return [];
  }

  const dirUri = vscode.Uri.file(path);

  try {
    const entries = await vscode.workspace.fs.readDirectory(dirUri);
    const uris = entries.flatMap(([name, type]) =>
      type === vscode.FileType.Directory || name.endsWith(".graphql")
        ? [
            {
              name: name,
              type:
                type === vscode.FileType.Directory
                  ? vscode.CompletionItemKind.Folder
                  : vscode.CompletionItemKind.File,
            } as File,
          ]
        : []
    );

    return uris;
  } catch (error) {
    console.warn("Error finding .graphql files and directories:", error);
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
    const pathToSearch: AbsolutePath = path.join(
      currentFileDirectoryPath,
      enteredText
    );

    // Get the GraphQL files and folders at that path
    const files = await findGraphqlFileAndDirectoryNames(pathToSearch);

    const completionItems = files.map(
      (file) => new vscode.CompletionItem(file.name, file.type)
    );
    return completionItems;
  }
};

export const activate = (context: vscode.ExtensionContext) => {
  let completionProvider = vscode.languages.registerCompletionItemProvider(
    GRAPHQL_LANGUAGE_IDENTIFIER,
    { provideCompletionItems },
    ...TRIGGER_CHARACTERS
  );

  context.subscriptions.push(completionProvider);
};
export const deactivate = () => {};
