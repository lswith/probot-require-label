import { Application, Context } from "probot";
import { ConfigManager } from "./config";
import { handle } from "./handler";
import { IConfig, schema } from "./models";

const configManager = new ConfigManager<IConfig>("relabel.yml", {}, schema);

module.exports = async (app: Application) => {

  app.on(["issue:opened",
         "issue:reopened",
         "issue:labeled",
         "issue:unlabeled"], async (context: Context) => {
           const config = await configManager.getConfig(context).catch((err) => {
             context.log.error(err);
             return {} as IConfig;
           });
           if (config.requiredLabels) {
             await handle(context, config.requiredLabels!, 30000).catch((err) => {
               context.log.error(err);
             });
           }
         });
};
