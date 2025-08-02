import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index';
import Snippet from '../models/snippet';
import connectDB from '../startup/database';
import config from 'config';
import { Server } from 'http';
import { SnippetPOSTBody } from '../types/createSnippet';

describe('/api/snippet', () => {
    let server: Server;

    beforeAll(() => {
        connectDB();
    });

    beforeEach(() => {
        server = app.listen(config.get('server.port'), () => {
            console.info('server is running');
        });
    });

    afterEach(async () => {
        await server.close();
        await Snippet.deleteMany({});
    });

    afterAll(() => {
        mongoose.disconnect();
    });

    describe('POST /api/snippet/create', () => {
        it('Create a snippet successfully and save in DB', async () => {
            const payload: SnippetPOSTBody = {
                code: "function code() { console.log('Hello world!')}",
                description: "A simple hello world function in Javascript",
                tags: ['Hello-world', 'util'],
                language: 'Javascript'
            };

            const res = await request(server)
                .post('/api/snippet/create')
                .send(payload)

            expect(res.status).toBe(201);
            expect(res.body).toEqual(
                expect.objectContaining({
                    _id: expect.any(String), // _id should be a string
                    code: payload.code,
                    description: payload.description,
                    tags: payload.tags,
                    embedding: expect.any(Array), // If embedding is expected
                })
            );
        });
    });

    describe('GET /api/snippet', () => {

        beforeEach(async () => {
            const data: SnippetPOSTBody[] = [
                {
                    "code": "def factorial(n):\n    return 1 if n == 0 else n * factorial(n - 1)",
                    "description": "This Python function calculates the factorial of a number recursively.",
                    "language": "python",
                    "tags": ["math", "recursion", "factorial"]
                },
                {
                    "code": "function isEven(n) {\n  return n % 2 === 0;\n}",
                    "description": "This JavaScript function returns true if a number is even.",
                    "language": "javascript",
                    "tags": ["number", "even", "math"]
                },
                {
                    "code": "public boolean isPalindrome(String s) {\n  StringBuilder sb = new StringBuilder(s);\n  return sb.reverse().toString().equals(s);\n}",
                    "description": "This Java method checks whether a given string is a palindrome by reversing it and comparing to the original.",
                    "language": "java",
                    "tags": ["string", "palindrome", "java"]
                },
                {
                    "code": "def fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a",
                    "description": "This Python function returns the nth Fibonacci number using iteration.",
                    "language": "python",
                    "tags": ["fibonacci", "sequence", "math"]
                },
                {
                    "code": "const sum = arr => arr.reduce((acc, val) => acc + val, 0);",
                    "description": "This JavaScript function returns the sum of an array using the reduce method.",
                    "language": "javascript",
                    "tags": ["array", "sum", "reduce"]
                },
                {
                    "code": "function reverseString(str) {\n  return str.split('').reverse().join('');\n}",
                    "description": "This JavaScript function reverses a given string.",
                    "language": "javascript",
                    "tags": ["string", "reverse", "utility"]
                },
                {
                    "code": "let nums = [1, 2, 3, 4];\nlet squared = nums.map(x => x * x);",
                    "description": "This JavaScript snippet squares each element in an array using map.",
                    "language": "javascript",
                    "tags": ["array", "map", "square"]
                },
                {
                    "code": "def count_vowels(s):\n    return sum(1 for c in s.lower() if c in 'aeiou')",
                    "description": "This Python function counts the number of vowels in a given string.",
                    "language": "python",
                    "tags": ["string", "vowels", "count"]
                },
                {
                    "code": "#include <stdio.h>\nint main() {\n  printf(\"Hello, World!\\n\");\n  return 0;\n}",
                    "description": "This C program prints 'Hello, World!' to the console.",
                    "language": "c",
                    "tags": ["hello world", "c", "beginner"]
                },
                {
                    "code": "def is_anagram(s1, s2):\n    return sorted(s1) == sorted(s2)",
                    "description": "This Python function checks whether two strings are anagrams.",
                    "language": "python",
                    "tags": ["string", "anagram", "compare"]
                },
                {
                    "code": "const unique = arr => [...new Set(arr)];",
                    "description": "This JavaScript function returns a new array with only unique values using a Set.",
                    "language": "javascript",
                    "tags": ["array", "unique", "set"]
                },
                {
                    "code": "function factorial(n) {\n  if (n === 0) return 1;\n  return n * factorial(n - 1);\n}",
                    "description": "This JavaScript function calculates the factorial of a number recursively.",
                    "language": "javascript",
                    "tags": ["recursion", "math", "factorial"]
                },
                {
                    "code": "SELECT name FROM users WHERE age > 30;",
                    "description": "This SQL query selects the names of users who are older than 30.",
                    "language": "sql",
                    "tags": ["sql", "select", "query"]
                },
                {
                    "code": "let now = new Date();\nconsole.log(now.toISOString());",
                    "description": "This JavaScript snippet logs the current timestamp in ISO format.",
                    "language": "javascript",
                    "tags": ["date", "time", "iso"]
                },
                {
                    "code": "def gcd(a, b):\n    while b:\n        a, b = b, a % b\n    return a",
                    "description": "This Python function computes the greatest common divisor (GCD) using Euclid's algorithm.",
                    "language": "python",
                    "tags": ["math", "gcd", "euclid"]
                },
                {
                    "code": "function capitalizeWords(str) {\n  return str.replace(/\\b\\w/g, c => c.toUpperCase());\n}",
                    "description": "This JavaScript function capitalizes the first letter of each word in a string.",
                    "language": "javascript",
                    "tags": ["string", "capitalize", "regex"]
                },
                {
                    "code": "print('\\n'.join(['*' * i for i in range(1, 6)]))",
                    "description": "This Python one-liner prints a right-aligned triangle of asterisks.",
                    "language": "python",
                    "tags": ["pattern", "triangle", "print"]
                },
                {
                    "code": "const isNullOrUndefined = val => val === null || val === undefined;",
                    "description": "This JavaScript utility checks whether a value is null or undefined.",
                    "language": "javascript",
                    "tags": ["null", "undefined", "check"]
                },
                {
                    "code": "function debounce(fn, delay) {\n  let timeout;\n  return function(...args) {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => fn.apply(this, args), delay);\n  };\n}",
                    "description": "This JavaScript function creates a debounced version of another function, delaying its execution.",
                    "language": "javascript",
                    "tags": ["debounce", "throttle", "timing"]
                },
                {
                    "code": "function sleep(ms) {\n  return new Promise(resolve => setTimeout(resolve, ms));\n}",
                    "description": "This JavaScript async function pauses execution for a given number of milliseconds.",
                    "language": "javascript",
                    "tags": ["async", "delay", "sleep"]
                },
                {
                    "code": "const flatten = arr => arr.reduce((flat, toFlatten) => flat.concat(toFlatten), []);",
                    "description": "This JavaScript function flattens a nested array by one level using reduce.",
                    "language": "javascript",
                    "tags": ["array", "flatten", "reduce"]
                },
                {
                    "code": "def to_camel_case(s):\n    parts = s.split('_')\n    return parts[0] + ''.join(word.capitalize() for word in parts[1:])",
                    "description": "This Python function converts a snake_case string into camelCase.",
                    "language": "python",
                    "tags": ["string", "case", "camelcase"]
                },
                {
                    "code": "const chunkArray = (arr, size) => {\n  let res = [];\n  for (let i = 0; i < arr.length; i += size) {\n    res.push(arr.slice(i, i + size));\n  }\n  return res;\n};",
                    "description": "This JavaScript function splits an array into smaller chunks of a specified size.",
                    "language": "javascript",
                    "tags": ["array", "chunk", "split"]
                },
                {
                    "code": "def remove_duplicates(lst):\n    return list(set(lst))",
                    "description": "This Python function removes duplicate items from a list by converting it to a set.",
                    "language": "python",
                    "tags": ["list", "duplicates", "set"]
                },
                {
                    "code": "const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;",
                    "description": "This JavaScript function calculates the average of numeric values in an array.",
                    "language": "javascript",
                    "tags": ["array", "average", "math"]
                },
                {
                    "code": "function getRandomInt(min, max) {\n  return Math.floor(Math.random() * (max - min)) + min;\n}",
                    "description": "This JavaScript function returns a random integer between two values.",
                    "language": "javascript",
                    "tags": ["random", "number", "range"]
                },
                {
                    "code": "def flatten(lst):\n    return [item for sublist in lst for item in sublist]",
                    "description": "This Python function flattens a 2D list into a single list using list comprehension.",
                    "language": "python",
                    "tags": ["list", "flatten", "comprehension"]
                },
                {
                    "code": "console.log([...Array(5).keys()]);",
                    "description": "This JavaScript snippet prints an array of integers from 0 to 4.",
                    "language": "javascript",
                    "tags": ["array", "range", "log"]
                },
                {
                    "code": "def merge_dicts(d1, d2):\n    return {**d1, **d2}",
                    "description": "This Python function merges two dictionaries using unpacking syntax.",
                    "language": "python",
                    "tags": ["dict", "merge", "python"]
                },
                {
                    "code": "const getInitials = name => name.split(' ').map(n => n[0]).join('').toUpperCase();",
                    "description": "This JavaScript function returns the uppercase initials of a full name.",
                    "language": "javascript",
                    "tags": ["string", "initials", "name"]
                }
            ];

            await Snippet.insertMany(data);

            for (let body of data) {
                await request(server)
                    .post('/api/snippet/create')
                    .send(body);
            }
        });

        it('Search a code snippet', async () => {
            const query = 'flatten to 2D list into signle one';

            const res = await request(server)
                .get('/api/snippet/search')
                .query({
                    search: query
                });
            expect(res.status).toBe(200);
        });
    });
});