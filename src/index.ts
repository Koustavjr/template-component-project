#!/usr/bin/env node
import { Command } from "commander";
import { importTemplate } from "./utils/template.js";
import { importComponent } from "./utils/component.js";

const program = new Command();

program.version("0.0.1").description("CLI for downloading templates")

program
    .command("init <template>")
    .description("Initialize a new backend project")
    .action(importTemplate)
    ;

program.
    command("component <component>")
    .description("Initialize a new component")
    .action(importComponent)
    ;

program.parse(process.argv);