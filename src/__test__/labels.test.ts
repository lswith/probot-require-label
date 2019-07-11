import { hasMatchingLabel } from "../labels";

test("regex area:.* doesn't match any labels", () => {
  expect(hasMatchingLabel([{ name: "test" }], new RegExp("area:.*"))).toBe(
    false
  );
});

test("regex area:.* matched one of the labels", () => {
  expect(
    hasMatchingLabel(
      [{ name: "test" }, { name: "area:test" }],
      new RegExp("area:.*")
    )
  ).toBe(true);
});
