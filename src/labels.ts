export interface ILabel {
  name: string;
}

export function hasMatchingLabel(labels: ILabel[], regex: RegExp): boolean {
  let didLabelMatch = false;
  for (const label of labels) {
    if (label.name.match(regex)) {
      didLabelMatch = true;
      break;
    }
  }
  return didLabelMatch;
}

export function hasMissingLabel(
  labels: ILabel[],
  missingLabel: string
): boolean {
  let didLabelMatch = false;
  for (const label of labels) {
    if (label.name === missingLabel) {
      didLabelMatch = true;
      break;
    }
  }
  return didLabelMatch;
}
