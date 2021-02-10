// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "rspecRunner" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let run = vscode.commands.registerCommand('rspecRunner.run', () => {
		let document = vscode.window.activeTextEditor?.document;
		let terminal = vscode.window.terminals[0];
		if (document == null) {
			vscode.window.showErrorMessage('No active text editor');
			return;
		}
		if (terminal == null) {
			vscode.window.showErrorMessage('No active terminal');
			return;
		}

		let relativePath = vscode.workspace.asRelativePath(document.uri.path);
		if (!relativePath.includes('.rb')) {
			vscode.window.showErrorMessage('Can only run rspec tests on Ruby files');
			return;
		}
		if (!relativePath.includes('_spec.rb')) {
			relativePath = relativePath.replace('app/', 'spec/').replace('.rb', '_spec.rb');
		}

		terminal.sendText(`bundle exec rspec ${relativePath}`);
	});

	context.subscriptions.push(run);

	let runForLine = vscode.commands.registerCommand('rspecRunner.runForLine', () => {
		let document = vscode.window.activeTextEditor?.document;
		let terminal = vscode.window.terminals[0];
		if (document == null) {
			vscode.window.showErrorMessage('No active text editor');
			return;
		}
		if (terminal == null) {
			vscode.window.showErrorMessage('No active terminal');
			return;
		}

		let relativePath = vscode.workspace.asRelativePath(document.uri.path);
		if (!relativePath.includes('.rb')) {
			vscode.window.showErrorMessage('Can only run rspec tests on Ruby files');
			return;
		}
		if (relativePath.includes('_spec.rb')) {
			let position = vscode.window.activeTextEditor?.selection?.active;
			if (position) {
				relativePath = `${relativePath}:${position.line + 1}`;
		}
		} else {
			relativePath = relativePath.replace('app/', 'spec/').replace('.rb', '_spec.rb');
		}

		terminal.sendText(`bundle exec rspec ${relativePath}`);
	});

	context.subscriptions.push(runForLine);
}

// this method is called when your extension is deactivated
export function deactivate() {}
