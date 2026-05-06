import * as vscode from 'vscode';

let timerInterval: NodeJS.Timeout | undefined;
let statusBarItem: vscode.StatusBarItem;

export function startTimer(context: vscode.ExtensionContext, minutes: number) {
    if (statusBarItem) statusBarItem.dispose();
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    context.subscriptions.push(statusBarItem);

    let seconds = minutes * 60;

    const update = () => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        statusBarItem.text = `$(clock) CP Timer: ${m}:${s}`;
        statusBarItem.color = seconds <= 60 ? '#ff4444' : '#ffffff';
        statusBarItem.show();

        if (seconds <= 0) {
            clearInterval(timerInterval);
            vscode.window.showWarningMessage('⏰ Time is up!');
            statusBarItem.text = '$(clock) Time Up!';
            statusBarItem.color = '#ff4444';
            return;
        }
        seconds--;
    };

    update();
    timerInterval = setInterval(update, 1000);
    vscode.window.showInformationMessage(`Timer started for ${minutes} minutes!`);
}

export function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = undefined;
        statusBarItem?.dispose();
        vscode.window.showInformationMessage('Timer stopped.');
    }
}