import { ILabel } from "../labels";
import { FakeGithub } from "./fakegithub";

export class FakeIssueApi {
  private top: FakeGithub;

  constructor(top: FakeGithub) {
    this.top = top;
  }

  public async addLabels(params: {
    owner: string;
    repo: string;
    issue_number: number;
    labels: string[];
  }) {
    this.top.labelsAdded.push(...params.labels);
    this.top.labels.push(...params.labels);
    return new Promise((resolve) => {
      resolve({
        data: [],
      });
    });
  }

  public async removeLabel(params: {
    owner: string;
    repo: string;
    issue_number: number;
    name: string;
  }) {
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

  public async listLabelsOnIssue(params: {
    owner: string;
    repo: string;
    issue_number: number;
  }) {
    return new Promise((resolve) => {
      const labels: ILabel[] = [];
      this.top.labels.forEach((label) => {
        labels.push({ name: label });
      });
      resolve({
        data: labels,
      });
    });
  }
}
