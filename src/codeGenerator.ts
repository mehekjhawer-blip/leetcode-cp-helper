import { LeetCodeProblem } from './leetcodeParser';

export function generateBoilerplate(problem: LeetCodeProblem, language: string = 'cpp'): string {
    const header = buildHeader(problem, language);

    switch (language) {
        case 'cpp':        return header + generateCpp(problem);
        case 'python':     return header + generatePython(problem);
        case 'java':       return header + generateJava(problem);
        case 'javascript': return header + generateJavaScript(problem);
        case 'typescript': return header + generateTypeScript(problem);
        case 'c':          return header + generateC(problem);
        case 'csharp':     return header + generateCSharp(problem);
        case 'go':         return header + generateGo(problem);
        case 'rust':       return header + generateRust(problem);
        case 'kotlin':     return header + generateKotlin(problem);
        case 'swift':      return header + generateSwift(problem);
        case 'ruby':       return header + generateRuby(problem);
        case 'scala':      return header + generateScala(problem);
        case 'php':        return header + generatePhp(problem);
        case 'dart':       return header + generateDart(problem);
        case 'racket':     return header + generateRacket(problem);
        case 'erlang':     return header + generateErlang(problem);
        case 'elixir':     return header + generateElixir(problem);
        case 'mysql':      return generateMySQL(problem);
        case 'pandas':     return generatePandas(problem);
        default:           return header + generateCpp(problem);
    }
}

// ── Header builder per language ───────────────────────────────────────
function buildHeader(problem: LeetCodeProblem, language: string): string {
    const desc = problem.description.slice(0, 300).replace(/\n/g, ' ');

    const isHash = ['python', 'ruby', 'elixir', 'dart', 'pandas'].includes(language);
    const isSemicolon = ['racket'].includes(language);
    const isPercent = ['erlang'].includes(language);

    if (isHash) {
        return `# ${problem.title}\n# Difficulty: ${problem.difficulty}\n#\n# ${desc}...\n\n`;
    } else if (isSemicolon) {
        return `; ${problem.title}\n; Difficulty: ${problem.difficulty}\n;\n; ${desc}...\n\n`;
    } else if (isPercent) {
        return `% ${problem.title}\n% Difficulty: ${problem.difficulty}\n%\n% ${desc}...\n\n`;
    } else {
        return `/*\n * ${problem.title}\n * Difficulty: ${problem.difficulty}\n *\n * ${desc}...\n */\n\n`;
    }
}

// ── Language boilerplates ─────────────────────────────────────────────

function generateCpp(problem: LeetCodeProblem): string {
    return `#include <bits/stdc++.h>
using namespace std;

${problem.functionSignature || `class Solution {
public:
    // TODO: implement solution
};`}

int main() {
    Solution sol;
    // Add your test cases here
    return 0;
}`;
}

function generatePython(problem: LeetCodeProblem): string {
    return `from typing import List, Optional, Dict, Tuple

class Solution:
    def solve(self) -> None:
        # TODO: implement solution
        pass

# Test cases
if __name__ == "__main__":
    sol = Solution()
    # Add your test cases here
`;
}

function generateJava(problem: LeetCodeProblem): string {
    return `import java.util.*;
import java.util.stream.*;

public class Solution {

    // TODO: implement solution
    public int solve() {
        return 0;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        // Add your test cases here
        System.out.println(sol.solve());
    }
}`;
}

function generateJavaScript(problem: LeetCodeProblem): string {
    return `/**
 * @param {number[]} nums
 * @return {number}
 */
var solve = function(nums) {
    // TODO: implement solution
};

// Test cases
console.log(solve([]));`;
}

function generateTypeScript(problem: LeetCodeProblem): string {
    return `function solve(nums: number[]): number {
    // TODO: implement solution
    return 0;
}

// Test cases
console.log(solve([]));`;
}

function generateC(problem: LeetCodeProblem): string {
    return `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

/* TODO: implement solution */
int solve() {
    return 0;
}

int main() {
    /* Add your test cases here */
    printf("%d\\n", solve());
    return 0;
}`;
}

function generateCSharp(problem: LeetCodeProblem): string {
    return `using System;
using System.Collections.Generic;
using System.Linq;

public class Solution {

    // TODO: implement solution
    public int Solve() {
        return 0;
    }

    static void Main(string[] args) {
        Solution sol = new Solution();
        // Add your test cases here
        Console.WriteLine(sol.Solve());
    }
}`;
}

function generateGo(problem: LeetCodeProblem): string {
    return `package main

import (
    "fmt"
)

// TODO: implement solution
func solve() int {
    return 0
}

func main() {
    // Add your test cases here
    fmt.Println(solve())
}`;
}

function generateRust(problem: LeetCodeProblem): string {
    return `fn solve() -> i32 {
    // TODO: implement solution
    0
}

fn main() {
    // Add your test cases here
    println!("{}", solve());
}`;
}

function generateKotlin(problem: LeetCodeProblem): string {
    return `fun solve(): Int {
    // TODO: implement solution
    return 0
}

fun main() {
    // Add your test cases here
    println(solve())
}`;
}

function generateSwift(problem: LeetCodeProblem): string {
    return `import Foundation

class Solution {
    // TODO: implement solution
    func solve() -> Int {
        return 0
    }
}

// Test cases
let sol = Solution()
print(sol.solve())`;
}

function generateRuby(problem: LeetCodeProblem): string {
    return `# @return {Integer}
def solve()
    # TODO: implement solution
    0
end

# Test cases
puts solve()`;
}

function generateScala(problem: LeetCodeProblem): string {
    return `import scala.collection.mutable

object Solution {

    // TODO: implement solution
    def solve(): Int = {
        0
    }

    def main(args: Array[String]): Unit = {
        // Add your test cases here
        println(solve())
    }
}`;
}

function generatePhp(problem: LeetCodeProblem): string {
    return `<?php

class Solution {

    /**
     * @return Integer
     */
    function solve() {
        // TODO: implement solution
        return 0;
    }
}

// Test cases
$sol = new Solution();
echo $sol->solve();`;
}

function generateDart(problem: LeetCodeProblem): string {
    return `// TODO: implement solution
int solve() {
    return 0;
}

void main() {
    // Add your test cases here
    print(solve());
}`;
}

function generateRacket(problem: LeetCodeProblem): string {
    return `#lang racket

; TODO: implement solution
(define (solve)
  0)

; Test cases
(displayln (solve))`;
}

function generateErlang(problem: LeetCodeProblem): string {
    return `-module(solution).
-export([solve/0]).

% TODO: implement solution
solve() ->
    0.`;
}

function generateElixir(problem: LeetCodeProblem): string {
    return `defmodule Solution do
    # TODO: implement solution
    def solve do
        0
    end
end

# Test cases
IO.puts Solution.solve()`;
}

function generateMySQL(problem: LeetCodeProblem): string {
    return `-- ${problem.title}
-- Difficulty: ${problem.difficulty}
--
-- ${problem.description.slice(0, 300).replace(/\n/g, ' ')}...

-- TODO: Write your SQL query here
SELECT *
FROM your_table
WHERE condition;`;
}

function generatePandas(problem: LeetCodeProblem): string {
    return `# ${problem.title}
# Difficulty: ${problem.difficulty}
#
# ${problem.description.slice(0, 300).replace(/\n/g, ' ')}...

import pandas as pd

def solve(df: pd.DataFrame) -> pd.DataFrame:
    # TODO: implement solution
    return df
`;
}