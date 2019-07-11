import { Application, Context } from "probot";
import { ConfigManager } from "./config";
import { handle } from "./handler";
import { IConfig, schema } from "./models";

const configManager = new ConfigManager<IConfig>("relabel.yml", {}, schema);

module.exports = async (app: Application) => {
  const events = [
    "issues.opened",
    "issues.reopened",
    "issues.labeled",
    "issues.unlabeled"
  ];

  app.on(events, async (context: Context) => {
    context.log("Grabbing Config");
    const config = await configManager.getConfig(context).catch(err => {
      context.log.error(err);
      return {} as IConfig;
    });
    if (config.requiredLabels) {
      context.log(
        `Handling issue: ${context.issue().number}, ${context.issue().owner} ${
          context.issue().repo
        }`
      );
      await handle(context, config.requiredLabels!, 30000).catch(err => {
        context.log.error(err);
      });
    }
  });

  app.on("*", async context => {
    context.log({ event: context.event, action: context.payload.action });
  });
};
