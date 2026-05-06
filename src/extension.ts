import * as vscode from 'vscode';
import { fetchProblem } from './leetcodeParser';
import { generateBoilerplate } from './codeGenerator';
import { runTests } from './testRunner';
import { startTimer, stopTimer } from './timer';
import { ProblemTracker } from './tracker';
import { submitSolution } from './submitter';
import { showProblemBrowser } from './problemBank';

export function activate(context: vscode.ExtensionContext) {
    console.log('CP Helper is now active!');

    const tracker = new ProblemTracker(context);

    // ─── Fetch Problem by input ───────────────────────────────────────
    context.subscriptions.push(
        vscode.commands.registerCommand('cphelper.fetchProblem', async () => {
            const slug = await vscode.window.showInputBox({
                prompt: 'Enter LeetCode problem slug (e.g. two-sum)',
                placeHolder: 'two-sum'
            });
            if (!slug) return;
            await fetchAndOpen(slug, tracker, context);
        })
    );

    // ─── Fetch Problem by slug (called from browser) ──────────────────
    context.subscriptions.push(
        vscode.commands.registerCommand('cphelper.fetchProblemBySlug', async (slug: string) => {
            if (!slug) return;
            await fetchAndOpen(slug, tracker, context);
        })
    );

    // ─── Run Tests ────────────────────────────────────────────────────
    context.subscriptions.push(
        vscode.commands.registerCommand('cphelper.runTests', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active file to test!');
                return;
            }
            await runTests(editor.document.fileName, context);
        })
    );

    // ─── Browse Problems ──────────────────────────────────────────────
    context.subscriptions.push(
        vscode.commands.registerCommand('cphelper.browse', showProblemBrowser)
    );

    // ─── Timer ────────────────────────────────────────────────────────
    context.subscriptions.push(
        vscode.commands.registerCommand('cphelper.startTimer', async () => {
            const input = await vscode.window.showInputBox({
                prompt: 'Enter duration in minutes',
                value: '30',
                placeHolder: '30'
            });
            if (input) startTimer(context, parseInt(input));
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('cphelper.stopTimer', stopTimer)
    );

    // ─── Dashboard ────────────────────────────────────────────────────
    context.subscriptions.push(
        vscode.commands.registerCommand('cphelper.dashboard', () => tracker.showDashboard())
    );

    // ─── Mark Solved ──────────────────────────────────────────────────
    context.subscriptions.push(
        vscode.commands.registerCommand('cphelper.markSolved', async () => {
            const problems = tracker.getAll();
            if (problems.length === 0) {
                vscode.window.showWarningMessage('No problems tracked yet! Fetch a problem first.');
                return;
            }
            const items = problems
                .filter(p => !p.solved)
                .map(p => ({
                    label: p.title,
                    description: p.difficulty,
                    slug: p.slug
                }));

            if (items.length === 0) {
                vscode.window.showInformationMessage('All tracked problems are already solved! 🎉');
                return;
            }

            const picked = await vscode.window.showQuickPick(items, {
                placeHolder: 'Select problem to mark as solved'
            });
            if (picked) tracker.markSolved(picked.slug);
        })
    );

    // ─── Add Note ─────────────────────────────────────────────────────
    context.subscriptions.push(
        vscode.commands.registerCommand('cphelper.addNote', async () => {
            const problems = tracker.getAll();
            if (problems.length === 0) {
                vscode.window.showWarningMessage('No problems tracked yet!');
                return;
            }
            const items = problems.map(p => ({
                label: p.title,
                description: p.difficulty,
                slug: p.slug
            }));
            const picked = await vscode.window.showQuickPick(items, {
                placeHolder: 'Select problem to add note'
            });
            if (picked) tracker.addNote(picked.slug);
        })
    );

    // ─── Submit Solution ──────────────────────────────────────────────
    context.subscriptions.push(
        vscode.commands.registerCommand('cphelper.submit', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('Open your solution file first!');
                return;
            }
            const code = editor.document.getText();
            const slug = await vscode.window.showInputBox({
                prompt: 'Enter the problem slug (e.g. two-sum)',
                placeHolder: 'two-sum'
            });
            if (!slug) return;
            const lang = vscode.workspace.getConfiguration('cphelper').get<string>('language') || 'cpp';
            await submitSolution(slug, code, lang);
        })
    );
}

