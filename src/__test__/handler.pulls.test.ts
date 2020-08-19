import { handle } from "../handler";
import { FakeContext } from "./fakecontext";
import { FakeGithub } from "./fakegithub";

it("adds needs-area label to pull request when a label doesn't match area:.* on the pull request", () => {
  expect.assertions(1);
  const github = new FakeGithub([], "pull_request");
  const context = new FakeContext({ pull_request: { labels: [] } }, github, {});
  return handle(
    context,
    [{ missingLabel: "needs-area", regex: "area:.*" }],
    1
  ).then((resp) => {
    expect(github.labels).toContain("needs-area");
  });
});

it("doesn't add needs-area label to the pull request when needs-area label is already on the pull request", () => {
  expect.assertions(2);
  const github = new FakeGithub(["needs-area"], "pull_request");
  const context = new FakeContext({ pull_request: { labels: [] } }, github, {});
  return handle(
    context,
    [{ missingLabel: "needs-area", regex: "area:.*" }],
    1
  ).then((resp) => {
    expect(github.labels).toEqual(["needs-area"]);
    expect(github.labelsAdded).toEqual([]);
  });
});

it("doesn't add needs-area label to the pull request when a label matching area/.* is on the pull request", () => {
  expect.assertions(2);
  const github = new FakeGithub(["area:test"], "pull_request");
  const context = new FakeContext({ pull_request: { labels: [] } }, github, {});
  return handle(
    context,
    [{ missingLabel: "needs-area", regex: "area:.*" }],
    1
  ).then((resp) => {
    expect(github.labels).toEqual(["area:test"]);
    expect(github.labelsAdded).toEqual([]);
  });
});

it("removes needs-area label on the pull request when a label matching area/.* exists on the pull request", () => {
  expect.assertions(2);
  const github = new FakeGithub(["area:test", "needs-area"], "pull_request");
  const context = new FakeContext(
    { pull_request: { labels: [], label: "area:test" } },
    github,
    {}
  );
  return handle(
    context,
    [{ missingLabel: "needs-area", regex: "area:.*" }],
    1
  ).then((resp) => {
    expect(github.labels).toEqual(["area:test"]);
    expect(github.labelsRemoved).toEqual(["needs-area"]);
  });
});

it("doesn't remove needs-area label on then pull request when a label doesn't match area/.* on the pull request", () => {
  expect.assertions(2);
  const github = new FakeGithub(["test:test", "needs-area"], "pull_request");
  const context = new FakeContext(
    { pull_request: { labels: [], label: "test:test" } },
    github,
    {}
  );
  return handle(
    context,
    [{ missingLabel: "needs-area", regex: "area:.*" }],
    1
  ).then((resp) => {
    expect(github.labels).toEqual(["test:test", "needs-area"]);
    expect(github.labelsRemoved).toEqual([]);
  });
});
