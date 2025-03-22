import { type Canvas } from '@/types/canvas';

export const initialCanvases: Canvas[] = [
    {
        canvasId: "1",
        problemName: "Two Sum",
        problemUrl: "https://leetcode.com/problems/two-sum/",
        constraints: "Array of integers, target sum",
        ideas: [
            { ideaId: "1", description: "Brute force", timeComplexity: "O(n^2)", spaceComplexity: "O(1)" },
            { ideaId: "2", description: "Hash map", timeComplexity: "O(n)", spaceComplexity: "O(n)" }
        ],
        testCases: "Input: [2, 7, 11, 15], target = 9; Output: [0, 1]",
        code: "function twoSum(nums, target) { /* implementation */ }",
        createdAt: new Date("2025-03-17T10:00:00Z"),
        updatedAt: new Date("2025-03-17T10:00:00Z")
    },
    {
        canvasId: "2",
        problemName: "Reverse Linked List",
        problemUrl: "https://leetcode.com/problems/reverse-linked-list/",
        constraints: "Singly linked list",
        ideas: [
            { ideaId: "1", description: "Iterative", timeComplexity: "O(n)", spaceComplexity: "O(1)" },
            { ideaId: "2", description: "Recursive", timeComplexity: "O(n)", spaceComplexity: "O(n)" }
        ],
        testCases: "Input: [1, 2, 3, 4, 5]; Output: [5, 4, 3, 2, 1]",
        code: "function reverseList(head) { /* implementation */ }",
        createdAt: new Date("2025-03-17T10:05:00Z"),
        updatedAt: new Date("2025-03-17T10:05:00Z")
    },
    {
        canvasId: "3",
        problemName: "Valid Parentheses",
        problemUrl: "https://leetcode.com/problems/valid-parentheses/",
        constraints: "String containing '(', ')', '{', '}', '[' and ']'",
        ideas: [
            { ideaId: "1", description: "Stack", timeComplexity: "O(n)", spaceComplexity: "O(n)" }
        ],
        testCases: "Input: '()[]{}'; Output: true",
        code: "function isValid(s) { /* implementation */ }",
        createdAt: new Date("2025-03-17T10:10:00Z"),
        updatedAt: new Date("2025-03-17T10:10:00Z")
    },
    {
        canvasId: "4",
        problemName: "Merge Two Sorted Lists",
        problemUrl: "https://leetcode.com/problems/merge-two-sorted-lists/",
        constraints: "Two sorted linked lists",
        ideas: [
            { ideaId: "1", description: "Iterative", timeComplexity: "O(n + m)", spaceComplexity: "O(1)" },
            { ideaId: "2", description: "Recursive", timeComplexity: "O(n + m)", spaceComplexity: "O(n + m)" }
        ],
        testCases: "Input: [1, 2, 4], [1, 3, 4]; Output: [1, 1, 2, 3, 4, 4]",
        code: "function mergeTwoLists(l1, l2) { /* implementation */ }",
        createdAt: new Date("2025-03-17T10:15:00Z"),
        updatedAt: new Date("2025-03-17T10:15:00Z")
    },
    {
        canvasId: "5",
        problemName: "Best Time to Buy and Sell Stock",
        problemUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        constraints: "Array of stock prices",
        ideas: [
            { ideaId: "1", description: "One pass", timeComplexity: "O(n)", spaceComplexity: "O(1)" }
        ],
        testCases: "Input: [7, 1, 5, 3, 6, 4]; Output: 5",
        code: "function maxProfit(prices) { /* implementation */ }",
        createdAt: new Date("2025-03-17T10:20:00Z"),
        updatedAt: new Date("2025-03-17T10:20:00Z")
    },
    {
        canvasId: "6",
        problemName: "Maximum Subarray",
        problemUrl: "https://leetcode.com/problems/maximum-subarray/",
        constraints: "Array of integers",
        ideas: [
            { ideaId: "1", description: "Kadane's Algorithm", timeComplexity: "O(n)", spaceComplexity: "O(1)" }
        ],
        testCases: "Input: [-2,1,-3,4,-1,2,1,-5,4]; Output: 6",
        code: "function maxSubArray(nums) { /* implementation */ }",
        createdAt: new Date("2025-03-17T10:25:00Z"),
        updatedAt: new Date("2025-03-17T10:25:00Z")
    },
    {
        canvasId: "7",
        problemName: "Climbing Stairs",
        problemUrl: "https://leetcode.com/problems/climbing-stairs/",
        constraints: "Positive integer n",
        ideas: [
            { ideaId: "1", description: "Dynamic Programming", timeComplexity: "O(n)", spaceComplexity: "O(1)" }
        ],
        testCases: "Input: 3; Output: 3",
        code: "function climbStairs(n) { /* implementation */ }",
        createdAt: new Date("2025-03-17T10:30:00Z"),
        updatedAt: new Date("2025-03-17T10:30:00Z")
    },
    {
        canvasId: "8",
        problemName: "Longest Palindromic Substring",
        problemUrl: "https://leetcode.com/problems/longest-palindromic-substring/",
        constraints: "String s",
        ideas: [
            { ideaId: "1", description: "Expand Around Center", timeComplexity: "O(n^2)", spaceComplexity: "O(1)" },
            { ideaId: "2", description: "Dynamic Programming", timeComplexity: "O(n^2)", spaceComplexity: "O(n^2)" }
        ],
        testCases: "Input: 'babad'; Output: 'bab'",
        code: "function longestPalindrome(s) { /* implementation */ }",
        createdAt: new Date("2025-03-17T10:35:00Z"),
        updatedAt: new Date("2025-03-17T10:35:00Z")
    },
    {
        canvasId: "9",
        problemName: "Container With Most Water",
        problemUrl: "https://leetcode.com/problems/container-with-most-water/",
        constraints: "Array of non-negative integers",
        ideas: [
            { ideaId: "1", description: "Two Pointers", timeComplexity: "O(n)", spaceComplexity: "O(1)" }
        ],
        testCases: "Input: [1,8,6,2,5,4,8,3,7]; Output: 49",
        code: "function maxArea(height) { /* implementation */ }",
        createdAt: new Date("2025-03-17T10:40:00Z"),
        updatedAt: new Date("2025-03-17T10:40:00Z")
    },
    {
        canvasId: "10",
        problemName: "Merge Intervals",
        problemUrl: "https://leetcode.com/problems/merge-intervals/",
        constraints: "Array of intervals",
        ideas: [
            { ideaId: "1", description: "Sort and Merge", timeComplexity: "O(n log n)", spaceComplexity: "O(n)" }
        ],
        testCases: "Input: [[1,3],[2,6],[8,10],[15,18]]; Output: [[1,6],[8,10],[15,18]]",
        code: "function merge(intervals) { /* implementation */ }",
        createdAt: new Date("2025-03-17T10:45:00Z"),
        updatedAt: new Date("2025-03-17T10:15:00Z")
    }
];
