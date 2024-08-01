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

import react from "@vitejs/plugin-react";
import { Plugin, defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [ react(), nodePolyfills() ],
    build: {
        rollupOptions: {
            plugins: [
                nodeResolve({
                    modulePaths: [
                        path.join(__dirname, "node_modules"),
                        path.join(__dirname, "..", "..", "node_modules"),
                        path.join(__dirname, "..", "..", "packages", "react-components", "node_modules")
                    ]
                }) as Plugin
            ]
        }
    },
    resolve: {
        alias: {
            "@wso2is/react-components": path.join(__dirname, "..", "..", "packages", "react-components")
        }
    }
});
