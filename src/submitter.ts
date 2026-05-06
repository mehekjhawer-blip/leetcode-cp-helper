import * as vscode from 'vscode';
import axios from 'axios';

export async function submitSolution(slug: string, code: string, language: string) {
    const session = await vscode.window.showInputBox({
        prompt: 'Enter your LEETCODE_SESSION cookie (F12 → Application → Cookies on leetcode.com)',
        password: true,
        placeHolder: 'Paste LEETCODE_SESSION value here'
    });
    if (!session) return;

    const csrfToken = await vscode.window.showInputBox({
        prompt: 'Enter your csrftoken cookie value',
        password: true,
        placeHolder: 'Paste csrftoken value here'
    });
    if (!csrfToken) return;

    const langMap: Record<string, string> = {
        cpp: 'cpp', python: 'python3', java: 'java', javascript: 'javascript'
    };

    try {
        vscode.window.showInformationMessage('⏳ Submitting solution to LeetCode...');

        // Step 1: Get question ID
        const { data: qData } = await axios.post(
            'https://leetcode.com/graphql',
            { query: `query { question(titleSlug: "${slug}") { questionId title } }` },
            { headers: { Cookie: `LEETCODE_SESSION=${session}; csrftoken=${csrfToken}` } }
        );

        const questionId = qData?.data?.question?.questionId;
        if (!questionId) {
            vscode.window.showErrorMessage(`Problem "${slug}" not found on LeetCode.`);
            return;
        }

        // Step 2: Submit
        const { data } = await axios.post(
            `https://leetcode.com/problems/${slug}/submit/`,
            {
                lang: langMap[language] || 'cpp',
                question_id: questionId,
                typed_code: code
            },
            {
                headers: {
                    Cookie: `LEETCODE_SESSION=${session}; csrftoken=${csrfToken}`,
                    'X-CSRFToken': csrfToken,
                    Referer: `https://leetcode.com/problems/${slug}/`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0'
                }
            }
        );

        if (data.submission_id) {
            vscode.window.showInformationMessage(
                `✅ Submitted! ID: ${data.submission_id} — Check LeetCode for results.`
            );
        } else {
            vscode.window.showWarningMessage('Submission sent but no ID returned. Check LeetCode.');
        }

    } catch (err: any) {
        const msg = err?.response?.data?.detail || err?.message || 'Unknown error';
        vscode.window.showErrorMessage(`❌ Submission failed: ${msg}`);
        console.error('Submit error full details:', err?.response?.data || err);
    }
}