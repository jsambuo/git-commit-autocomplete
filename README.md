# Git Commit Autocomplete

Git Commit Autocomplete is a Visual Studio Code extension that helps you generate git commit messages using OpenAI's GPT-3.5-turbo. The extension analyzes your changes and suggests a commit message based on the modifications made.

## Features

- AI-powered commit message suggestions
- Seamless integration with VSCode
- User prompts for accepting or rejecting suggested commit messages
- Configurable OpenAI API key
- Error handling for rate limiting and missing API key

## Requirements

- Visual Studio Code
- An OpenAI API key (Sign up at [OpenAI](https://platform.openai.com/api-keys) to get an API key)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/jsambuo/git-commit-autocomplete.git
```

2. Navigate to the extension directory:

```bash
cd git-commit-autocomplete
```

3. Install the dependencies:

```bash
npm install
```

4. Compile the extension:

```bash
npm run compile
```

5. Open the extension in VSCode:

```bash
code .
```

6. Press `F5` to open a new VSCode window with the extension loaded.

## Configuration

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
2. Type `Open Settings (JSON)` and select it.
3. Add the following configuration to set your OpenAI API key:

```json
"gitCommitAutocomplete.apiKey": "your-openai-api-key"
```

Replace `your-openai-api-key` with your actual OpenAI API key.

## Usage

1. Make some changes to your git repository.
2. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
3. Type `Suggest Commit Message` and select it.
4. If there are changes, the extension will suggest a commit message based on the modifications.
5. You can accept the suggested commit message to automatically commit your changes.

## Error Handling

- If the API key is not set, the extension will prompt you to configure it in the settings.
- If the rate limit is exceeded, a specific error message will inform you to wait before trying again.
- If there are no changes to commit, the extension will display a message and skip the API call.

## Development

To contribute or modify this extension, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/jsambuo/git-commit-autocomplete.git
```

2. Navigate to the extension directory:

```bash
cd git-commit-autocomplete
```

3. Install the dependencies:

```bash
npm install
```

4. Compile the extension:

```bash
npm run compile
```

5. Open the extension in VSCode:

```bash
code .
```

6. Press `F5` to open a new VSCode window with the extension loaded.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [OpenAI](https://openai.com) for providing the AI models used in this extension.
- [Simple-Git](https://github.com/steveukx/git-js) for simplifying git commands in Node.js.
- [Axios](https://github.com/axios/axios) for handling HTTP requests.

## Contact

For any questions or feedback, please open an issue on the [GitHub repository](https://github.com/jsambuo/git-commit-autocomplete).
