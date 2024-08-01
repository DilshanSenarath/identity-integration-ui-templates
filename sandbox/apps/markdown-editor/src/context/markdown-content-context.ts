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

import { Context, createContext } from "react";

/**
 * Props interface for MarkdownContentContext.
 */
export interface MarkdownContentContextProps {
    /**
     * Markdown content.
     */
    content: string;
    /**
     * Function to change the markdown content.
     */
    setContent: (content: string) => void;
    /**
     * Function to clear the current markdown content.
     */
    clearContent: () => void;
    /**
     * Function to convert the multiline markdown
     * content to a single line string.
     */
    getSingleLineContent: () => string;
}

/**
 * Context object for managing markdown content.
 */
const MarkdownContentContext: Context<MarkdownContentContextProps> =
    createContext<MarkdownContentContextProps>({
        clearContent: () => { },
        content: "",
        getSingleLineContent: () => "",
        setContent: () => { }
    });

/**
 * Display name for the MarkdownContentContext.
 */
MarkdownContentContext.displayName = "MarkdownContentContext";

export default MarkdownContentContext;
