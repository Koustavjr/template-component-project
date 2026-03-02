#!/usr/bin/env node
import { Command } from "commander";
import { importTemplate } from "./utils/template.js";
const program = new Command();
program.version("0.0.1").description("CLI for downloading templates")
    .argument("<template>", "Select a backend template")
    .action(importTemplate);
program.parse(process.argv);
//# sourceMappingURL=index.js.map