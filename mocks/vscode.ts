// import * as vscode from "vscode";

// export class MockPosition extends vscode.Position {
//   readonly line: number;
//   readonly character: number;

//   constructor(line: number, character: number) {
//     this.line = line;
//     this.character = character;
//   }

//   isBefore(other: MockPosition): boolean {
//     return (
//       this.line < other.line ||
//       (this.line === other.line && this.character < other.character)
//     );
//   }

//   isBeforeOrEqual(other: MockPosition): boolean {
//     return (
//       this.line < other.line ||
//       (this.line === other.line && this.character <= other.character)
//     );
//   }

//   isAfter(other: MockPosition): boolean {
//     return (
//       this.line > other.line ||
//       (this.line === other.line && this.character > other.character)
//     );
//   }

//   isAfterOrEqual(other: MockPosition): boolean {
//     return (
//       this.line > other.line ||
//       (this.line === other.line && this.character >= other.character)
//     );
//   }

//   isEqual(other: MockPosition): boolean {
//     return this.line === other.line && this.character === other.character;
//   }

//   compareTo(other: MockPosition): number {
//     if (this.isBefore(other)) return -1;
//     if (this.isAfter(other)) return 1;
//     return 0;
//   }

//   translate(lineDelta?: number, characterDelta?: number): MockPosition;
//   translate(change: {
//     lineDelta?: number;
//     characterDelta?: number;
//   }): MockPosition;
//   translate(
//     change: {
//       translate(lineDelta?: number, characterDelta?: number): MockPosition;
//     },
//     lineDelta?: number,
//     characterDelta?: number
//   ): MockPosition {
//     if (typeof lineDelta === "object") {
//       return this.translate(
//         lineDelta.lineDelta ?? 0,
//         lineDelta.characterDelta ?? 0
//       );
//     }
//     return new MockPosition(
//       this.line + lineDelta,
//       this.character + characterDelta
//     );
//   }

//   with(line?: number, character?: number): Position;
//   with(change: { line?: number; character?: number }): Position;
//   with(
//     change: {
//       line?: number;
//       character?: number;
//     },
//     line?: number,
//     character?: number
//   ): Position {
//     return new MockPosition(
//       line || change.line || this.line,
//       character || change.character || this.character
//     ) as any as vscode.Position;
//   }
// }

// class MockRange implements vscode.Range {
//   readonly start: MockPosition;
//   readonly end: MockPosition;

//   constructor(start: MockPosition, end: MockPosition) {
//     this.start = start;
//     this.end = end;
//   }
// }

// class MockTextLine implements vscode.TextLine {
//   readonly lineNumber: number;
//   readonly text: string;
//   readonly range: MockRange;
//   readonly rangeIncludingLineBreak: MockRange;
//   readonly firstNonWhitespaceCharacterIndex: number;
//   readonly isEmptyOrWhitespace: boolean;

//   constructor(
//     lineNumber: number,
//     text: string,
//     range: MockRange,
//     rangeIncludingLineBreak: MockRange
//   ) {
//     this.lineNumber = lineNumber;
//     this.text = text;
//     this.range = range;
//     this.rangeIncludingLineBreak = rangeIncludingLineBreak;
//     this.firstNonWhitespaceCharacterIndex =
//       this.findFirstNonWhitespaceCharacterIndex(text);
//     this.isEmptyOrWhitespace =
//       this.firstNonWhitespaceCharacterIndex === text.length;
//   }

//   private findFirstNonWhitespaceCharacterIndex(text: string): number {
//     return text.search(/\S|$/);
//   }
// }

// class MockTextDocument implements vscode.TextDocument {
//   text: string;

//   constructor(text: string) {
//     this.text = text;
//   }

//   lineAt(line: number) {
//     return this.text.split("\n")[line];
//   }
// }
