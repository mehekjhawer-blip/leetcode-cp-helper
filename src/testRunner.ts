import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export async function runTests(filePath: string, context: vscode.ExtensionContext) {
  const terminal = vscode.window.createTerminal('CP Helper Tests');
  terminal.show();

  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);
  const dir = path.dirname(filePath);

  if (ext === '.cpp') {
    const outFile = path.join(dir, base);
    terminal.sendText(`g++ -std=c++17 -O2 -o "${outFile}" "${filePath}" && echo "✅ Compiled!" && "${outFile}"`);
  } else if (ext === '.py') {
    terminal.sendText(`python3 "${filePath}"`);
  } else if (ext === '.java') {
    terminal.sendText(`cd "${dir}" && javac "${filePath}" && java ${base}`);
  }
}