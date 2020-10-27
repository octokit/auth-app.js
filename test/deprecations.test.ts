import { Deprecation } from "deprecation";
import { createAppAuth } from "../src/index";

describe("deprecations", () => {
  test("createAppAuth({ id }) - #44", () => {
    const warn = jest.fn();

    createAppAuth({
      id: 1,
      privateKey: "...",
      log: {
        warn,
      },
    });

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      new Deprecation(
        '[@octokit/auth-app] "createAppAuth({ id })" is deprecated, use "createAppAuth({ appId })" instead'
      )
    );
  });
});
