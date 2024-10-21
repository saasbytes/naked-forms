// @ts-check

/** @type {import("syncpack").RcFile} */
const config= {
  semverGroups: [
    {
      label: "use exact version numbers in production",
      packages: ["@naked-forms/*"],
      dependencyTypes: ["prod"],
      dependencies: ["**"],
      range: "",
    },
  ],
}

module.exports = config
