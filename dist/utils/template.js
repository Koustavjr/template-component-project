import inquirer from "inquirer";
import fs from "fs-extra";
import { select } from "@inquirer/prompts";
import ora from "ora";
import path from "path";
import { execSync } from "child_process";
import chalk from "chalk";
import templates from "../templates/templates.json" with { type: "json" };
import { simpleGit } from "simple-git";
import { chdir } from "process";
export const importTemplate = async (template) => {
    const Projectpath = path.join(process.cwd(), template);
    if (fs.existsSync(Projectpath)) {
        console.log(chalk.red(`Project with name ${template} already exists`));
        process.exit(1);
    }
    /* const answers = await inquirer.prompt([
         {
             type: "list",
             name: "template",
             message: "Select the template you want to start with...",
             choices: [
                 { name: "Backend-Setup", value: "backend" },
                 { name: "Authentication-Setup", value: "auth" }
             ],
             default: "backend",
             pageSize: 10
         },
     ]);*/
    const answers = await select({
        message: "Select the template you want to start with...",
        choices: [
            { name: "Backend-Setup", value: "backend" },
            { name: "Authentication-Setup", value: "auth" }
        ],
        default: "backend",
    });
    const url = answers === "backend" ? templates.backend : templates.auth;
    fs.mkdirSync(Projectpath);
    const spinner = ora(`Downloading ${answers} template`).start();
    const git = simpleGit();
    try {
        await git.clone(url, Projectpath);
        spinner.succeed(`Downloaded ${answers} template`);
        chdir(Projectpath);
        spinner.start('Installing dependencies...');
        execSync("npm install", { stdio: "inherit" });
        spinner.succeed('Installed dependencies');
        console.log(chalk.green(`Project ${template} created successfully`));
        console.log(chalk.green(`Navigate to ${Projectpath} to start working on your project`));
    }
    catch (error) {
        console.log(chalk.red(`Error creating project ${template}`));
        console.log(error);
    }
};
//# sourceMappingURL=template.js.map