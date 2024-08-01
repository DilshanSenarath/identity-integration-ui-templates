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

import { CodeEditor, Popup, PrimaryButton, SecondaryButton } from "@wso2is/react-components";
import * as codemirror from "codemirror";
import cloneDeep from "lodash-es/cloneDeep";
import { ReactElement, useState } from "react";
import useMarkdownContent from "../hooks/use-markdown-content";

export const Editor = (): ReactElement => {
    const { content, setContent, getSingleLineContent, clearContent } = useMarkdownContent();
    const [ currentCursor, setCurrentCursor ] = useState<codemirror.Position | undefined>(undefined);
    const [ open, setOpen ] = useState<boolean>(false);
    const [ copied, setCopied ] = useState<boolean>(false);
    const [ timeoutRef, setTimeoutRef ] = useState<unknown>(undefined);

    return (
        <div className="markdown-editor">
            <CodeEditor
                sourceCode={ content }
                options={ {
                    lineWrapping: true
                } }
                onChange={ (editor: codemirror.Editor, _data: unknown, value: string) => {
                    if (value === content && currentCursor) {
                        editor.setCursor(currentCursor);
                    }

                    setCurrentCursor(cloneDeep(editor?.getCursor()));

                    setContent(value);
                } }
                theme="light"
            />
            <div className="markdown-editor-buttons">
                <SecondaryButton
                    onClick={ () => clearContent() }
                >
                    Clear
                </SecondaryButton>
                <Popup
                    position="top center"
                    inverted
                    content={ copied ? "Markdown content copied successfully!" : "An error occurred while copying." }
                    open={ open }
                    trigger={
                        (
                            <PrimaryButton
                                onClick={ () => {
                                    if (timeoutRef) {
                                        clearTimeout(timeoutRef as number);
                                    }

                                    navigator?.clipboard?.writeText(getSingleLineContent())
                                        .then(() => setCopied(true))
                                        .catch(() => setCopied(false))
                                        .finally(() => {
                                            setOpen(true);
                                            setTimeoutRef(
                                                setTimeout(() => {
                                                    setOpen(false);
                                                    if (copied) setCopied(false);
                                                }, 3000)
                                            );
                                        });
                                } }
                            >
                                Copy as Single-Line Markdown
                            </PrimaryButton>
                        )
                    }
                />
            </div>
        </div>
    );
};
