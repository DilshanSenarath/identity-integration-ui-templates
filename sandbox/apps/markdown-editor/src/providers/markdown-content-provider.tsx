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

import { FunctionComponent, PropsWithChildren, ReactElement, useEffect, useState } from "react";
import { MarkdownEditorConstants } from "../constants/markdown";
import MarkdownContentContext from "../context/markdown-content-context";

/**
 * Markdown content provider component.
 *
 * @param props - Props for the provider.
 * @returns MarkdownContentProvider.
 */
const MarkdownContentProvider: FunctionComponent<PropsWithChildren> = ({
    children
}: PropsWithChildren): ReactElement => {
    const [ content, setContent ] = useState<string>("");

    /**
     * Load the Markdown content from local storage.
     */
    useEffect(() => {
        const markdownContent: string = localStorage.getItem(
            MarkdownEditorConstants.MARKDOWN_CONTENT_LOCAL_STORAGE_KEY) ?? "";

        if (markdownContent) {
            setContent(convertMarkdownContentToMultiLine(markdownContent));
        }
    }, []);

    /**
     * A wrapper function to update local state and save it to local storage.
     *
     * @param content - Markdown content
     */
    const setMarkdownContent = (content: string) => {
        localStorage.setItem(
            MarkdownEditorConstants.MARKDOWN_CONTENT_LOCAL_STORAGE_KEY,
            convertMarkdownContentToSingleLine(content)
        );

        setContent(convertMarkdownContentToMultiLine(content));
    };

    /**
     * Function to clear the markdown content from local state and local storage.
     */
    const clearMarkdownContent = () => {
        localStorage.removeItem(MarkdownEditorConstants.MARKDOWN_CONTENT_LOCAL_STORAGE_KEY);
        setContent("");
    };

    /**
     * Convert multiline markdown content to a single line string.
     *
     * @param content - Markdown content.
     * @returns Markdown content as a single line.
     */
    const convertMarkdownContentToSingleLine = (content: string): string => {
        return content.replace(/\n/g, "\\n");
    };

    /**
     * Convert single line markdown content to a multiline content.
     *
     * @param content - Markdown content.
     * @returns Markdown content as a multiline string.
     */
    const convertMarkdownContentToMultiLine = (content: string): string => {
        return content.replace(/\\n/g, "\n");
    };

    return (
        <MarkdownContentContext.Provider
            value={
                {
                    clearContent: clearMarkdownContent,
                    content,
                    getSingleLineContent: () => convertMarkdownContentToSingleLine(content),
                    setContent: setMarkdownContent
                }
            }
        >
            { children }
        </MarkdownContentContext.Provider>
    );
};

export default MarkdownContentProvider;
