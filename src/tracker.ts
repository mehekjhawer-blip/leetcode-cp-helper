import * as vscode from 'vscode';

export interface ProblemEntry {
    slug: string;
    title: string;
    difficulty: string;
    solved: boolean;
    notes: string;
    solvedAt?: string;
}

export class ProblemTracker {
    private context: vscode.ExtensionContext;
    private key = 'cphelper.problems';

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    getAll(): ProblemEntry[] {
        return this.context.globalState.get<ProblemEntry[]>(this.key) || [];
    }

    save(entry: ProblemEntry) {
        const all = this.getAll();
        const idx = all.findIndex(p => p.slug === entry.slug);
        if (idx >= 0) all[idx] = entry;
        else all.push(entry);
        this.context.globalState.update(this.key, all);
    }

    markSolved(slug: string) {
        const all = this.getAll();
        const problem = all.find(p => p.slug === slug);
        if (problem) {
            problem.solved = true;
            problem.solvedAt = new Date().toLocaleDateString();
            this.context.globalState.update(this.key, all);
            vscode.window.showInformationMessage(`✅ "${problem.title}" marked as solved!`);
        }
    }

    async addNote(slug: string) {
        const note = await vscode.window.showInputBox({
            prompt: 'Add a note for this problem',
            placeHolder: 'e.g. Used HashMap, O(n) time complexity...'
        });
        if (!note) return;
        const all = this.getAll();
        const problem = all.find(p => p.slug === slug);
        if (problem) {
            problem.notes = note;
            this.context.globalState.update(this.key, all);
            vscode.window.showInformationMessage('Note saved!');
        }
    }

    showDashboard() {
        const all = this.getAll();
        const solved = all.filter(p => p.solved).length;
        const panel = vscode.window.createWebviewPanel(
            'cpDashboard', 'CP Helper Dashboard',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );
        panel.webview.html = getDashboardHtml(all, solved);
    }
}

function getDashboardHtml(problems: ProblemEntry[], solved: number): string {
    const rows = problems.map(p => `
        <tr>
            <td>${p.title}</td>
            <td class="${p.difficulty.toLowerCase()}">${p.difficulty}</td>
            <td>${p.solved ? '✅' : '❌'}</td>
            <td>${p.solvedAt || '-'}</td>
            <td>${p.notes || '-'}</td>
        </tr>
    `).join('');

    return `<!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: monospace; padding: 20px; background: #1e1e1e; color: #d4d4d4; }
            h1 { color: #4ec9b0; }
            .stats { margin: 10px 0; font-size: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #2d2d2d; padding: 8px; text-align: left; }
            td { padding: 8px; border-bottom: 1px solid #333; }
            .easy { color: #4ec9b0; }
            .medium { color: #dcdcaa; }
            .hard { color: #f44747; }
        </style>
    </head>
    <body>
        <h1>🧠 CP Helper Dashboard</h1>
        <div class="stats">Solved: <b>${solved}</b> / ${problems.length}</div>
        <table>
            <tr><th>Problem</th><th>Difficulty</th><th>Solved</th><th>Date</th><th>Notes</th></tr>
            ${rows}
        </table>
    </body>
    </html>`;
}