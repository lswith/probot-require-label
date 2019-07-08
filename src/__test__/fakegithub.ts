import { FakeIssueApi } from "./fakeissueapi";

export class FakeGithub {
  public labels: string[];
  public labelsAdded: string[];
  public labelsRemoved: string[];
  public issues: object;

  constructor(initialLabels: string[]) {
    this.labels = initialLabels;
    this.labelsAdded = [];
    this.labelsRemoved = [];
    this.issues = new FakeIssueApi(this);
  }
}
