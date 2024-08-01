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

import AppBar from "@oxygen-ui/react/AppBar";
import Button from "@oxygen-ui/react/Button";
import Toolbar from "@oxygen-ui/react/Toolbar";
import Typography from "@oxygen-ui/react/Typography";
import { DocumentIcon } from "@oxygen-ui/react-icons";
import { ReactElement } from "react";

export const Header = (): ReactElement => {
    return (
        <AppBar color="inherit" position="static">
            <Toolbar>
                <Typography
                    sx={ {
                        flexGrow: 1
                    } }
                    variant="h6"
                >
                    Markdown Playground
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={ <DocumentIcon /> }
                    onClick={ () =>
                        window.open(
                            "https://github.com/wso2-extensions/identity-integration-ui-templates/blob/main/README.md",
                            "_blank",
                            "noopener,noreferrer"
                        )
                    }
                >
                    Docs
                </Button>
            </Toolbar>
        </AppBar>
    );
};
