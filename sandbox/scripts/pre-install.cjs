/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

const cp = require("child_process");
const fs = require("fs");
const path = require("path");

const IDENTITY_APPS_REPOSITORY = "https://github.com/DilshanSenarath/identity-apps.git";

// Function to delete a directory and its contents.
function deleteDirectory(dirPath) {
    try {
        cp.execSync(`rm -r ${dirPath}`, { stdio: "ignore" });
        console.log(`Successfully deleted ${dirPath}`);
    } catch (error) {
        console.error(`Error deleting directory: ${error.message}`);
    }
}

// Function to delete a file.
function deleteFile(filePath) {
    try {
        cp.execSync(`rm ${filePath}`, { stdio: "ignore" });
        console.log(`Successfully deleted ${filePath}`);
    } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
    }
}

// Function to check if Git is installed.
function checkGitInstalled() {
    try {
        // Use 'which' on Unix-like systems and 'where' on Windows.
        const gitCommand = process.platform === "win32" ? "where git" : "which git";
        cp.execSync(gitCommand);
    } catch (error) {
        console.error("Git is not installed or not found in PATH. Please install Git and try again.");
        process.exit(1);
    }
}

// Function to read, update, and save JSON file.
function updateJsonFile(filePath, updates, parentKey) {
    try {
        // Read the JSON file.
        const data = fs.readFileSync(filePath, "utf8");
        const json = JSON.parse(data);

        // Update the JSON properties.
        Object.keys(updates).forEach(key => {
            if (parentKey) {
                json[parentKey][key] = updates[key];
            } else {
                json[key] = updates[key];
            }
        });

        // Convert JSON object to string.
        const updatedData = JSON.stringify(json, null, 2);

        // Write the updated JSON back to the file.
        fs.writeFileSync(filePath, updatedData, "utf8");

        console.log(`Successfully updated ${filePath}`);
    } catch (error) {
        console.error(`Error updating JSON file: ${error.message}`);
        process.exit(1);
    }
}

checkGitInstalled();

console.log("Clearing the stale data...");
const tempDir = path.join(__dirname, "..", "tmp");
const nodeModulesDir = path.join(__dirname, "..", "node_modules");
const lockFile = path.join(__dirname, "..", "pnpm-lock.yaml");
const wso2ModulesDir = path.join(__dirname, "..", "packages");
deleteDirectory(tempDir);
deleteFile(lockFile);
deleteDirectory(nodeModulesDir);
deleteDirectory(wso2ModulesDir);

// Create a temporary folder to keep the cloned identity apps repo.
cp.execSync(`mkdir ${tempDir}`);

console.log("Cloning the identity-apps repository is in progress...");
cp.execSync(`git clone --depth 1 --branch sso-templates --single-branch ${IDENTITY_APPS_REPOSITORY} ${tempDir}`);


console.log("Updating the react-components package.json...");
const filePath = path.join(tempDir, "modules", "react-components", "package.json");
const entryPointUpdate = {
    "main": "./dist/index.esm.js",
    "types": "./dist/src/index.d.ts"
}
updateJsonFile(filePath, entryPointUpdate);
const dependencyUpdate = {
    "@wso2is/core": "workspace:*",
    "@wso2is/theme": "workspace:*"
}
updateJsonFile(filePath, dependencyUpdate, "dependencies");

// Change the current working directory to tmp.
try {
    process.chdir(tempDir);
    console.log(`Changed working directory to ${tempDir}`);
} catch (error) {
    console.error(`Error changing directory: ${error.message}`);
    process.exit(1);
}

console.log("Building the identity-apps repository is in progress...");
// Run pnpm install.
try {
    cp.execSync("pnpm install");
    console.log("Successfully ran pnpm install");
} catch (error) {
    console.error(`Error running pnpm install: ${error.message}`);
    process.exit(1);
}

// Run pnpm build:modules.
try {
    cp.execSync("pnpm nx run-many --target=build --projects=core,theme,react-components");
    console.log("Successfully ran pnpm build");
} catch (error) {
    console.error(`Error running pnpm build: ${error.message}`);
    process.exit(1);
}

// Change the current working directory to root.
try {
    process.chdir(path.join(tempDir, ".."));
    console.log(`Changed working directory to ${path.join(tempDir, "..")}`);
} catch (error) {
    console.error(`Error changing directory: ${error.message}`);
}

console.log("Clearing the unnecessary data...");
const reactComponentsSourceDir = path.join(__dirname, "..", "tmp", "modules", "react-components");
const coreSourceDir = path.join(__dirname, "..", "tmp", "modules", "core");
const themeSourceDir = path.join(__dirname, "..", "tmp", "modules", "theme");
const consoleThemeSourceFile = path.join(__dirname, "..", "tmp", "apps", "console", "src", "theme.ts");
const consoleThemeDestPath = path.join(__dirname, "..", "apps", "markdown-editor", "src", "console-theme.ts");

// Create a folder to keep identity-apps packages.
cp.execSync(`mkdir -p ${wso2ModulesDir}`);

try {
    cp.execSync(`cp -r ${reactComponentsSourceDir} ${wso2ModulesDir}`);
    cp.execSync(`cp -r ${coreSourceDir} ${wso2ModulesDir}`);
    cp.execSync(`cp -r ${themeSourceDir} ${wso2ModulesDir}`);
    cp.execSync(`cp -rf ${consoleThemeSourceFile} ${consoleThemeDestPath}`);
    console.log("Successfully copied the react-components, core, theme, and console-theme");
} catch (error) {
    console.error(`Error copying the react-components, core, theme, or console-theme: ${error.message}`);
    process.exit(1);
}

deleteDirectory(tempDir);
