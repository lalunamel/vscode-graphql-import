import { describe, it, expect } from "bun:test";
import {
  getTextBetweenImportAndCursor,
  shouldProvideCompletionItems,
} from "./extension";

describe("extension", () => {
  describe("shouldProvideCompletionItems", () => {
    it.each([
      ["|", false],
      ["a|", false],
      ["b|", false],
      ["#import|", false],
      ["#import |", false],
      ['#import "|', true],
      ["#import '|", true],
      ["#|import '", false],
      ["#import| '", false],
      ["#import '|'", true],
      [' #import "|', false],
      ['# import "|', false],
    ])(
      'maybe returns true when the line is "%s"',
      (line: string, expectedOutput: boolean) => {
        const characterPosition = line.indexOf("|");
        const text =
          line.substring(0, characterPosition) +
          line.substring(characterPosition + 1);
        expect(shouldProvideCompletionItems(text, characterPosition)).toEqual(
          expectedOutput
        );
      }
    );
  });

  // Functions exported purely for testing
  describe("getPathBeforeCursor", () => {
    describe("when the cursor is at the beginning", () => {
      it("returns an empty string", () => {
        const line = '#import "./foo/bar.graphql"';
        const cursorPosition = 0;

        expect(getTextBetweenImportAndCursor(line, cursorPosition)).toEqual("");
      });
    });

    describe("when the cursor is in the middle", () => {
      it("returns the first part of the path", () => {
        const line = '#import "./foo/bar.graphql"';
        const cursorPosition = line.indexOf("foo/ba") + "foo/ba".length;

        expect(getTextBetweenImportAndCursor(line, cursorPosition)).toEqual(
          "./foo/ba"
        );
      });
    });

    describe("when the cursor is at the end inside the quote", () => {
      it("returns the entire path", () => {
        const line = '#import "./foo/bar.graphql"';
        const cursorPosition = line.indexOf("graphql") + "graphql".length;

        expect(getTextBetweenImportAndCursor(line, cursorPosition)).toEqual(
          "./foo/bar.graphql"
        );
      });
    });

    describe("when the cursor is at the end outside the quote", () => {
      it("returns the entire path plus the ending quote", () => {
        const line = '#import "./foo/bar.graphql"';
        const cursorPosition = line.indexOf("graphql") + "graphql".length + 1;

        expect(getTextBetweenImportAndCursor(line, cursorPosition)).toEqual(
          './foo/bar.graphql"'
        );
      });
    });
  });
});
