const softwareBaseQuestions = [
  {
    title: "Two Sum",
    category: "DSA",
    topic: "Arrays",
    difficulty: "Easy",
    company: "Amazon",
    type: "Coding",
    description: "Return the indices of two numbers that add up to a target value.",
    correctAnswer: "Use a hash map to store seen values and check complements in O(n) time.",
    explanation: "A hash map gives constant-time complement lookup while scanning once.",
    starterCode: {
      python: "def two_sum(nums, target):\n    pass",
      cpp: "vector<int> twoSum(vector<int>& nums, int target) {\n    return {};\n}",
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}"
    },
    tags: ["arrays", "hashmap"]
  },
  {
    title: "Maximum Subarray",
    category: "DSA",
    topic: "Arrays",
    difficulty: "Medium",
    company: "Adobe",
    type: "Coding",
    description: "Find the maximum sum of a contiguous subarray.",
    correctAnswer: "Use Kadane's algorithm to track the best running sum and global maximum.",
    explanation: "Kadane's algorithm solves the problem in O(n) time using local and global maxima.",
    starterCode: {
      python: "def max_subarray(nums):\n    pass",
      cpp: "int maxSubArray(vector<int>& nums) {\n    return 0;\n}",
      java: "class Solution {\n    public int maxSubArray(int[] nums) {\n        return 0;\n    }\n}"
    },
    tags: ["arrays", "dynamic programming"]
  },
  {
    title: "Reverse a String",
    category: "DSA",
    topic: "Strings",
    difficulty: "Easy",
    company: "Persistent",
    type: "Coding",
    description: "Reverse a string efficiently and explain the time complexity.",
    correctAnswer: "Use two pointers or built-in reverse logic while noting the O(n) traversal.",
    explanation: "Two-pointer reversal is simple, readable, and linear in time.",
    starterCode: {
      python: "def reverse_string(s):\n    pass",
      cpp: "string reverseString(string s) {\n    return s;\n}",
      java: "class Solution {\n    public String reverseString(String s) {\n        return s;\n    }\n}"
    },
    tags: ["strings", "two pointers"]
  },
  {
    title: "Merge Two Sorted Lists",
    category: "DSA",
    topic: "Linked List",
    difficulty: "Easy",
    company: "Accenture",
    type: "Coding",
    description: "Merge two sorted linked lists into one sorted linked list.",
    correctAnswer: "Walk both lists with pointers and attach the smaller current node each step.",
    explanation: "This is a standard linear merge pattern that visits each node once.",
    starterCode: {
      python: "def merge_two_lists(l1, l2):\n    pass",
      cpp: "ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    return nullptr;\n}",
      java: "class Solution {\n    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {\n        return null;\n    }\n}"
    },
    tags: ["linked list", "merge"]
  },
  {
    title: "Maximum Depth of Binary Tree",
    category: "DSA",
    topic: "Trees",
    difficulty: "Easy",
    company: "ServiceNow",
    type: "Coding",
    description: "Return the maximum depth of a binary tree.",
    correctAnswer: "Use DFS recursion and return 1 plus the maximum depth of left and right subtrees.",
    explanation: "Tree height is naturally solved with recursive DFS.",
    starterCode: {
      python: "def max_depth(root):\n    pass",
      cpp: "int maxDepth(TreeNode* root) {\n    return 0;\n}",
      java: "class Solution {\n    public int maxDepth(TreeNode root) {\n        return 0;\n    }\n}"
    },
    tags: ["trees", "dfs"]
  },
  {
    title: "Breadth First Search in Graphs",
    category: "DSA",
    topic: "Graphs",
    difficulty: "Medium",
    company: "Uber",
    type: "Subjective",
    description: "Explain how BFS works and where it is useful in interviews.",
    correctAnswer: "BFS explores graph nodes level by level using a queue and is useful for shortest paths in unweighted graphs.",
    explanation: "A strong answer should mention queue usage, visited tracking, and shortest-path intuition.",
    tags: ["graphs", "bfs"]
  },
  {
    title: "Binary Search Complexity",
    category: "DSA",
    topic: "Searching",
    difficulty: "Easy",
    company: "Wipro",
    type: "MCQ",
    description: "What is the worst-case time complexity of binary search?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: "O(log n)",
    explanation: "Binary search halves the search space at every comparison.",
    tags: ["searching", "complexity"]
  },
  {
    title: "Dynamic Programming Basics",
    category: "DSA",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    company: "Microsoft",
    type: "Subjective",
    description: "What signals in a problem statement suggest dynamic programming may be a good approach?",
    correctAnswer: "Look for overlapping subproblems, optimal substructure, repeated states, and a need to reuse partial results efficiently.",
    explanation: "Interviewers want to hear both the recognition pattern and the memoization or tabulation direction.",
    tags: ["dynamic programming", "patterns"]
  },

  {
    title: "Probability of One Head",
    category: "Aptitude",
    topic: "Probability",
    difficulty: "Easy",
    company: "TCS",
    type: "MCQ",
    description: "What is the probability of getting exactly one head in two fair coin tosses?",
    options: ["1/4", "1/2", "3/4", "1"],
    correctAnswer: "1/2",
    explanation: "HT and TH are favorable out of 4 equally likely outcomes.",
    tags: ["probability", "coin toss"]
  },
  {
    title: "Dice Probability",
    category: "Aptitude",
    topic: "Probability",
    difficulty: "Easy",
    company: "Infosys",
    type: "Subjective",
    description: "Explain how to calculate the probability of getting a number greater than 4 on a fair die.",
    correctAnswer: "Count favorable outcomes 5 and 6, then divide by total outcomes 6 to get 2/6 or 1/3.",
    explanation: "A complete answer should clearly separate favorable outcomes from total outcomes.",
    tags: ["probability", "dice"]
  },
  {
    title: "Time and Work Strategy",
    category: "Aptitude",
    topic: "Time and Work",
    difficulty: "Medium",
    company: "WNS",
    type: "Subjective",
    description: "Explain the general method to solve time and work problems involving two people working together.",
    correctAnswer: "Convert each person's capacity into one-day work, add the rates, and take the reciprocal to find total time.",
    explanation: "The key is to think in work rates instead of directly adding days.",
    tags: ["time and work", "rates"]
  },
  {
    title: "Speed Distance Time",
    category: "Aptitude",
    topic: "Time and Distance",
    difficulty: "Easy",
    company: "Capgemini",
    type: "Subjective",
    description: "Describe the core formula used in speed, distance, and time questions and how you apply it.",
    correctAnswer: "Use speed equals distance divided by time, convert units carefully, and rearrange the equation depending on what is unknown.",
    explanation: "Interview aptitude questions often test the formula plus unit handling.",
    tags: ["time and distance", "formula"]
  },
  {
    title: "Profit and Loss",
    category: "Aptitude",
    topic: "Profit and Loss",
    difficulty: "Easy",
    company: "Genpact",
    type: "Subjective",
    description: "Explain how to calculate profit percentage and loss percentage.",
    correctAnswer: "Profit or loss percentage is computed on cost price by dividing the gain or loss by cost price and multiplying by 100.",
    explanation: "Many mistakes happen when candidates divide by selling price instead of cost price.",
    tags: ["profit and loss", "percentages"]
  },
  {
    title: "Ratio and Proportion",
    category: "Aptitude",
    topic: "Ratio and Proportion",
    difficulty: "Easy",
    company: "TCS",
    type: "Subjective",
    description: "How do you solve a ratio question when one part and the total value are known?",
    correctAnswer: "Sum the ratio parts, find the value of one part, and then multiply by the required number of parts.",
    explanation: "This pattern appears frequently in placement aptitude rounds.",
    tags: ["ratio", "proportion"]
  },
  {
    title: "Permutation vs Combination",
    category: "Aptitude",
    topic: "Permutation and Combination",
    difficulty: "Medium",
    company: "Cognizant",
    type: "Subjective",
    description: "Explain the difference between permutation and combination with an example.",
    correctAnswer: "Permutation considers order while combination does not, such as arranging 3 people in 2 seats versus choosing any 2 people.",
    explanation: "The easiest way to answer is to connect the concept to whether order matters.",
    tags: ["permutation", "combination"]
  },
  {
    title: "Logical Reasoning Series",
    category: "Aptitude",
    topic: "Logical Reasoning",
    difficulty: "Medium",
    company: "EY",
    type: "Subjective",
    description: "How do you approach number series and pattern-recognition questions under time pressure?",
    correctAnswer: "Check differences, ratios, alternating patterns, square or cube relations, and hidden arithmetic progressions before guessing.",
    explanation: "A structured scan order improves speed and reduces random trial-and-error.",
    tags: ["logical reasoning", "series"]
  },

  {
    title: "Tell Me About Yourself",
    category: "HR",
    topic: "Self Introduction",
    difficulty: "Easy",
    company: "General",
    type: "Subjective",
    description: "Frame a strong answer for the common opening HR question: tell me about yourself.",
    correctAnswer: "Give a short present-past-future summary covering your current focus, relevant experience or projects, and why you fit the role.",
    explanation: "Good answers are concise, relevant, and tailored to the role instead of fully personal biographies.",
    tags: ["hr", "introduction"]
  },
  {
    title: "Why Should We Hire You?",
    category: "HR",
    topic: "Self Awareness",
    difficulty: "Medium",
    company: "General",
    type: "Subjective",
    description: "How should you answer the question why should we hire you?",
    correctAnswer: "Connect your strengths, project evidence, learning attitude, and role fit with the value you can bring to the company.",
    explanation: "The best answers are confident, specific, and linked to business or team value.",
    tags: ["hr", "fit"]
  },
  {
    title: "Strengths and Weaknesses",
    category: "HR",
    topic: "Self Awareness",
    difficulty: "Medium",
    company: "General",
    type: "Subjective",
    description: "Describe a mature way to answer strengths and weaknesses in an interview.",
    correctAnswer: "Mention strengths with evidence and one genuine weakness paired with the steps you are taking to improve it.",
    explanation: "Interviewers are checking self-awareness and growth, not perfection.",
    tags: ["hr", "self awareness"]
  },
  {
    title: "Conflict Handling",
    category: "HR",
    topic: "Behavioral Interviews",
    difficulty: "Medium",
    company: "General",
    type: "Subjective",
    description: "How should you answer a question about handling conflict in a team?",
    correctAnswer: "Use the STAR format, explain the conflict calmly, emphasize listening and collaboration, and end with the positive resolution.",
    explanation: "The tone matters as much as the example because the interviewer is judging maturity and teamwork.",
    tags: ["behavioral", "conflict"]
  },
  {
    title: "Leadership Example",
    category: "HR",
    topic: "Behavioral Interviews",
    difficulty: "Medium",
    company: "General",
    type: "Subjective",
    description: "Describe a situation where you showed leadership or initiative.",
    correctAnswer: "Explain the context, the action you personally drove, how you aligned the group, and the measurable result.",
    explanation: "Even small leadership examples work if the outcome and ownership are clear.",
    tags: ["behavioral", "leadership"]
  },
  {
    title: "Failure and Learning",
    category: "HR",
    topic: "Behavioral Interviews",
    difficulty: "Medium",
    company: "General",
    type: "Subjective",
    description: "What makes a good answer to the question tell us about a failure?",
    correctAnswer: "Choose a real setback, accept responsibility, explain the correction you made, and show how you improved afterward.",
    explanation: "A growth-focused answer is much stronger than an overly defensive one.",
    tags: ["behavioral", "failure"]
  },
  {
    title: "Why This Company?",
    category: "HR",
    topic: "Company Fit",
    difficulty: "Easy",
    company: "General",
    type: "Subjective",
    description: "How should a fresher answer the question why this company?",
    correctAnswer: "Mention the company's work, learning environment, product or domain interest, and how your skills align with the role.",
    explanation: "The answer should feel researched and role-specific, not generic praise.",
    tags: ["company fit", "motivation"]
  },
  {
    title: "Career Goals",
    category: "HR",
    topic: "Future Plans",
    difficulty: "Easy",
    company: "General",
    type: "Subjective",
    description: "How do you answer short-term and long-term career goals in an interview?",
    correctAnswer: "Keep short-term goals role-focused and realistic, then connect long-term goals to growth, responsibility, and deeper contribution.",
    explanation: "Interviewers want ambition with realism, not vague or unstable plans.",
    tags: ["career goals", "future"]
  },
  {
    title: "Handling Pressure at Work",
    category: "HR",
    topic: "Behavioral Interviews",
    difficulty: "Medium",
    company: "General",
    type: "Subjective",
    description: "How should you answer a question about working under pressure or tight deadlines?",
    correctAnswer: "Pick one real situation, explain how you prioritized tasks, communicated clearly, and maintained quality while meeting the deadline.",
    explanation: "A strong answer shows calm decision-making, ownership, and practical prioritization under pressure.",
    tags: ["behavioral", "pressure", "prioritization"]
  },
  {
    title: "Teamwork Example",
    category: "HR",
    topic: "Behavioral Interviews",
    difficulty: "Easy",
    company: "General",
    type: "Subjective",
    description: "Describe a good way to answer a teamwork question in an interview.",
    correctAnswer: "Explain the team goal, your personal contribution, how you collaborated with others, and the final result achieved together.",
    explanation: "Interviewers want to understand your role in a team, not just the team outcome itself.",
    tags: ["behavioral", "teamwork", "collaboration"]
  },
  {
    title: "Average Calculation Strategy",
    category: "Aptitude",
    topic: "Average",
    difficulty: "Easy",
    company: "TCS",
    type: "Subjective",
    description: "Explain the fastest method to solve average-based aptitude questions.",
    correctAnswer: "Use total sum divided by number of terms, and when values are adjusted, update the total first before recomputing the average.",
    explanation: "The key is to think in totals instead of recalculating each value from scratch.",
    tags: ["average", "aptitude", "formula"]
  },
  {
    title: "Percentage Increase and Decrease",
    category: "Aptitude",
    topic: "Percentages",
    difficulty: "Medium",
    company: "Infosys",
    type: "Subjective",
    description: "How do you approach aptitude questions involving percentage increase and percentage decrease?",
    correctAnswer: "Convert the percentage change into a multiplier, apply it step by step, and keep the base value clear throughout the calculation.",
    explanation: "Candidates often make mistakes by adding percentages directly without checking the changing base value.",
    tags: ["percentages", "increase", "decrease"]
  },

  {
    title: "Process vs Thread",
    category: "Core Subjects",
    topic: "Operating Systems",
    difficulty: "Easy",
    company: "Oracle",
    type: "Subjective",
    description: "Explain the difference between a process and a thread.",
    correctAnswer: "A process has its own memory space and resources, while threads share the same process memory and execute smaller units of work concurrently.",
    explanation: "A strong answer mentions isolation, resource sharing, and context-switch cost.",
    tags: ["os", "process", "thread"]
  },
  {
    title: "Deadlock Conditions",
    category: "Core Subjects",
    topic: "Operating Systems",
    difficulty: "Medium",
    company: "VMware",
    type: "Subjective",
    description: "What are the necessary conditions for deadlock?",
    correctAnswer: "Mutual exclusion, hold and wait, no preemption, and circular wait are the four necessary deadlock conditions.",
    explanation: "If even one condition is prevented, deadlock can be avoided.",
    tags: ["os", "deadlock"]
  },
  {
    title: "Normalization in DBMS",
    category: "Core Subjects",
    topic: "DBMS",
    difficulty: "Medium",
    company: "Infosys",
    type: "Subjective",
    description: "Why is normalization used in DBMS and what problem does it solve?",
    correctAnswer: "Normalization reduces redundancy, improves data consistency, and organizes attributes into better relational structures.",
    explanation: "A good answer should mention anomalies such as update, insert, and delete anomalies.",
    tags: ["dbms", "normalization"]
  },
  {
    title: "Primary Key and Foreign Key",
    category: "Core Subjects",
    topic: "DBMS",
    difficulty: "Easy",
    company: "Tech Mahindra",
    type: "Subjective",
    description: "Explain the difference between a primary key and a foreign key.",
    correctAnswer: "A primary key uniquely identifies a row in its own table, while a foreign key creates a relationship by referencing a primary key in another table.",
    explanation: "The key idea is uniqueness versus relational reference.",
    tags: ["dbms", "keys"]
  },
  {
    title: "Second Highest Salary Query",
    category: "Core Subjects",
    topic: "SQL",
    difficulty: "Medium",
    company: "Flipkart",
    type: "Subjective",
    description: "Explain one correct SQL approach to find the second highest salary from an employee table.",
    correctAnswer: "Use a subquery or order-by approach depending on the SQL dialect, while being careful about duplicates and null handling.",
    explanation: "Interviewers usually want the idea plus awareness of dialect and duplicate-edge cases.",
    tags: ["sql", "queries"]
  },
  {
    title: "HTTP vs HTTPS",
    category: "Core Subjects",
    topic: "Computer Networks",
    difficulty: "Easy",
    company: "Postman",
    type: "Subjective",
    description: "Explain the difference between HTTP and HTTPS.",
    correctAnswer: "HTTPS is HTTP over TLS, which adds encryption, authentication, and integrity protection to normal web communication.",
    explanation: "The answer should go beyond port numbers and explain security benefits.",
    tags: ["networks", "http", "https"]
  },
  {
    title: "TCP vs UDP",
    category: "Core Subjects",
    topic: "Computer Networks",
    difficulty: "Medium",
    company: "Cisco",
    type: "Subjective",
    description: "Compare TCP and UDP with suitable use cases.",
    correctAnswer: "TCP is connection-oriented and reliable, while UDP is connectionless and faster with lower overhead for cases like streaming or DNS.",
    explanation: "A strong answer mentions reliability, ordering, congestion control, and typical use cases.",
    tags: ["networks", "tcp", "udp"]
  },
  {
    title: "OOP Pillars",
    category: "Core Subjects",
    topic: "OOP",
    difficulty: "Easy",
    company: "Zoho",
    type: "Subjective",
    description: "What are the main pillars of object-oriented programming and why do they matter?",
    correctAnswer: "Encapsulation, abstraction, inheritance, and polymorphism structure code for reuse, maintainability, and cleaner modeling of real systems.",
    explanation: "Interviewers expect both the names and the practical benefit of each concept.",
    tags: ["oop", "principles"]
  },
  {
    title: "Java Memory Management",
    category: "Core Subjects",
    topic: "Java",
    difficulty: "Medium",
    company: "IBM",
    type: "Subjective",
    description: "Explain how garbage collection works in Java.",
    correctAnswer: "Java automatically reclaims memory used by unreachable heap objects through garbage collection, reducing manual memory management.",
    explanation: "A useful answer mentions heap objects, reachability, and automatic cleanup.",
    tags: ["java", "memory"]
  },
  {
    title: "Python Dictionary Lookup",
    category: "Core Subjects",
    topic: "Python",
    difficulty: "Easy",
    company: "Fractal",
    type: "MCQ",
    description: "What is the average time complexity of dictionary key lookup in Python?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: "O(1)",
    explanation: "Python dictionaries are hash table based, so average lookup is constant time.",
    tags: ["python", "hash table"]
  },
  {
    title: "REST API Design",
    category: "Core Subjects",
    topic: "Web Development",
    difficulty: "Medium",
    company: "Deloitte",
    type: "Subjective",
    description: "What principles make a REST API clean and interview-ready?",
    correctAnswer: "Use resource-based URLs, proper HTTP methods, clear status codes, stateless communication, and consistent request and response structures.",
    explanation: "Good API answers connect design principles with practical backend behavior.",
    tags: ["rest", "api", "web"]
  }
];

