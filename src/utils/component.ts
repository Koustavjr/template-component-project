import inquirer from "inquirer";
import fs from "fs-extra";
import ora from "ora";
import path from "path";
import { execSync } from "child_process";
import chalk from "chalk";
import axios from "axios";

const REGISTRY_URL = "http://localhost:5000/registry/r";

/*{
  "name": "login-form",
  "dependencies": ["zod", "lucide-react"],
  "files": [
    {
      "path": "components/auth/login-form.tsx",
      "content": "export const LoginForm = () => { ... }"
    },
    {
      "path": "components/auth/login-schema.ts",
      "content": "import { z } from 'zod'; export const schema = ..."
    }
  ]
}*/


type Component = {
    name: string;
    dependencies: string[];
    files: {
        path: string;
        content: string;
    }[];
}

export const importComponent = async (component: string) => {
    try {
        const res = await axios.get(`${REGISTRY_URL}/${component}`);

        if (!res.data) {
            console.log(chalk.red(`Component ${component} not found`));
            process.exit(0);
        }

        const data: Component = res.data;

        if (!data.files || data.files.length === 0) {
            console.log(chalk.red(`Component ${component} has no files`));
            process.exit(0);
        }

        const spinner = ora(`Downloading ${component} component`).start();
        const firstFile = data.files[0];
        if (!firstFile) {
            spinner.fail(chalk.red(`Component ${component} has no files`));
            process.exit(0);
        }
        for (let file of data.files) {
            const ComponentPath = path.join(process.cwd(), file.path);
            fs.ensureDirSync(path.dirname(ComponentPath));
            fs.writeFileSync(ComponentPath, file.content);
        }
        if (data.dependencies && data.dependencies.length > 0) {
            const dependencies: string[] = data.dependencies;
            spinner.start(`Installing dependencies for ${component} component`);
            let dependencyCollection = dependencies.join(" ");
            execSync(`npm install ${dependencyCollection}`, { stdio: "inherit" });
            spinner.succeed(`Installed dependencies for ${component} component`);
        }
        spinner.succeed(`Downloaded ${component} component`);
        console.log(chalk.green(`Component ${component} downloaded successfully`));
    } catch (error) {
        console.log(chalk.red(`Error downloading component ${component}`));
        console.log(error);
    }

}