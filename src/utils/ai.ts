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

export const importAiComponent = async (prompt: string) => {
    try {
        const res = await axios.post(`${REGISTRY_URL}/ai/generate`, {
            prompt
        });


        const data: Component = res.data;

        if (!data.files || data.files.length === 0) {
            console.log(chalk.red(`Component ${data.name} has no files`));
            process.exit(1);
        }

        const spinner = ora(`Downloading ${data.name} component`).start();
        const firstFile = data.files[0];
        if (!firstFile) {
            spinner.fail(chalk.red(`Component ${data.name} has no files`));
            process.exit(0);
        }
        for (let file of data.files) {
            const ComponentPath = path.join(process.cwd(), file.path);
            fs.ensureDirSync(path.dirname(ComponentPath));
            fs.writeFileSync(ComponentPath, file.content);
        }
        if (data.dependencies && data.dependencies.length > 0) {
            const dependencies: string[] = data.dependencies;
            spinner.start(`Installing dependencies for ${data.name} component`);
            let dependencyCollection = dependencies.join(" ");
            execSync(`npm install ${dependencyCollection}`, { stdio: "inherit" });
            spinner.succeed(`Installed dependencies for ${data.name} component`);
        }
        spinner.succeed(`Downloaded ${data.name} component`);
        console.log(chalk.green(`Component ${data.name} downloaded successfully`));
    } catch (error) {
        console.log(chalk.red(`Error downloading component for your promt: ${prompt}`));
        console.log(error);
    }

}