const professionalInterviewQuestions = [
  {
    title: "Longest Substring Without Repeating Characters Discussion",
    category: "DSA",
    topic: "Strings",
    difficulty: "Medium",
    company: "Google",
    type: "Coding",
    description: "Design and explain an efficient approach for finding the length of the longest substring without repeating characters. After solving it, discuss how you would justify the sliding-window approach to an interviewer.",
    correctAnswer: "Use a sliding window with a hash map or set to track characters, move the left pointer when a duplicate appears, and maintain the best window length in O(n) time.",
    explanation: "A strong answer should cover sliding-window intuition, duplicate handling, and why the two-pointer approach avoids repeated work.",
    starterCode: {
      python: "def length_of_longest_substring(s):\n    pass",
      cpp: "int lengthOfLongestSubstring(string s) {\n    return 0;\n}",
      java: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}"
    },
    tags: ["strings", "sliding-window", "hashmap", "interview"]
  },
  {
    title: "First Non-Repeating Element Strategy",
    category: "DSA",
    topic: "Arrays",
    difficulty: "Easy",
    company: "Adobe",
    type: "Subjective",
    description: "Suppose you are asked to find the first non-repeating element in an array. How would you solve it efficiently, and what tradeoffs would you mention if the array were extremely large?",
    correctAnswer: "Count frequencies with a hash map, then scan the array again to return the first element with count one; this gives O(n) time with O(n) extra space.",
    explanation: "Interviewers usually expect the two-pass hash map solution plus some mention of memory tradeoffs for very large inputs.",
    tags: ["arrays", "hashmap", "frequencies", "interview"]
  },
  {
    title: "Kth Largest Element Tradeoff Analysis",
    category: "DSA",
    topic: "Searching",
    difficulty: "Medium",
    company: "Amazon",
    type: "Subjective",
    description: "How would you solve the kth largest element problem, and how would you compare sorting, heap-based, and quickselect-based approaches during an interview?",
    correctAnswer: "Sorting is simplest but O(n log n), a heap gives O(n log k), and quickselect gives average O(n) with more implementation complexity; the best choice depends on constraints and required clarity.",
    explanation: "A complete answer compares complexity, implementation difficulty, and when each approach is preferable.",
    tags: ["searching", "heap", "quickselect", "complexity"]
  },
  {
    title: "Cycle Detection in Linked List",
    category: "DSA",
    topic: "Linked List",
    difficulty: "Easy",
    company: "Meta",
    type: "Subjective",
    description: "Explain how you would detect whether a linked list contains a cycle, and why your chosen approach is considered interview-friendly.",
    correctAnswer: "Use Floyd's slow and fast pointer technique, where one pointer moves one step and the other moves two; if they ever meet, a cycle exists.",
    explanation: "The interviewer expects the two-pointer method because it is O(n) time and O(1) space.",
    tags: ["linked-list", "two-pointers", "cycle-detection"]
  },
  {
    title: "Level Order Traversal Under Depth Constraints",
    category: "DSA",
    topic: "Trees",
    difficulty: "Medium",
    company: "Microsoft",
    type: "Subjective",
    description: "Walk me through how you would return the level order traversal of a binary tree, and tell me what would change if the tree were extremely deep.",
    correctAnswer: "Use BFS with a queue to process nodes level by level; for an extremely deep tree, iterative traversal is often safer than recursion because it avoids stack overflow risks.",
    explanation: "The interviewer wants both the traversal pattern and awareness of implementation risks on deep trees.",
    tags: ["trees", "bfs", "queue", "traversal"]
  },
  {
    title: "Number of Islands Reasoning",
    category: "DSA",
    topic: "Graphs",
    difficulty: "Medium",
    company: "Uber",
    type: "Subjective",
    description: "If I ask you to count the number of islands in a grid, how would you reason about the problem before writing code?",
    correctAnswer: "Treat each land cell as part of a graph, traverse connected land using DFS or BFS, and increment the island count each time you start from an unvisited land cell.",
    explanation: "A polished answer frames the grid as a connectivity problem and explains why each island should be explored exactly once.",
    tags: ["graphs", "dfs", "bfs", "grid"]
  },
  {
    title: "Balanced Brackets Edge Cases",
    category: "DSA",
    topic: "Stacks",
    difficulty: "Easy",
    company: "Atlassian",
    type: "Subjective",
    description: "How would you solve the balanced brackets problem, and what edge cases would you mention before finishing your answer?",
    correctAnswer: "Use a stack to track opening brackets and match them against closing brackets in order; discuss empty strings, unmatched closings, leftover openings, and invalid ordering.",
    explanation: "Interviewers want the stack approach plus evidence that you think about correctness beyond the happy path.",
    tags: ["stacks", "parsing", "edge-cases"]
  },
  {
    title: "LRU Cache Design Discussion",
    category: "DSA",
    topic: "Design",
    difficulty: "Hard",
    company: "Netflix",
    type: "Subjective",
    description: "Describe how you would design an LRU cache that supports O(1) get and put operations, and explain why this combination of data structures works well.",
    correctAnswer: "Combine a hash map for O(1) lookup with a doubly linked list for O(1) insertion, removal, and recency updates.",
    explanation: "A strong answer should explain how the map and linked list complement each other to satisfy both lookup and eviction efficiency.",
    tags: ["design", "cache", "hashmap", "linked-list"]
  },
  {
    title: "Binary Search Production Discussion",
    category: "DSA",
    topic: "Searching",
    difficulty: "Easy",
    company: "Apple",
    type: "Subjective",
    description: "Binary search is a common interview topic. How would you explain the most common implementation mistakes and how to avoid them?",
    correctAnswer: "Clarify the invariant, use a safe mid calculation, update bounds consistently, and define whether the search is for exact match or first or last valid position.",
    explanation: "Interviewers value candidates who understand boundary handling and not just the template.",
    tags: ["binary-search", "boundaries", "correctness"]
  },
  {
    title: "Dynamic Programming Recognition Patterns",
    category: "DSA",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    company: "Google",
    type: "Subjective",
    description: "When you see a new problem, what signals tell you that dynamic programming may be the right direction?",
    correctAnswer: "Look for overlapping subproblems, repeated states, and optimal substructure, then decide whether memoization or tabulation expresses the state transitions more clearly.",
    explanation: "A polished answer focuses on problem-recognition patterns rather than only giving a memorized definition.",
    tags: ["dynamic-programming", "patterns", "state"]
  },
  {
    title: "React Rendering Model Discussion",
    category: "Core Subjects",
    topic: "React",
    difficulty: "Medium",
    company: "Meta",
    type: "Subjective",
    description: "How would you explain React's rendering model to an interviewer, especially around what causes components to render again?",
    correctAnswer: "React re-renders components when state, props, or relevant context values change, and then reconciles the virtual tree to update only the necessary DOM parts.",
    explanation: "A strong answer should distinguish re-rendering from actual DOM updates and explain the role of reconciliation.",
    tags: ["react", "rendering", "reconciliation", "frontend"]
  },
  {
    title: "React Unnecessary Re-renders",
    category: "Core Subjects",
    topic: "React",
    difficulty: "Medium",
    company: "Adobe",
    type: "Subjective",
    description: "What are some common reasons a React component re-renders unnecessarily, and how would you investigate that in a real project?",
    correctAnswer: "Frequent parent updates, unstable object or function references, broad context usage, and poor state placement are common causes; investigate with React DevTools and component profiling.",
    explanation: "Interviewers are looking for both technical reasons and a practical debugging method.",
    tags: ["react", "performance", "profiling", "frontend"]
  },
  {
    title: "Frontend Authentication Architecture",
    category: "Core Subjects",
    topic: "Frontend Security",
    difficulty: "Medium",
    company: "Atlassian",
    type: "Subjective",
    description: "If you had to build authentication for a React application, how would you prevent inconsistent UI states and route flicker on refresh?",
    correctAnswer: "Use a centralized auth provider, block protected content until auth bootstrap completes, restore the session from the server, and protect routes based on verified auth state instead of optimistic client assumptions.",
    explanation: "A strong answer should connect auth state, route protection, and page-refresh behavior in a realistic frontend architecture.",
    tags: ["auth", "react", "protected-routes", "security"]
  },
  {
    title: "Accessibility in Interactive UI",
    category: "Core Subjects",
    topic: "Accessibility",
    difficulty: "Easy",
    company: "Microsoft",
    type: "Subjective",
    description: "What practical steps would you take to make a frontend application accessible beyond just adding alt text?",
    correctAnswer: "Use semantic HTML, keyboard-friendly interactions, clear focus states, proper labels, ARIA only where necessary, and sufficient color contrast.",
    explanation: "Interviewers want practical accessibility engineering habits, not a purely theoretical answer.",
    tags: ["accessibility", "frontend", "ux", "standards"]
  },
  {
    title: "Frontend Performance Diagnosis",
    category: "Core Subjects",
    topic: "Performance",
    difficulty: "Medium",
    company: "Netflix",
    type: "Subjective",
    description: "Suppose a page feels slow even though the API responds quickly. How would you diagnose whether the bottleneck is rendering, bundle size, or client-side logic?",
    correctAnswer: "Use browser performance tools, network waterfall analysis, Lighthouse or similar audits, and React profiling to separate data latency from rendering cost, JavaScript execution, and bundle loading.",
    explanation: "A production-style answer should show a structured diagnosis rather than jumping to one assumed fix.",
    tags: ["performance", "rendering", "profiling", "frontend"]
  },
  {
    title: "API Design For Interview Platforms",
    category: "Core Subjects",
    topic: "Backend",
    difficulty: "Medium",
    company: "Amazon",
    type: "Subjective",
    description: "How would you design clean backend APIs for login, question retrieval, mock test generation, and result submission in an interview preparation platform?",
    correctAnswer: "Use resource-oriented routes, clear request and response contracts, proper status codes, server-side validation, and consistent authentication boundaries across endpoints.",
    explanation: "The interviewer wants you to connect API structure, security, and maintainability rather than listing endpoints loosely.",
    tags: ["backend", "api", "rest", "design"]
  },
  {
    title: "JWT vs Session-Based Authentication",
    category: "Core Subjects",
    topic: "Authentication",
    difficulty: "Medium",
    company: "Uber",
    type: "Subjective",
    description: "Compare JWT-based authentication and session-based authentication. In what situations would you lean toward one over the other?",
    correctAnswer: "JWTs are useful for stateless distributed setups, while sessions can simplify revocation and server-controlled auth state; the right choice depends on scaling needs, security posture, and client behavior.",
    explanation: "A strong answer avoids calling one universally better and instead explains the tradeoffs clearly.",
    tags: ["auth", "jwt", "sessions", "security"]
  },
  {
    title: "Refresh Token Security Discussion",
    category: "Core Subjects",
    topic: "Authentication",
    difficulty: "Hard",
    company: "Google",
    type: "Subjective",
    description: "If your system uses access tokens and refresh tokens, how would you design the flow to reduce token theft and random logout issues in production?",
    correctAnswer: "Keep refresh tokens in HttpOnly secure cookies, issue short-lived access tokens, rotate or validate refresh sessions on the server, and centralize refresh handling in the client.",
    explanation: "Interviewers expect both security thinking and operational stability, especially around session persistence and token expiry.",
    tags: ["auth", "refresh-token", "cookies", "security"]
  },
  {
    title: "Preventing Duplicate Registration Under Concurrency",
    category: "Core Subjects",
    topic: "Backend",
    difficulty: "Medium",
    company: "Microsoft",
    type: "Subjective",
    description: "How would you prevent duplicate registrations for the same email if two requests arrive almost at the same time?",
    correctAnswer: "Enforce a unique index at the database level, validate early in the API, and handle duplicate-key errors gracefully in the controller.",
    explanation: "The right answer combines application validation with database-level guarantees instead of trusting only one layer.",
    tags: ["backend", "database", "validation", "concurrency"]
  },
  {
    title: "Database Indexing For User and Question Systems",
    category: "Core Subjects",
    topic: "DBMS",
    difficulty: "Medium",
    company: "Oracle",
    type: "Subjective",
    description: "What indexes would you consider for a platform that stores users, interview questions, bookmarks, and test results, and how would you justify them?",
    correctAnswer: "Index fields used frequently in lookup and filtering, such as email, question category, topic, company, and user-linked result records, while avoiding unnecessary indexes that slow writes.",
    explanation: "A good answer balances query speed with index maintenance costs.",
    tags: ["dbms", "indexing", "queries", "performance"]
  },
  {
    title: "MongoDB Embedding vs Referencing",
    category: "Core Subjects",
    topic: "DBMS",
    difficulty: "Medium",
    company: "Adobe",
    type: "Subjective",
    description: "When designing MongoDB data structures, how do you decide between embedding related data and referencing it?",
    correctAnswer: "Embed when related data is small, tightly coupled, and retrieved together; reference when data grows independently, is reused, or would become too large or frequently updated in one document.",
    explanation: "Interviewers want to see that you understand data access patterns rather than repeating generic rules.",
    tags: ["mongodb", "schema-design", "dbms"]
  },
  {
    title: "System Design for a Practice Platform",
    category: "Core Subjects",
    topic: "System Design",
    difficulty: "Medium",
    company: "Meta",
    type: "Subjective",
    description: "Design a simple interview practice platform where users can sign up, access questions, generate mock tests, and view analytics. What major components would you identify first?",
    correctAnswer: "Identify user management, question management, test generation, result evaluation, analytics, and deployment infrastructure, then describe how data flows across these modules.",
    explanation: "For junior candidates, interviewers usually look for clean decomposition and practical tradeoff thinking rather than ultra-deep distributed systems detail.",
    tags: ["system-design", "architecture", "backend", "frontend"]
  },
  {
    title: "Caching Strategy for Frequently Accessed Questions",
    category: "Core Subjects",
    topic: "Scalability",
    difficulty: "Medium",
    company: "Netflix",
    type: "Subjective",
    description: "If the question bank becomes very popular and read-heavy, what data would you cache first and why?",
    correctAnswer: "Cache frequently requested question lists, category-filtered results, and possibly metadata used on dashboards, because those are read-heavy and relatively stable compared with user-specific writes.",
    explanation: "A thoughtful answer identifies high-read, low-volatility data and explains the benefit clearly.",
    tags: ["caching", "scalability", "performance"]
  },
  {
    title: "Backend Debugging Checklist for Intermittent Auth Failures",
    category: "Core Subjects",
    topic: "Debugging",
    difficulty: "Hard",
    company: "Uber",
    type: "Subjective",
    description: "Users report intermittent authentication failures only in production. What exact areas would you inspect before making changes?",
    correctAnswer: "Check token expiry and refresh flow, cookie settings, environment variable consistency, CORS policy, clock drift, reverse proxy behavior, deployment domains, and structured backend logs around auth middleware.",
    explanation: "This question tests whether you can debug real production auth issues systematically instead of guessing.",
    tags: ["debugging", "authentication", "production", "deployment"]
  },
  {
    title: "Rate Limiting Design for Login and OTP Endpoints",
    category: "Core Subjects",
    topic: "Security",
    difficulty: "Medium",
    company: "Amazon",
    type: "Subjective",
    description: "Why should login and password-reset endpoints be rate limited, and how would you explain a sensible implementation approach?",
    correctAnswer: "Rate limiting reduces brute-force and abuse risk by restricting repeated attempts per IP or account over time while still allowing normal users to authenticate successfully.",
    explanation: "A strong answer should cover both security intent and practical control boundaries.",
    tags: ["security", "rate-limiting", "auth", "backend"]
  },
  {
    title: "Cloud Deployment Reliability Basics",
    category: "Core Subjects",
    topic: "Deployment",
    difficulty: "Easy",
    company: "Google",
    type: "Subjective",
    description: "What are the minimum things you would verify before calling a deployed full-stack application stable in production?",
    correctAnswer: "Verify environment variables, database connectivity, auth flow, HTTPS configuration, CORS or cookie behavior, health checks, logging, and core user journeys like signup, login, and protected page access.",
    explanation: "Interviewers want a practical pre-production checklist, not a vague statement about testing.",
    tags: ["deployment", "production", "monitoring", "stability"]
  },
  {
    title: "Tell Me About Yourself for a Product Company",
    category: "HR",
    topic: "Self Introduction",
    difficulty: "Easy",
    company: "General",
    type: "Subjective",
    description: "How would you answer 'Tell me about yourself' in a way that feels relevant for a software engineering role at a product company?",
    correctAnswer: "Give a concise present-past-future summary that highlights your current focus, relevant projects or internships, and why your background aligns with the role you are applying for.",
    explanation: "The strongest answers feel professional, role-focused, and structured rather than overly personal or scattered.",
    tags: ["hr", "introduction", "communication"]
  },
  {
    title: "Project Ownership Example",
    category: "HR",
    topic: "Ownership",
    difficulty: "Medium",
    company: "Amazon",
    type: "Subjective",
    description: "Tell me about a time you took ownership of a technical problem beyond what was formally assigned to you. How would you structure that answer?",
    correctAnswer: "Use a clear situation-task-action-result format, explain the gap you noticed, the extra responsibility you took, and the measurable outcome of your initiative.",
    explanation: "Interviewers are evaluating whether you step up proactively and communicate impact clearly.",
    tags: ["behavioral", "ownership", "star"]
  },
  {
    title: "Receiving Difficult Feedback",
    category: "HR",
    topic: "Self Awareness",
    difficulty: "Medium",
    company: "Microsoft",
    type: "Subjective",
    description: "How would you answer a question about receiving difficult feedback from a senior or teammate?",
    correctAnswer: "Describe the feedback honestly, show that you listened without defensiveness, explain what you changed, and highlight the improvement that followed.",
    explanation: "The key quality here is maturity and growth, not perfection.",
    tags: ["behavioral", "feedback", "growth"]
  },
  {
    title: "Disagreement on a Technical Decision",
    category: "HR",
    topic: "Teamwork",
    difficulty: "Medium",
    company: "Atlassian",
    type: "Subjective",
    description: "If you disagreed with a teammate on a technical design decision, how would you describe a healthy resolution approach?",
    correctAnswer: "Focus on understanding the tradeoffs, align on requirements, evaluate options with evidence, and support the final team decision once a direction is chosen.",
    explanation: "Interviewers want to hear collaborative problem-solving, not ego-driven conflict.",
    tags: ["behavioral", "teamwork", "decision-making"]
  },
  {
    title: "Handling Pressure Without Losing Quality",
    category: "HR",
    topic: "Behavioral Interviews",
    difficulty: "Medium",
    company: "Adobe",
    type: "Subjective",
    description: "Describe how you would answer a question about working under pressure while still maintaining code quality.",
    correctAnswer: "Choose a real situation, explain how you prioritized tasks, communicated risks early, reduced scope where needed, and still protected the most important quality checks.",
    explanation: "The best answers show judgment, communication, and calm execution under constraints.",
    tags: ["behavioral", "pressure", "prioritization"]
  },
  {
    title: "Why This Company With Real Motivation",
    category: "HR",
    topic: "Company Fit",
    difficulty: "Easy",
    company: "Google",
    type: "Subjective",
    description: "What makes a 'Why this company?' answer feel authentic instead of generic in a top-company interview?",
    correctAnswer: "Connect the company's product, engineering culture, scale, or domain with your interests and growth goals, and reference specifics that show real research.",
    explanation: "A convincing answer sounds informed and role-specific rather than like a copied template.",
    tags: ["company-fit", "motivation", "research"]
  },
  {
    title: "Leadership at an Early Career Stage",
    category: "HR",
    topic: "Leadership",
    difficulty: "Medium",
    company: "Meta",
    type: "Subjective",
    description: "Even as a fresher or early-career engineer, what does leadership mean to you, and how would you answer that in an interview?",
    correctAnswer: "Leadership at an early stage means taking responsibility, improving clarity, helping the team move forward, and positively influencing outcomes without waiting for a formal title.",
    explanation: "This kind of answer shows maturity and initiative without overstating seniority.",
    tags: ["leadership", "behavioral", "ownership"]
  },
  {
    title: "Learning a New Technology Quickly",
    category: "HR",
    topic: "Learning Ability",
    difficulty: "Easy",
    company: "Netflix",
    type: "Subjective",
    description: "How would you answer a behavioral question about learning a new technology quickly to deliver a project or assignment?",
    correctAnswer: "Describe the context, explain how you broke the learning into essentials, applied it in a real deliverable, and reflected on what helped you ramp up effectively.",
    explanation: "Interviewers want to hear evidence of adaptability, not just that you are 'a fast learner.'",
    tags: ["behavioral", "learning", "adaptability"]
  },
  {
    title: "Decision Making Under Ambiguity",
    category: "HR",
    topic: "Problem Solving",
    difficulty: "Medium",
    company: "Uber",
    type: "Subjective",
    description: "Tell me how you would approach a situation where requirements are incomplete but you still need to move the work forward.",
    correctAnswer: "Clarify what is known, identify the highest-risk assumptions, align quickly with stakeholders, and move ahead with a reversible or low-risk implementation plan.",
    explanation: "A good answer shows structured thinking and comfort with ambiguity rather than waiting passively for perfect clarity.",
    tags: ["problem-solving", "ambiguity", "communication"]
  },
  {
    title: "Why Should We Hire You for This Role",
    category: "HR",
    topic: "Self Awareness",
    difficulty: "Medium",
    company: "General",
    type: "Subjective",
    description: "What makes a strong answer to 'Why should we hire you?' for a fresher or 1-2 year candidate?",
    correctAnswer: "Connect your technical foundation, project evidence, work ethic, learning speed, and role alignment to the value you can bring to the team.",
    explanation: "The answer should be confident and specific, with proof points rather than broad self-praise.",
    tags: ["hr", "self-awareness", "role-fit"]
  }
];

