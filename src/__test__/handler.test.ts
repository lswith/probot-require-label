import { handle } from "../handler";
import { FakeContext } from "./fakecontext";
import { FakeGithub } from "./fakegithub";

it("adds needs-area label to Issue when a label doesn't match area:.* on the issue", () => {
  expect.assertions(1);
  const github = new FakeGithub([]);
  const context = new FakeContext({ issue: { labels: [] } }, github, {});
  return handle(
    context,
    [{ missingLabel: "needs-area", regex: "area:.*" }],
    1
  ).then((resp) => {
    expect(github.labels).toContain("needs-area");
  });
});

it("doesn't add needs-area label to the issue when needs-area label is already on the issue", () => {
  expect.assertions(2);
  const github = new FakeGithub(["needs-area"]);
  const context = new FakeContext({ issue: { labels: [] } }, github, {});
  return handle(
    context,
    [{ missingLabel: "needs-area", regex: "area:.*" }],
    1
  ).then((resp) => {
    expect(github.labels).toEqual(["needs-area"]);
    expect(github.labelsAdded).toEqual([]);
  });
});

it("doesn't add needs-area label to the issue when a label matching area/.* is on the issue", () => {
  expect.assertions(2);
  const github = new FakeGithub(["area:test"]);
  const context = new FakeContext({ issue: { labels: [] } }, github, {});
  return handle(
    context,
    [{ missingLabel: "needs-area", regex: "area:.*" }],
    1
  ).then((resp) => {
    expect(github.labels).toEqual(["area:test"]);
    expect(github.labelsAdded).toEqual([]);
  });
});

it("removes needs-area label on the issue when a label matching area/.* exists on the issue", () => {
  expect.assertions(2);
  const github = new FakeGithub(["area:test", "needs-area"]);
  const context = new FakeContext(
    { issue: { labels: [], label: "area:test" } },
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

it("doesn't remove needs-area label on then issue when a label doesn't match area/.* on the issue", () => {
  expect.assertions(2);
  const github = new FakeGithub(["test:test", "needs-area"]);
  const context = new FakeContext(
    { issue: { labels: [], label: "test:test" } },
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
