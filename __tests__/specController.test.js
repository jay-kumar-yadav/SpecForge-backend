const { generateSpecData } = require("../utils/generateSpecData");

describe("generateSpecData", () => {
  it("returns fallback spec when given valid input", async () => {
    const input = {
      title: "Test App",
      goal: "Test goal",
      users: [],
      constraints: "",
      templateType: "Web App",
      complexity: "Medium",
    };
    const spec = await generateSpecData(input);
    expect(spec).toBeDefined();
    expect(spec.title).toBe("Test App");
    expect(spec.goal).toBe("Test goal");
    expect(Array.isArray(spec.userStories)).toBe(true);
    expect(spec.userStories.length).toBeGreaterThan(0);
    expect(spec.tasks).toBeDefined();
    expect(spec.tasks.frontend).toBeDefined();
    expect(spec.tasks.backend).toBeDefined();
    expect(Array.isArray(spec.risks)).toBe(true);
  });

  it("uses template type to vary tasks", async () => {
    const webApp = await generateSpecData({
      title: "X",
      goal: "Y",
      users: [],
      templateType: "Web App",
      complexity: "Medium",
    });
    const apiService = await generateSpecData({
      title: "X",
      goal: "Y",
      users: [],
      templateType: "API Service",
      complexity: "Medium",
    });
    expect(webApp.tasks.frontend.length).toBeGreaterThan(0);
    expect(apiService.tasks.frontend.length).toBe(0);
  });
});