const TARGET_VISIBLE_PER_CATEGORY = 1000;
const SOFTWARE_CATEGORIES = ["DSA", "Aptitude", "HR", "Core Subjects"];
const practiceAngles = [
  "Frame your answer the way you would explain it in a technical round.",
  "Add one practical example after the core answer.",
  "Mention one edge case, trade-off, or limitation while answering.",
  "Start with the short version first and then expand with detail.",
  "Focus on concept clarity and one interview-style use case.",
  "Explain the pattern, formula, or approach before giving the final answer."
];
const softwareCompanies = ["Amazon", "Microsoft", "Google", "Infosys", "TCS", "Accenture", "Wipro", "Cognizant", "Capgemini", "Oracle", "IBM", "Deloitte"];

const normalizeDifficulty = (baseDifficulty, variantIndex) => {
  if (baseDifficulty === "Hard") return "Hard";
  const cycle = ["Easy", "Medium", "Medium", "Hard"];
  return cycle[variantIndex % cycle.length];
};

const createVariant = (question, variantIndex) => {
  const angle = practiceAngles[variantIndex % practiceAngles.length];
  const company = softwareCompanies[variantIndex % softwareCompanies.length];
  const variantNumber = variantIndex + 1;

  return {
    ...question,
    field: "Software",
    title: `${question.title} Practice Variant ${variantNumber}`,
    company,
    difficulty: normalizeDifficulty(question.difficulty, variantIndex),
    description: `${question.description} Practice focus ${variantNumber}: ${angle}`,
    explanation: `${question.explanation} Practice note: ${angle}`,
    tags: [...new Set([...(question.tags || []), "practice-variant", `variant-${variantNumber}`])]
  };
};

const buildLargeQuestionBank = () => {
  const normalizedBase = [...softwareBaseQuestions, ...professionalInterviewQuestions].map((question) => ({
    ...question,
    field: "Software",
    starterCode: question.starterCode || {}
  }));

  const expanded = [...normalizedBase];

  SOFTWARE_CATEGORIES.forEach((category) => {
    const sourcePool = normalizedBase.filter((question) => question.category === category && question.type !== "MCQ");
    if (!sourcePool.length) return;

    let visibleCount = normalizedBase.filter((question) => question.category === category && question.type !== "MCQ").length;
    let variantIndex = 0;

    while (visibleCount < TARGET_VISIBLE_PER_CATEGORY) {
      const source = sourcePool[variantIndex % sourcePool.length];
      expanded.push(createVariant(source, variantIndex));
      visibleCount += 1;
      variantIndex += 1;
    }
  });

  return expanded;
};

const seedQuestions = buildLargeQuestionBank();

export default seedQuestions;

