import { createAppAuth, createOAuthUserAuth } from "../src/index.ts";
import { describe, test, expect } from "vitest";

describe("smoke tests", () => {
  test("createAppAuth() is a function", () => {
    expect(createAppAuth).toBeInstanceOf(Function);
  });
  test("createOAuthUserAuth() is a function", () => {
    expect(createOAuthUserAuth).toBeInstanceOf(Function);
  });
});
