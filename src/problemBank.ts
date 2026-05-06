import * as vscode from 'vscode';
import axios from 'axios';

// Curated list — problems categorized by market importance
export const PROBLEM_BANK = [
    // FAANG Must-Know
    { slug: 'two-sum', title: 'Two Sum', difficulty: 'Easy', category: 'FAANG Essential', topic: 'HashMap' },
    { slug: 'longest-substring-without-repeating-characters', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', category: 'FAANG Essential', topic: 'Sliding Window' },
    { slug: 'median-of-two-sorted-arrays', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', category: 'FAANG Essential', topic: 'Binary Search' },
    { slug: 'merge-intervals', title: 'Merge Intervals', difficulty: 'Medium', category: 'FAANG Essential', topic: 'Intervals' },
    { slug: 'word-break', title: 'Word Break', difficulty: 'Medium', category: 'FAANG Essential', topic: 'DP' },
    { slug: 'lru-cache', title: 'LRU Cache', difficulty: 'Medium', category: 'FAANG Essential', topic: 'Design' },

    // Interviews — High Frequency
    { slug: 'best-time-to-buy-and-sell-stock', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', category: 'High Frequency', topic: 'Greedy' },
    { slug: 'maximum-subarray', title: 'Maximum Subarray', difficulty: 'Medium', category: 'High Frequency', topic: 'DP/Kadane' },
    { slug: 'number-of-islands', title: 'Number of Islands', difficulty: 'Medium', category: 'High Frequency', topic: 'BFS/DFS' },
    { slug: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'Easy', category: 'High Frequency', topic: 'DP' },
    { slug: 'binary-tree-level-order-traversal', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', category: 'High Frequency', topic: 'BFS' },
    { slug: 'course-schedule', title: 'Course Schedule', difficulty: 'Medium', category: 'High Frequency', topic: 'Topological Sort' },

    // Competitive Programming
    { slug: 'trapping-rain-water', title: 'Trapping Rain Water', difficulty: 'Hard', category: 'CP Classic', topic: 'Two Pointers' },
    { slug: 'longest-increasing-subsequence', title: 'Longest Increasing Subsequence', difficulty: 'Medium', category: 'CP Classic', topic: 'DP' },
    { slug: 'edit-distance', title: 'Edit Distance', difficulty: 'Hard', category: 'CP Classic', topic: 'DP' },
    { slug: 'minimum-window-substring', title: 'Minimum Window Substring', difficulty: 'Hard', category: 'CP Classic', topic: 'Sliding Window' },

    // Startups / Product Companies
    { slug: 'design-add-and-search-words-data-structure', title: 'Add and Search Words', difficulty: 'Medium', category: 'Startup Interviews', topic: 'Trie' },
    { slug: 'top-k-frequent-elements', title: 'Top K Frequent Elements', difficulty: 'Medium', category: 'Startup Interviews', topic: 'Heap' },
    { slug: 'find-median-from-data-stream', title: 'Find Median from Data Stream', difficulty: 'Hard', category: 'Startup Interviews', topic: 'Heap' },
];

export async function showProblemBrowser() {
    const categories = [...new Set(PROBLEM_BANK.map(p => p.category))];

    const selectedCategory = await vscode.window.showQuickPick(
        ['All', ...categories],
        { placeHolder: 'Filter by market importance category' }
    );
    if (!selectedCategory) return;

    const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
    const selectedDiff = await vscode.window.showQuickPick(difficulties, {
        placeHolder: 'Filter by difficulty'
    });
    if (!selectedDiff) return;

    const filtered = PROBLEM_BANK.filter(p =>
        (selectedCategory === 'All' || p.category === selectedCategory) &&
        (selectedDiff === 'All' || p.difficulty === selectedDiff)
    );

    const items = filtered.map(p => ({
        label: `$(${diffIcon(p.difficulty)}) ${p.title}`,
        description: `${p.difficulty} • ${p.topic}`,
        detail: `📊 ${p.category}`,
        slug: p.slug
    }));

    const picked = await vscode.window.showQuickPick(items, {
        placeHolder: `${filtered.length} problems found — select to fetch`
    });

    if (picked) {
        vscode.commands.executeCommand('cphelper.fetchProblemBySlug', picked.slug);
    }
}

function diffIcon(difficulty: string): string {
    if (difficulty === 'Easy') return 'pass';
    if (difficulty === 'Medium') return 'warning';
    return 'error';
}