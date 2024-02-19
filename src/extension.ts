import * as vscode from "vscode";

export const activate = (context: vscode.ExtensionContext) => {
  const disposable = vscode.commands.registerCommand(
    "lalunamel.graphql-import.helloworld",
    () => {
      vscode.window.showInformationMessage("Hello World!");
    }
  );

  context.subscriptions.push(disposable);
};

export const deactivate = () => {};
