import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import { dts } from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";

export default (commandLineArgs) => {
  return [
    {
      input: ["src/lib_index.ts"],
      output: [
        {
          dir: "dist",
          format: "cjs",
          sourcemap: true,
        },
        {
          dir: "dist",
          format: "esm",
          sourcemap: true,
        },
      ],
      plugins: [
        del({ targets: "dist/*" }),
        typescript({
          tsconfig: "./tsconfig.json",
        }), // Assuming you have a tsconfig.json
        !commandLineArgs.watch && terser(),
      ],
    },
    // Configuration for generating .d.ts files
    {
      input: "src/lib_index.ts",
      output: [{ file: "dist/types/lib_index.d.ts", format: "es" }],
      plugins: [dts()],
    },
  ];
};