// ─── Helper: fetch, save to tracker, open file ───────────────────────
async function fetchAndOpen(
    slug: string,
    tracker: ProblemTracker,
    context: vscode.ExtensionContext
) {
    // ── Language picker dropdown ──────────────────────────────────────
    const language = await vscode.window.showQuickPick(
        [
            { label: '$(code) C++',        description: 'Most popular for CP',       lang: 'cpp'        },
            { label: '$(code) Python',     description: 'Clean and concise',         lang: 'python'     },
            { label: '$(code) Java',       description: 'OOP focused',               lang: 'java'       },
            { label: '$(code) JavaScript', description: 'Web developers',            lang: 'javascript' },
            { label: '$(code) TypeScript', description: 'Typed JavaScript',          lang: 'typescript' },
            { label: '$(code) C',          description: 'Low level, fast',           lang: 'c'          },
            { label: '$(code) C#',         description: '.NET developers',           lang: 'csharp'     },
            { label: '$(code) Go',         description: 'Simple and efficient',      lang: 'go'         },
            { label: '$(code) Rust',       description: 'Memory safe, blazing fast', lang: 'rust'       },
            { label: '$(code) Kotlin',     description: 'Modern Java alternative',   lang: 'kotlin'     },
            { label: '$(code) Swift',      description: 'Apple ecosystem',           lang: 'swift'      },
            { label: '$(code) Ruby',       description: 'Elegant scripting',         lang: 'ruby'       },
            { label: '$(code) Scala',      description: 'Functional + OOP',          lang: 'scala'      },
            { label: '$(code) PHP',        description: 'Web backend',               lang: 'php'        },
            { label: '$(code) Dart',       description: 'Flutter developers',        lang: 'dart'       },
            { label: '$(code) Racket',     description: 'Functional language',       lang: 'racket'     },
            { label: '$(code) Erlang',     description: 'Concurrent systems',        lang: 'erlang'     },
            { label: '$(code) Elixir',     description: 'Scalable applications',     lang: 'elixir'     },
            { label: '$(database) MySQL',  description: 'SQL query problems',        lang: 'mysql'      },
            { label: '$(graph) Pandas',    description: 'Data analysis problems',    lang: 'pandas'     },
        ],
        {
            placeHolder: 'Select language for boilerplate',
            title: `LeetCode CP Helper — ${slug}`
        }
    );

    if (!language) return;

    await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: `Fetching ${slug}...` },
        async () => {
            const problem = await fetchProblem(slug);
            if (!problem) {
                vscode.window.showErrorMessage(`Could not fetch problem: ${slug}`);
                return;
            }

            // Save to tracker
            tracker.save({
                slug: problem.slug,
                title: problem.title,
                difficulty: problem.difficulty,
                solved: false,
                notes: ''
            });

            // Generate boilerplate in selected language
            const code = generateBoilerplate(problem, language.lang);

            // Map language to VS Code language ID
            const langMap: Record<string, string> = {
                cpp:        'cpp',
                python:     'python',
                java:       'java',
                javascript: 'javascript',
                typescript: 'typescript',
                c:          'c',
                csharp:     'csharp',
                go:         'go',
                rust:       'rust',
                kotlin:     'kotlin',
                swift:      'swift',
                ruby:       'ruby',
                scala:      'scala',
                php:        'php',
                dart:       'dart',
                racket:     'racket',
                erlang:     'erlang',
                elixir:     'elixir',
                mysql:      'sql',
                pandas:     'python',
            };

            const doc = await vscode.workspace.openTextDocument({
                content: code,
                language: langMap[language.lang] || 'plaintext'
            });

            vscode.window.showTextDocument(doc);
            vscode.window.showInformationMessage(
                `✅ Loaded: ${problem.title} (${problem.difficulty}) — ${language.label}`
            );
        }
    );
}

export function deactivate() {}