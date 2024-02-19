// import { describe, it, expect, spyOn, mock, jest, beforeEach } from "bun:test";
// import * as vscode from "vscode";
// import * as mockVSCode from "../mocks/vscode.ts";

// mock.module("vscode", () => mockVSCode);

// import { activate } from "./extension.ts";

// spyOn(vscode.languages, "registerCompletionItemProvider");

// const extensionContext: vscode.ExtensionContext = {
//   subscriptions: [],
// } as any;

// describe("extension", () => {
//   describe("activation", () => {
//     describe("the completion item provider", () => {
//       it("is applicable to graphql files", () => {
//         activate(extensionContext);

//         const selector = (
//           vscode.languages.registerCompletionItemProvider as jest.Mock
//         ).mock.calls[0][0];

//         expect(selector).toEqual("graphql");
//       });

//       it("is triggered on single and double quotes", () => {
//         activate(extensionContext);

//         const triggerCharacters = (
//           vscode.languages.registerCompletionItemProvider as jest.Mock
//         ).mock.calls[0].slice(2);

//         expect(triggerCharacters).toEqual(['"', "'"]);
//       });

//       describe("provideCompletionItems", () => {
//         let provideCompletionItems: Function;
//         beforeEach(() => {
//           activate(extensionContext);

//           const provider = (
//             vscode.languages.registerCompletionItemProvider as jest.Mock
//           ).mock.calls[0][1];
//           provideCompletionItems = provider.provideCompletionItems;
//         });

//         it("has the correct provider", () => {
//           const document: vscode.TextDocument = new;
//           const position: vscode.Position = {};
//           const cancellationToken: vscode.CancellationToken = {};
//           const completionContext: vscode.CompletionContext = {};
//         });
//       });
//     });
//   });
// });
