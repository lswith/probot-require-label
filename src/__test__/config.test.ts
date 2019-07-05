import { ConfigManager } from "../config";
import { schema } from "../models";
import { FakeContext } from "./fakecontext";

class FakeConfig {
  public defaultConfig: any;
  public filename: string;
  public returnedResult: object;

  constructor(result: object) {
    this.returnedResult = result;
    this.filename = "";
  }

  public async getConfig(filename: string, defaultConfig: any): Promise<any> {
    this.filename = filename;
    this.defaultConfig = defaultConfig;
    return new Promise((resolve) => {
      resolve(this.returnedResult);
    });
  }
}

it("grabs config from the context", () => {
  expect.assertions(1);
  const manager = new ConfigManager("relabel.yaml", {}, schema);
  const config = new FakeConfig({
    requiredLabels: [{
      missingLabel: "test",
      regex: "test",
    }],
  });
  const configMethod = config.getConfig.bind(config);
  const context = new FakeContext({}, {}, configMethod);
  return manager.getConfig(context).then((cconfig) => {
    expect(cconfig).toHaveProperty("requiredLabels");
  });
});

it("throws if invalid config", () => {
  expect.assertions(2);
  const manager = new ConfigManager("relabel.yaml", {}, schema);
  const config = new FakeConfig({
    required_labels: [{
      missingLabel: "test",
      regex: "test",
    }],
  });
  const configMethod = config.getConfig.bind(config);
  const context = new FakeContext({}, {}, configMethod);
  return manager.getConfig(context).catch((err) => {
    expect(err).toBeDefined();
    expect(err.message).toContain("Invalid Config");
  });
});
