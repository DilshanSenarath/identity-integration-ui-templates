#!/bin/bash

# Check if the required number of arguments are provided.
if [ "$#" -ne 4 ]; then
    echo "Usage: $0 <INTEGRATION_TYPE> <TEMPLATE_NAME> <VERSION_INCREMENT_TYPE>"
    exit 1
fi

# Read the inputs.
INTEGRATION_TYPE=$1
TEMPLATE_NAME=$2
VERSION_INCREMENT_TYPE=$3 # patch, minor, or major.


# Check if the integration exists.
if [ ! -d "$INTEGRATION_TYPE/$TEMPLATE_NAME" ]; then
    echo "Integration $TEMPLATE_NAME does not exist."
    exit 0
fi

# Get all tags, filter by pattern, and sort them.
previou_tag=$(git tag | grep -E "^@$INTEGRATION_TYPE/$TEMPLATE_NAME-v[0-9]+\.[0-9]+\.[0-9]+$" | sort -V | tail -n 1 || echo "")

if [[ -z "$previou_tag" ]]; then
    new_tag="$MAIN_VERSION"
else
    # Extract the version number using grep and regular expressions.
    if [[ $previou_tag =~ v([0-9]+)\.([0-9]+)\.([0-9]+) ]]; then
        major="${BASH_REMATCH[1]}"
        minor="${BASH_REMATCH[2]}"
        patch="${BASH_REMATCH[3]}"
    else
        echo "Failed to extract version number from previous release tag."
        exit 1
    fi

    if [[ "$VERSION_INCREMENT_TYPE" == "major" ]]; then
        ((major++))
    elif [[ "$VERSION_INCREMENT_TYPE" == "minor" ]]; then
        ((minor++))
    else
        ((patch++))
    fi

    new_tag="v${major}.${minor}.${patch}"
fi

# Create a temporary directory
temp_dir=$(mktemp -d)

# Copy the specified integration contents to the temporary directory
mkdir -p "$temp_dir/$INTEGRATION_TYPE/$TEMPLATE_NAME"
cp -r "$INTEGRATION_TYPE/$TEMPLATE_NAME"/* "$temp_dir/$INTEGRATION_TYPE/$TEMPLATE_NAME"

# Navigate to the parent directory of the temporary directory.
cd "$temp_dir"

# Create a zip file with the contents.
zip -r "$TEMPLATE_NAME-$new_tag.zip" "$INTEGRATION_TYPE"

# Navigate back to the previous directory.
cd - >/dev/null

# Create a release using GitHub CLI.
gh release create "@$INTEGRATION_TYPE/$TEMPLATE_NAME-$new_tag" "$temp_dir/$TEMPLATE_NAME-$new_tag.zip" --generate-notes

# Clean up: Remove the temporary directory.
rm -rf "$temp_dir"
