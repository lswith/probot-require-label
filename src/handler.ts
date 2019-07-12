import { Context } from "probot";
import { hasMatchingLabel, hasMissingLabel, ILabel } from "./labels";
import { ILabelMatch } from "./models";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function handle(
  context: Context,
  requiredLabels: ILabelMatch[],
  waitTimeMs: number
): Promise<void> {
  let labels: ILabel[] = context.payload.issue.labels;
  const issueNumber = context.issue().number;
  const owner = context.issue().owner;
  const repo = context.issue().repo;
  const logger = context.log.child({
    owner: owner,
    repo: repo,
    app: "probot-require-label"
  });

  if (!context.payload.label) {
    // wait as issue was just opened
    logger.debug(`waiting ${waitTimeMs}ms`);
    await sleep(waitTimeMs);
    // labels are now stale
    labels = [];
  }
  if (labels.length === 0) {
    // refresh labels from github
    await context.github.issues
      .listLabelsOnIssue(context.issue())
      .then(resp => {
        labels = resp.data;
      })
      .catch((err: any) => {
        throw new Error(
          `Couldn't list labels for issue: ${issueNumber}, error: ${err}`
        );
      });
    logger.debug(`refreshed labels: ${labels}`);
  }

  for (const l of requiredLabels) {
    const regex = new RegExp(l.regex);

    // add the missing label when the regex doesn't match and the label isn't there
    if (
      hasMissingLabel(labels, l.missingLabel) === false &&
      hasMatchingLabel(labels, regex) === false
    ) {
      await context.github.issues
        .addLabels(context.issue({ labels: [l.missingLabel] }))
        .catch((err: any) => {
          throw new Error(
            `Couldn't add labels for issue: ${issueNumber}, error: ${err}`
          );
        });
      logger.debug(`added labels ${l.missingLabel}`);
    }

    // remove the label when the regex matches and the label is there
    if (
      hasMissingLabel(labels, l.missingLabel) &&
      hasMatchingLabel(labels, regex)
    ) {
      await context.github.issues
        .removeLabel(context.issue({ name: l.missingLabel }))
        .catch((err: any) => {
          throw new Error(
            `Couldn't remove label: ${l.missingLabel} for issue: ${issueNumber}, error: ${err}`
          );
        });
      logger.debug(`removed labels: ${l.missingLabel}`);
    }
  }
}
