import { FakeIssueApi } from "./fakeissueapi";

export class FakeGithub {
  public labels: string[];
  public labelsAdded: string[];
  public labelsRemoved: string[];
  public issues: object;
  public event: string;

  constructor(initialLabels: string[], event: string = "issues") {
    this.labels = initialLabels;
    this.labelsAdded = [];
    this.labelsRemoved = [];
    this.issues = new FakeIssueApi(this);
    this.event = event;
  }
}
