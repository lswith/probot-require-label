import { handle } from "../handler";
import { ILabel } from "../labels";
import { FakeContext } from "./fakecontext";

class FakeGithub {
  public labels: string[];
  public labelsAdded: string[];
  public labelsRemoved: string[];
  public issues: object;

  constructor(initialLabels: string[]) {
    this.labels = initialLabels;
    this.labelsAdded = [];
    this.labelsRemoved = [];

    this.issues = new (class {
      private top: FakeGithub;

      constructor(top: FakeGithub) {
        this.top = top;
      }

      public async addLabels(params: {owner: string, repo: string, issue_number: number, labels: string[]}) {
        this.top.labelsAdded.push(...params.labels);
        this.top.labels.push(...params.labels);
        return new Promise((resolve) => {
          resolve({
            data: [],
          });
        });
      }

      public async removeLabel(params: {owner: string, repo: string, issue_number: number, name: string}) {
        this.top.labelsRemoved.push(params.name);
        this.top.labels = this.top.labels.filter((flabel) => {
          return flabel !== params.name;
        });
        return new Promise((resolve) => {
          resolve({
            data: [],
          });
        });
      }

      public async listLabelsOnIssue(params: {owner: string, repo: string, issue_number: number}) {
        return new Promise((resolve) => {
          const labels: ILabel[] = [];
          this.top.labels.forEach((label) => {
            labels.push({name: label});
          });
          resolve({
            data: labels,
          });
        });
      }
    })(this);
  }
}

it("adds needs-area label to Issue when a label doesn't match area:.* on the issue", () => {
  expect.assertions(1);
  const github = new FakeGithub([]);
  const context = new FakeContext({ issue: { labels: []}}, github, {});
  return handle(context, [{ missingLabel: "needs-area", regex: "area:.*" }], 1).then((resp) => {
    expect(github.labels).toContain("needs-area");
  });
});

it("doesn't add needs-area label to the issue when needs-area label is already on the issue", () => {
  expect.assertions(2);
  const github = new FakeGithub(["needs-area"]);
  const context = new FakeContext({ issue: { labels: []}}, github, {});
  return handle(context, [{ missingLabel: "needs-area", regex: "area:.*" }], 1).then((resp) => {
    expect(github.labels).toEqual(["needs-area"]);
    expect(github.labelsAdded).toEqual([]);
  });
});

it("doesn't add needs-area label to the issue when a label matching area/.* is on the issue", () => {
  expect.assertions(2);
  const github = new FakeGithub(["area:test"]);
  const context = new FakeContext({ issue: { labels: []}}, github, {});
  return handle(context, [{ missingLabel: "needs-area", regex: "area:.*" }], 1).then((resp) => {
    expect(github.labels).toEqual(["area:test"]);
    expect(github.labelsAdded).toEqual([]);
  });
});

it("removes needs-area label on the issue when a label matching area/.* exists on the issue", () => {
  expect.assertions(2);
  const github = new FakeGithub(["area:test", "needs-area"]);
  const context = new FakeContext({ issue: { labels: [], label: "area:test" }}, github, {});
  return handle(context, [{ missingLabel: "needs-area", regex: "area:.*" }], 1).then((resp) => {
    expect(github.labels).toEqual(["area:test"]);
    expect(github.labelsRemoved).toEqual(["needs-area"]);
  });
});

it("doesn't remove needs-area label on then issue when a label doesn't match area/.* on the issue", () => {
  expect.assertions(2);
  const github = new FakeGithub(["test:test", "needs-area"]);
  const context = new FakeContext({ issue: { labels: [], label: "test:test" }}, github, {});
  return handle(context, [{ missingLabel: "needs-area", regex: "area:.*" }], 1).then((resp) => {
    expect(github.labels).toEqual(["test:test", "needs-area"]);
    expect(github.labelsRemoved).toEqual([]);
  });
});
