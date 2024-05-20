import * as vscode from 'vscode';
import axios from 'axios';
import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';

// Configure the simple-git instance
const options: Partial<SimpleGitOptions> = {
    baseDir: vscode.workspace.rootPath,
    binary: 'git',
    maxConcurrentProcesses: 6,
};
const git: SimpleGit = simpleGit(options);

interface GitFile {
    path: string;
    working_dir: string;
}

async function getAiSuggestion(changes: string): Promise<string> {
    const config = vscode.workspace.getConfiguration('gitCommitAutocomplete');
    const apiKey = config.get<string>('apiKey');

    if (!apiKey) {
        throw new Error('API key is not set.');
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo', // Specify the model you are using
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: `Generate a git commit message for the following changes:\n\n${changes}` }
            ],
            max_tokens: 60,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (error.response.status === 429) {
                    vscode.window.showErrorMessage('Rate limit exceeded. Please wait before trying again.');
                } else {
                    vscode.window.showErrorMessage(`OpenAI API error: ${error.response.status} - ${error.response.statusText}`);
                    vscode.window.showErrorMessage(`Response data: ${JSON.stringify(error.response.data)}`);
                }
            } else if (error.request) {
                // The request was made but no response was received
                vscode.window.showErrorMessage('No response received from OpenAI API.');
            } else {
                // Something happened in setting up the request that triggered an Error
                vscode.window.showErrorMessage(`Error in setting up API request: ${error.message}`);
            }
        } else {
            vscode.window.showErrorMessage(`Unknown error: ${(error as any).message}`);
        }
        throw error;
    }
}

async function suggestCommitMessage() {
    const config = vscode.workspace.getConfiguration('gitCommitAutocomplete');
    const apiKey = config.get<string>('apiKey');

    if (!apiKey) {
        const openSettings = 'Open Settings';
        const selection = await vscode.window.showErrorMessage(
            'API key for OpenAI\'s ChatGPT is not set. Please configure it in the settings. To get an API key, sign up at https://beta.openai.com/signup and generate an API key in the API section.',
            openSettings
        );

        if (selection === openSettings) {
            vscode.commands.executeCommand('workbench.action.openSettings', 'gitCommitAutocomplete.apiKey');
        }

        return;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder is open.');
        return;
    }

    const workspacePath = workspaceFolders[0].uri.fsPath;
    // vscode.window.showInformationMessage(`Using workspace path: ${workspacePath}`);
    const git: SimpleGit = simpleGit(workspacePath);

    try {
        const status = await git.status();
        // vscode.window.showInformationMessage('Git status retrieved successfully');

        if (status.files.length === 0) {
            vscode.window.showInformationMessage('No changes to commit.');
            return;
        }

        const changes = status.files.map((file: GitFile) => `File: ${file.path}\n${file.working_dir}`).join('\n');
        const commitMessage = await getAiSuggestion(changes);

        const userChoice = await vscode.window.showInformationMessage(
            `AI suggested commit message:\n"${commitMessage}"\nDo you want to use this message?`,
            'Yes',
            'No'
        );

        if (userChoice === 'Yes') {
            await git.commit(commitMessage, status.files.map((file: GitFile) => file.path));
            vscode.window.showInformationMessage('Commit successful!');
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error: ${(error as any).message}`);
        if ((error as any).message.includes('not a git repository')) {
            vscode.window.showErrorMessage('The workspace is not a Git repository.');
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('git-commit-autocomplete.suggestCommitMessage', suggestCommitMessage);
    context.subscriptions.push(disposable);
}

export function deactivate() {}
