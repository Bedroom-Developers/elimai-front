require("dotenv").config();
module.exports = {
  api: {
    input:
      process.env.ORVAL_PATH_URL ||
      "https://petstore3.swagger.io/api/v3/openapi.json",
    output: {
      target: "./src/shared/api/generated.ts",
      client: "react-query",
      override: {
        mutator: {
          path: "./src/shared/lib/client/custom-instance.ts",
          name: "customInstance",
        },
        query: {
          useQuery: true,
        },
        mutation: {
          useMutation: true,
        },
      },
    },
  },
};
