const baseSeedQuestions = [
  {
    title: "Two Sum",
    category: "DSA",
    topic: "Arrays",
    difficulty: "Easy",
    company: "Amazon",
    type: "Coding",
    description: "Return indices of two numbers that add up to target.",
    correctAnswer: "Use a hash map to track complements in O(n).",
    explanation: "A hash map gives constant-time complement lookup while scanning once.",
    starterCode: {
      python: "def two_sum(nums, target):\n    pass",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target){ return {}; }",
      java: "class Solution { public int[] twoSum(int[] nums, int target){ return new int[]{}; } }"
    },
    tags: ["arrays", "hashmap"]
  },
  {
    title: "Kadane's Algorithm",
    category: "DSA",
    topic: "Arrays",
    difficulty: "Medium",
    company: "Adobe",
    type: "Coding",
    description: "Find the maximum sum of a contiguous subarray.",
    correctAnswer: "Track current best ending here and global best in one pass.",
    explanation: "Kadane's algorithm maintains local and global maxima in O(n).",
    starterCode: {
      python: "def max_subarray(nums):\n    pass",
      cpp: "int maxSubArray(vector<int>& nums) {\n    return 0;\n}",
      java: "class Solution {\n    public int maxSubArray(int[] nums) {\n        return 0;\n    }\n}"
    },
    tags: ["arrays", "dynamic-programming"]
  },
  {
    title: "Best Time to Buy and Sell Stock",
    category: "DSA",
    topic: "Arrays",
    difficulty: "Easy",
    company: "Goldman Sachs",
    type: "MCQ",
    description: "What is the best strategy to maximize one stock trade profit?",
    options: ["Sort the array first", "Track minimum price so far and best profit", "Use nested loops only", "Always buy on first day"],
    correctAnswer: "Track minimum price so far and best profit",
    explanation: "Keeping the minimum price so far lets you compute the best profit in linear time.",
    tags: ["arrays", "greedy"]
  },
  {
    title: "Valid Parentheses",
    category: "DSA",
    topic: "Stacks",
    difficulty: "Easy",
    company: "PayPal",
    type: "MCQ",
    description: "Which data structure is best suited to check balanced parentheses?",
    options: ["Queue", "Stack", "Heap", "Trie"],
    correctAnswer: "Stack",
    explanation: "A stack naturally matches nested opening and closing brackets.",
    tags: ["stack", "basics"]
  },
  {
    title: "Next Greater Element",
    category: "DSA",
    topic: "Stacks",
    difficulty: "Medium",
    company: "Samsung",
    type: "MCQ",
    description: "Which approach is commonly used for Next Greater Element problems?",
    options: ["Monotonic stack", "Binary search tree", "Disjoint set", "Prefix sum"],
    correctAnswer: "Monotonic stack",
    explanation: "A monotonic stack efficiently tracks candidates for the next greater element.",
    tags: ["stack", "monotonic stack"]
  },
  {
    title: "Merge Two Sorted Lists",
    category: "DSA",
    topic: "Linked List",
    difficulty: "Easy",
    company: "Accenture",
    type: "Coding",
    description: "Merge two sorted linked lists and return a single sorted list.",
    correctAnswer: "Use two pointers and attach the smaller current node each step.",
    explanation: "The merge process is linear because each node is visited once.",
    starterCode: {
      python: "def merge_two_lists(l1, l2):\n    pass",
      cpp: "ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    return nullptr;\n}",
      java: "class Solution {\n    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {\n        return null;\n    }\n}"
    },
    tags: ["linked-list", "two-pointers"]
  },
  {
    title: "Detect Cycle in Linked List",
    category: "DSA",
    topic: "Linked List",
    difficulty: "Medium",
    company: "Meta",
    type: "MCQ",
    description: "Which technique detects a cycle in a linked list using O(1) extra space?",
    options: ["Hash map", "Sorting", "Slow and fast pointers", "Recursion"],
    correctAnswer: "Slow and fast pointers",
    explanation: "Floyd's cycle detection uses two pointers moving at different speeds.",
    tags: ["linked-list", "floyd cycle"]
  },
  {
    title: "Binary Tree Traversal",
    category: "DSA",
    topic: "Trees",
    difficulty: "Medium",
    company: "Microsoft",
    type: "MCQ",
    description: "Which traversal visits Left, Root, Right?",
    options: ["Preorder", "Inorder", "Postorder", "Level Order"],
    correctAnswer: "Inorder",
    explanation: "Inorder visits left subtree, root, then right subtree.",
    tags: ["trees", "traversal"]
  },
  {
    title: "Height of Binary Tree",
    category: "DSA",
    topic: "Trees",
    difficulty: "Easy",
    company: "ServiceNow",
    type: "Coding",
    description: "Return the height or maximum depth of a binary tree.",
    correctAnswer: "Use recursion to compute 1 plus the maximum of left and right subtree heights.",
    explanation: "Tree height is naturally solved with DFS recursion.",
    starterCode: {
      python: "def max_depth(root):\n    pass",
      cpp: "int maxDepth(TreeNode* root) {\n    return 0;\n}",
      java: "class Solution {\n    public int maxDepth(TreeNode root) {\n        return 0;\n    }\n}"
    },
    tags: ["trees", "dfs"]
  },
  {
    title: "Shortest Path in Unweighted Graph",
    category: "DSA",
    topic: "Graphs",
    difficulty: "Medium",
    company: "Uber",
    type: "MCQ",
    description: "Which algorithm gives the shortest path in an unweighted graph?",
    options: ["DFS", "BFS", "Dijkstra", "Floyd Warshall"],
    correctAnswer: "BFS",
    explanation: "Breadth-first search explores level by level and reaches the shortest path first in unweighted graphs.",
    tags: ["graphs", "bfs"]
  },
  {
    title: "Topological Sort Use Case",
    category: "DSA",
    topic: "Graphs",
    difficulty: "Medium",
    company: "Atlassian",
    type: "MCQ",
    description: "Topological sorting is valid for which kind of graph?",
    options: ["Undirected graph", "Complete graph", "Directed acyclic graph", "Weighted cyclic graph"],
    correctAnswer: "Directed acyclic graph",
    explanation: "A topological order exists only for DAGs.",
    tags: ["graphs", "dag"]
  },
  {
    title: "Time Complexity of Binary Search",
    category: "DSA",
    topic: "Searching",
    difficulty: "Easy",
    company: "Wipro",
    type: "MCQ",
    description: "What is the worst-case time complexity of binary search?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: "O(log n)",
    explanation: "Binary search halves the search space with each comparison.",
    tags: ["searching", "complexity"]
  },
  {
    title: "Lower Bound Concept",
    category: "DSA",
    topic: "Searching",
    difficulty: "Medium",
    company: "NVIDIA",
    type: "Subjective",
    description: "Explain what lower_bound means in binary search based libraries.",
    correctAnswer: "It returns the first position where the target can be inserted without violating sorted order, typically the first element not less than the target.",
    explanation: "A strong answer should mention sorted arrays, insertion position, and first not-less-than behavior.",
    tags: ["searching", "binary search"]
  },
  {
    title: "Reverse a String",
    category: "DSA",
    topic: "Strings",
    difficulty: "Easy",
    company: "Persistent",
    type: "Coding",
    description: "Return the reverse of a given string.",
    correctAnswer: "Use two pointers or built-in reverse operations depending on constraints.",
    explanation: "A two-pointer solution is simple and runs in linear time.",
    starterCode: {
      python: "def reverse_string(s):\n    pass",
      cpp: "string reverseString(string s) {\n    return s;\n}",
      java: "class Solution {\n    public String reverseString(String s) {\n        return s;\n    }\n}"
    },
    tags: ["strings", "two-pointers"]
  },
  {
    title: "Longest Common Prefix",
    category: "DSA",
    topic: "Strings",
    difficulty: "Easy",
    company: "Google",
    type: "MCQ",
    description: "Which approach is commonly used to find the longest common prefix among strings?",
    options: ["Sort strings and compare first and last", "Use BFS", "Use a hash map only", "Use binary tree traversal"],
    correctAnswer: "Sort strings and compare first and last",
    explanation: "After sorting, the common prefix of the first and last strings gives the global prefix.",
    tags: ["strings", "prefix"]
  },
  {
    title: "Sliding Window Maximum Sum",
    category: "DSA",
    topic: "Sliding Window",
    difficulty: "Medium",
    company: "Swiggy",
    type: "MCQ",
    description: "Which technique is used to find the maximum sum of a fixed-size subarray efficiently?",
    options: ["Sliding window", "Disjoint set", "DFS", "Merge sort"],
    correctAnswer: "Sliding window",
    explanation: "Sliding window updates the current range sum in constant time per move.",
    tags: ["sliding window", "arrays"]
  },
  {
    title: "Recursion Base Case",
    category: "DSA",
    topic: "Recursion",
    difficulty: "Easy",
    company: "Mindtree",
    type: "MCQ",
    description: "Why is a base case necessary in recursion?",
    options: ["To improve syntax", "To stop infinite recursive calls", "To avoid loops", "To reduce memory to zero"],
    correctAnswer: "To stop infinite recursive calls",
    explanation: "Without a base case, recursive calls continue indefinitely and cause stack overflow.",
    tags: ["recursion", "basics"]
  },
  {
    title: "Probability Basics",
    category: "Aptitude",
    topic: "Probability",
    difficulty: "Medium",
    company: "TCS",
    type: "MCQ",
    description: "Probability of getting exactly one head in two fair coin tosses?",
    options: ["1/4", "1/2", "3/4", "1"],
    correctAnswer: "1/2",
    explanation: "HT and TH are favorable out of 4 outcomes.",
    tags: ["probability", "coin toss"]
  },
  {
    title: "Dice Probability",
    category: "Aptitude",
    topic: "Probability",
    difficulty: "Easy",
    company: "Infosys",
    type: "MCQ",
    description: "What is the probability of rolling a number greater than 4 on a fair die?",
    options: ["1/6", "1/3", "1/2", "2/3"],
    correctAnswer: "1/3",
    explanation: "Favorable outcomes are 5 and 6, so 2 out of 6 simplifies to 1/3.",
    tags: ["probability", "dice"]
  },
  {
    title: "Permutation vs Combination",
    category: "Aptitude",
    topic: "Permutation and Combination",
    difficulty: "Medium",
    company: "Cognizant",
    type: "Subjective",
    description: "Explain the difference between permutation and combination with one example.",
    correctAnswer: "Permutation considers order while combination does not; for example arranging 3 people in 2 seats differs from choosing any 2 people.",
    explanation: "A complete answer should clearly mention the role of order and provide an intuitive example.",
    tags: ["permutation", "combination"]
  },
  {
    title: "Simple Interest",
    category: "Aptitude",
    topic: "Percentages",
    difficulty: "Easy",
    company: "Infosys",
    type: "MCQ",
    description: "Find the simple interest on 2000 at 10% per annum for 2 years.",
    options: ["200", "300", "400", "500"],
    correctAnswer: "400",
    explanation: "Simple interest = (P x R x T) / 100 = (2000 x 10 x 2) / 100 = 400.",
    tags: ["percentages", "interest"]
  },
  {
    title: "Compound Interest Basics",
    category: "Aptitude",
    topic: "Percentages",
    difficulty: "Medium",
    company: "DXC",
    type: "MCQ",
    description: "What is the compound amount on 1000 at 10% for 2 years?",
    options: ["1100", "1200", "1210", "1220"],
    correctAnswer: "1210",
    explanation: "Amount = 1000 x (1.1)^2 = 1210.",
    tags: ["compound interest", "percentages"]
  },
  {
    title: "Speed Distance Time",
    category: "Aptitude",
    topic: "Time and Distance",
    difficulty: "Medium",
    company: "Capgemini",
    type: "MCQ",
    description: "A car covers 150 km in 3 hours. What is its speed?",
    options: ["30 km/h", "40 km/h", "50 km/h", "60 km/h"],
    correctAnswer: "50 km/h",
    explanation: "Speed = Distance / Time = 150 / 3 = 50 km/h.",
    tags: ["time-distance", "basics"]
  },
  {
    title: "Time and Work",
    category: "Aptitude",
    topic: "Time and Work",
    difficulty: "Medium",
    company: "WNS",
    type: "MCQ",
    description: "If A completes a task in 10 days, what fraction of the work does A finish in 1 day?",
    options: ["1/5", "1/10", "1/15", "10"],
    correctAnswer: "1/10",
    explanation: "One-day work equals the reciprocal of total days needed.",
    tags: ["time and work", "basics"]
  },
  {
    title: "Profit and Loss",
    category: "Aptitude",
    topic: "Profit and Loss",
    difficulty: "Easy",
    company: "Genpact",
    type: "MCQ",
    description: "If an item costing 500 is sold for 600, what is the profit percentage?",
    options: ["10%", "15%", "20%", "25%"],
    correctAnswer: "20%",
    explanation: "Profit is 100, so percentage profit = 100/500 x 100 = 20%.",
    tags: ["profit loss", "percentages"]
  },
  {
    title: "Ratio and Proportion",
    category: "Aptitude",
    topic: "Ratio and Proportion",
    difficulty: "Easy",
    company: "TCS",
    type: "MCQ",
    description: "If the ratio of boys to girls is 3:2 and there are 30 boys, how many girls are there?",
    options: ["15", "20", "25", "30"],
    correctAnswer: "20",
    explanation: "If 3 parts correspond to 30, then 1 part is 10 and 2 parts are 20.",
    tags: ["ratio", "proportion"]
  },
  {
    title: "Number Series",
    category: "Aptitude",
    topic: "Logical Reasoning",
    difficulty: "Medium",
    company: "Cognizant",
    type: "MCQ",
    description: "What comes next in the series: 2, 6, 12, 20, 30, ?",
    options: ["36", "40", "42", "44"],
    correctAnswer: "42",
    explanation: "The differences are 4, 6, 8, 10, so the next difference is 12.",
    tags: ["series", "reasoning"]
  },
  {
    title: "Syllogism Basics",
    category: "Aptitude",
    topic: "Logical Reasoning",
    difficulty: "Medium",
    company: "EY",
    type: "MCQ",
    description: "If all engineers are graduates and some graduates are coders, which statement must be true?",
    options: ["All coders are engineers", "Some engineers may be coders", "No graduates are coders", "All graduates are engineers"],
    correctAnswer: "Some engineers may be coders",
    explanation: "The given statements allow the possibility of overlap but not certainty for all sets.",
    tags: ["syllogism", "reasoning"]
  },
  {
    title: "Tell me about yourself",
    category: "HR",
    topic: "Self Introduction",
    difficulty: "Easy",
    company: "General",
    type: "Subjective",
    description: "Answer this classic HR prompt briefly and clearly.",
    correctAnswer: "Present role, key strengths, project evidence, and fit for the role.",
    explanation: "Good HR answers are concise, relevant, and outcome-oriented.",
    tags: ["introduction", "hr"]
  },
  {
    title: "Why should we hire you?",
    category: "HR",
    topic: "Self Awareness",
    difficulty: "Medium",
    company: "General",
    type: "Subjective",
    description: "Craft a convincing answer for why you are the right fit.",
    correctAnswer: "Link your skills, projects, attitude, and role alignment with clear value to the company.",
    explanation: "The best answer is specific, confident, and tied to the company's needs.",
    tags: ["fit", "strengths"]
  },
  {
    title: "Describe a conflict you handled",
    category: "HR",
    topic: "Behavioral Interviews",
    difficulty: "Medium",
    company: "General",
    type: "Subjective",
    description: "Answer this using the STAR structure with a real example.",
    correctAnswer: "Explain the situation, your responsibility, the action you took, and the final outcome.",
    explanation: "STAR helps keep behavioral answers structured and easy to evaluate.",
    tags: ["star", "conflict"]
  },
  {
    title: "What are your strengths and weaknesses?",
    category: "HR",
    topic: "Self Awareness",
    difficulty: "Medium",
    company: "General",
    type: "Subjective",
    description: "Frame a balanced answer showing honesty and growth mindset.",
    correctAnswer: "Mention strengths backed by examples and a genuine weakness with the steps you are taking to improve it.",
    explanation: "Interviewers look for self-awareness, maturity, and improvement efforts.",
    tags: ["strengths", "weaknesses"]
  },
  {
    title: "Leadership Example",
    category: "HR",
    topic: "Behavioral Interviews",
    difficulty: "Medium",
    company: "General",
    type: "Subjective",
    description: "Describe a situation where you took initiative or led a group.",
    correctAnswer: "Explain context, how you influenced the team, what actions you took, and the measurable result.",
    explanation: "A strong answer emphasizes initiative, communication, and outcome.",
    tags: ["leadership", "initiative"]
  },
  {
    title: "Failure and Learning",
    category: "HR",
    topic: "Behavioral Interviews",
    difficulty: "Medium",
    company: "General",
    type: "Subjective",
    description: "Share one failure and what you learned from it.",
    correctAnswer: "Choose a real setback, take ownership, describe what changed in your approach, and show improvement.",
    explanation: "The best responses focus less on the failure itself and more on learning and growth.",
    tags: ["failure", "learning"]
  },
  {
    title: "Operating System Process States",
    category: "Core Subjects",
    topic: "Operating Systems",
    difficulty: "Easy",
    company: "HCL",
    type: "MCQ",
    description: "Which state comes after a process is created and ready to run on CPU?",
    options: ["Blocked", "Ready", "Waiting", "Terminated"],
    correctAnswer: "Ready",
    explanation: "A newly admitted process generally enters the ready state before execution.",
    tags: ["os", "process"]
  },
  {
    title: "Deadlock Necessary Conditions",
    category: "Core Subjects",
    topic: "Operating Systems",
    difficulty: "Medium",
    company: "Oracle",
    type: "MCQ",
    description: "Which of the following is NOT a necessary condition for deadlock?",
    options: ["Mutual Exclusion", "Hold and Wait", "Preemption", "Circular Wait"],
    correctAnswer: "Preemption",
    explanation: "No preemption is the actual deadlock condition, not preemption itself.",
    tags: ["os", "deadlock"]
  },
  {
    title: "Round Robin Scheduling",
    category: "Core Subjects",
    topic: "Operating Systems",
    difficulty: "Medium",
    company: "VMware",
    type: "MCQ",
    description: "Which CPU scheduling algorithm assigns a fixed time slice to each process in a cyclic order?",
    options: ["FCFS", "SJF", "Round Robin", "Priority Scheduling"],
    correctAnswer: "Round Robin",
    explanation: "Round Robin uses time quantum to share CPU fairly among ready processes.",
    tags: ["os", "scheduling"]
  },
  {
    title: "Paging",
    category: "Core Subjects",
    topic: "Operating Systems",
    difficulty: "Medium",
    company: "Intel",
    type: "MCQ",
    description: "What problem is paging primarily used to solve?",
    options: ["Starvation", "External fragmentation", "Deadlock", "Context switching"],
    correctAnswer: "External fragmentation",
    explanation: "Paging divides memory into fixed-size blocks to reduce external fragmentation.",
    tags: ["os", "memory management"]
  },
  {
    title: "DBMS Normalization",
    category: "Core Subjects",
    topic: "DBMS",
    difficulty: "Medium",
    company: "Infosys",
    type: "MCQ",
    description: "Which normal form removes partial dependency?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    correctAnswer: "2NF",
    explanation: "Second Normal Form removes partial dependencies.",
    tags: ["dbms", "normalization"]
  },
  {
    title: "Primary Key vs Foreign Key",
    category: "Core Subjects",
    topic: "DBMS",
    difficulty: "Easy",
    company: "Tech Mahindra",
    type: "MCQ",
    description: "Which statement about a foreign key is correct?",
    options: ["It uniquely identifies each record in its own table", "It links records between tables", "It must always be auto-increment", "It cannot contain duplicate values"],
    correctAnswer: "It links records between tables",
    explanation: "A foreign key references a primary key in another table to create relationships.",
    tags: ["dbms", "keys"]
  },
  {
    title: "ACID Properties",
    category: "Core Subjects",
    topic: "DBMS",
    difficulty: "Medium",
    company: "Morgan Stanley",
    type: "MCQ",
    description: "Which ACID property ensures that a transaction is treated as a single unit?",
    options: ["Consistency", "Isolation", "Atomicity", "Durability"],
    correctAnswer: "Atomicity",
    explanation: "Atomicity means the transaction either fully happens or does not happen at all.",
    tags: ["dbms", "transactions"]
  },
  {
    title: "Inner Join Concept",
    category: "Core Subjects",
    topic: "SQL",
    difficulty: "Easy",
    company: "PwC",
    type: "MCQ",
    description: "What does an INNER JOIN return?",
    options: ["All rows from both tables", "Only unmatched rows", "Rows with matching values in both tables", "Only rows from the left table"],
    correctAnswer: "Rows with matching values in both tables",
    explanation: "INNER JOIN keeps only records that satisfy the join condition in both tables.",
    tags: ["sql", "joins"]
  },
  {
    title: "SQL Query to Find Second Highest Salary",
    category: "Core Subjects",
    topic: "SQL",
    difficulty: "Medium",
    company: "Flipkart",
    type: "Subjective",
    description: "Explain one correct SQL approach to get the second highest salary from an employee table.",
    correctAnswer: "Use ORDER BY with LIMIT/OFFSET or a subquery/max comparison depending on SQL dialect.",
    explanation: "Interviewers usually want a correct query idea and awareness of duplicates or SQL dialect differences.",
    tags: ["sql", "queries"]
  },
  {
    title: "OSI Layer for Routing",
    category: "Core Subjects",
    topic: "Computer Networks",
    difficulty: "Easy",
    company: "Cisco",
    type: "MCQ",
    description: "At which OSI layer does routing primarily occur?",
    options: ["Transport", "Session", "Network", "Data Link"],
    correctAnswer: "Network",
    explanation: "Routing decisions are made at the network layer.",
    tags: ["networks", "osi"]
  },
  {
    title: "TCP vs UDP",
    category: "Core Subjects",
    topic: "Computer Networks",
    difficulty: "Medium",
    company: "Juniper",
    type: "Subjective",
    description: "Explain the difference between TCP and UDP with use cases.",
    correctAnswer: "TCP is connection-oriented and reliable; UDP is connectionless and faster with lower overhead for use cases like streaming and DNS.",
    explanation: "Interviewers expect reliability, ordering, speed, and example-based comparison.",
    tags: ["tcp", "udp"]
  },
  {
    title: "HTTP Request Methods",
    category: "Core Subjects",
    topic: "Computer Networks",
    difficulty: "Easy",
    company: "Postman",
    type: "MCQ",
    description: "Which HTTP method is commonly used to update a resource completely?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correctAnswer: "PUT",
    explanation: "PUT is conventionally used to replace or fully update a resource.",
    tags: ["http", "api"]
  },
  {
    title: "Object Oriented Programming Pillars",
    category: "Core Subjects",
    topic: "OOP",
    difficulty: "Easy",
    company: "Zoho",
    type: "MCQ",
    description: "Which one is NOT a core OOP principle?",
    options: ["Encapsulation", "Polymorphism", "Abstraction", "Compilation"],
    correctAnswer: "Compilation",
    explanation: "The main OOP pillars are encapsulation, abstraction, inheritance, and polymorphism.",
    tags: ["oop", "principles"]
  },
  {
    title: "Inheritance in OOP",
    category: "Core Subjects",
    topic: "OOP",
    difficulty: "Easy",
    company: "SAP",
    type: "MCQ",
    description: "What is inheritance used for in OOP?",
    options: ["Hiding all methods permanently", "Reusing and extending existing classes", "Deleting base classes", "Avoiding constructors"],
    correctAnswer: "Reusing and extending existing classes",
    explanation: "Inheritance allows derived classes to reuse and customize behavior from base classes.",
    tags: ["oop", "inheritance"]
  },
  {
    title: "Java Memory Management",
    category: "Core Subjects",
    topic: "Java",
    difficulty: "Medium",
    company: "IBM",
    type: "Subjective",
    description: "Explain how garbage collection works in Java.",
    correctAnswer: "Java automatically reclaims memory used by unreachable objects through garbage collection, reducing manual memory management.",
    explanation: "A good answer mentions heap memory, unreachable objects, and automatic cleanup.",
    tags: ["java", "memory"]
  },
  {
    title: "Java Exception Hierarchy",
    category: "Core Subjects",
    topic: "Java",
    difficulty: "Medium",
    company: "EPAM",
    type: "MCQ",
    description: "Which class is the parent of all exceptions and errors in Java?",
    options: ["Exception", "Throwable", "RuntimeException", "Object"],
    correctAnswer: "Throwable",
    explanation: "Throwable is the root class for Exception and Error in Java.",
    tags: ["java", "exceptions"]
  },
  {
    title: "Python List vs Tuple",
    category: "Core Subjects",
    topic: "Python",
    difficulty: "Easy",
    company: "Deloitte",
    type: "MCQ",
    description: "Which statement is true about tuples in Python?",
    options: ["They are mutable", "They are slower than lists for iteration", "They are immutable", "They can only store numbers"],
    correctAnswer: "They are immutable",
    explanation: "Tuples are ordered immutable collections and are often used for fixed data.",
    tags: ["python", "data structures"]
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
    explanation: "Python dictionaries are hash table based, giving average constant-time lookup.",
    tags: ["python", "hash table"]
  }
  ,
  {
    title: "Longest Substring Without Repeating Characters",
    category: "DSA",
    topic: "Sliding Window",
    difficulty: "Medium",
    company: "Amazon",
    type: "Coding",
    description: "Find the length of the longest substring without repeating characters.",
    correctAnswer: "Use a sliding window with a hash map or set to track the current unique substring in O(n).",
    explanation: "A moving window lets you expand and shrink while maintaining uniqueness efficiently.",
    starterCode: {
      python: "def length_of_longest_substring(s):\n    pass",
      cpp: "int lengthOfLongestSubstring(string s) {\n    return 0;\n}",
      java: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}"
    },
    tags: ["sliding window", "strings"]
  },
  {
    title: "Explain Merge Sort",
    category: "DSA",
    topic: "Sorting",
    difficulty: "Medium",
    company: "Infosys",
    type: "Subjective",
    description: "Explain how merge sort works and mention its time complexity.",
    correctAnswer: "Merge sort follows divide and conquer by splitting the array, recursively sorting both halves, and merging them back in sorted order with O(n log n) time.",
    explanation: "A good answer should mention divide and conquer, recursive splitting, merging, and O(n log n) complexity.",
    tags: ["sorting", "divide and conquer"]
  },
  {
    title: "Probability of Drawing an Ace",
    category: "Aptitude",
    topic: "Probability",
    difficulty: "Easy",
    company: "Accenture",
    type: "Subjective",
    description: "A card is drawn from a standard deck. Explain how to find the probability that it is an ace.",
    correctAnswer: "A standard deck has 52 cards and 4 aces, so the probability is favorable outcomes over total outcomes, which is 4 by 52 or 1 by 13.",
    explanation: "The answer should explain total outcomes, favorable outcomes, and the simplified probability.",
    tags: ["probability", "cards"]
  },
  {
    title: "Time and Work Strategy",
    category: "Aptitude",
    topic: "Time and Work",
    difficulty: "Medium",
    company: "TCS",
    type: "Subjective",
    description: "Explain the general method to solve time and work problems involving two people working together.",
    correctAnswer: "Convert each person's work into one-day work, add their rates together, and then take the reciprocal of the combined rate to get total time.",
    explanation: "A clear answer should focus on work rates, one-day work, and combining rates logically.",
    tags: ["time and work", "rates"]
  },
  {
    title: "Tell me about a project you are proud of",
    category: "HR",
    topic: "Project Discussion",
    difficulty: "Medium",
    company: "General",
    type: "Subjective",
    description: "Answer this HR question in a structured way that highlights your contribution and impact.",
    correctAnswer: "Choose one meaningful project, explain the goal, your role, the challenges, the solution you built, and the final impact or learning.",
    explanation: "Strong answers are concrete, structured, and centered on your contribution rather than the project title alone.",
    tags: ["projects", "communication"]
  },
  {
    title: "How do you handle pressure and deadlines?",
    category: "HR",
    topic: "Behavioral Interviews",
    difficulty: "Medium",
    company: "General",
    type: "Subjective",
    description: "Give an interview-ready answer showing calmness, planning, and responsibility.",
    correctAnswer: "Explain that you break work into priorities, communicate clearly, stay focused on critical tasks, and use a real example where you delivered under pressure.",
    explanation: "Interviewers want a balanced answer showing process, maturity, and a real example.",
    tags: ["pressure", "deadlines"]
  },
  {
    title: "Difference Between Process and Thread",
    category: "Core Subjects",
    topic: "Operating Systems",
    difficulty: "Medium",
    company: "Microsoft",
    type: "Subjective",
    description: "Explain the difference between a process and a thread with one practical point.",
    correctAnswer: "A process has its own memory space and resources, while threads are smaller execution units within a process that share the same memory space.",
    explanation: "A good answer should mention memory isolation, resource sharing, and why threads are lighter than processes.",
    tags: ["os", "processes", "threads"]
  },
  {
    title: "Write SQL to Get Employees by Department",
    category: "Core Subjects",
    topic: "SQL",
    difficulty: "Easy",
    company: "Wipro",
    type: "Subjective",
    description: "Explain a simple SQL query to fetch all employees belonging to a given department.",
    correctAnswer: "Use a SELECT statement with a WHERE condition on the department column, for example selecting all columns from employees where department equals a chosen department name.",
    explanation: "This tests basic SQL filtering using SELECT and WHERE clauses.",
    tags: ["sql", "select", "where"]
  },
  {
    title: "Binary Search on Answer",
    category: "DSA",
    topic: "Binary Search",
    difficulty: "Medium",
    company: "Google",
    type: "Subjective",
    description: "Explain what binary search on answer means and where it is used.",
    correctAnswer: "Binary search on answer is used when the solution space is ordered and you can validate whether a guessed answer is feasible, allowing you to narrow the range until you find the optimal value.",
    explanation: "A strong answer mentions monotonic conditions, low and high bounds, and a feasibility check function.",
    tags: ["binary search", "optimization"]
  },
  {
    title: "Climbing Stairs",
    category: "DSA",
    topic: "Dynamic Programming",
    difficulty: "Easy",
    company: "Adobe",
    type: "Coding",
    description: "Find the number of distinct ways to climb to the top if you can take 1 or 2 steps at a time.",
    correctAnswer: "Use dynamic programming where ways at step n equals ways at n minus 1 plus ways at n minus 2.",
    explanation: "This is a classic introductory DP problem with Fibonacci-style recurrence.",
    starterCode: {
      python: "def climb_stairs(n):\n    pass",
      cpp: "int climbStairs(int n) {\n    return 0;\n}",
      java: "class Solution {\n    public int climbStairs(int n) {\n        return 0;\n    }\n}"
    },
    tags: ["dynamic programming", "recurrence"]
  },
  {
    title: "Check Balanced Binary Tree",
    category: "DSA",
    topic: "Trees",
    difficulty: "Medium",
    company: "Microsoft",
    type: "Coding",
    description: "Determine whether a binary tree is height-balanced.",
    correctAnswer: "Use a postorder DFS that returns subtree height and detects imbalance when left and right heights differ by more than one.",
    explanation: "An efficient solution computes height and balance together in one traversal.",
    starterCode: {
      python: "def is_balanced(root):\n    pass",
      cpp: "bool isBalanced(TreeNode* root) {\n    return true;\n}",
      java: "class Solution {\n    public boolean isBalanced(TreeNode root) {\n        return true;\n    }\n}"
    },
    tags: ["trees", "dfs"]
  },
  {
    title: "Detect Cycle in a Directed Graph",
    category: "DSA",
    topic: "Graphs",
    difficulty: "Medium",
    company: "Atlassian",
    type: "Subjective",
    description: "Explain one standard approach to detect a cycle in a directed graph.",
    correctAnswer: "You can use DFS with visited and recursion-stack tracking, or use topological sorting and check whether all nodes can be processed.",
    explanation: "Interviewers usually expect either recursion-stack DFS or Kahn's algorithm reasoning.",
    tags: ["graphs", "cycle detection"]
  },
  {
    title: "Explain Hashing in Interviews",
    category: "DSA",
    topic: "Hashing",
    difficulty: "Easy",
    company: "Amazon",
    type: "Subjective",
    description: "Explain how hashing helps solve array and string problems efficiently.",
    correctAnswer: "Hashing stores values or frequencies in a structure with average constant-time lookup, which helps solve lookups, duplicates, complements, and counting problems efficiently.",
    explanation: "A good answer mentions fast lookup, key-value mapping, and typical use cases like frequency counting or Two Sum.",
    tags: ["hashing", "lookup"]
  },
  {
    title: "Averages Shortcut",
    category: "Aptitude",
    topic: "Average",
    difficulty: "Easy",
    company: "Infosys",
    type: "Subjective",
    description: "Explain the quickest way to solve average-based aptitude questions.",
    correctAnswer: "Use the fact that average equals total sum divided by number of values, so you often first compute total sum and then adjust it when one value changes or a new value is added.",
    explanation: "The best answers mention moving between average and total sum quickly.",
    tags: ["average", "shortcut"]
  },
  {
    title: "Boats and Streams Approach",
    category: "Aptitude",
    topic: "Time and Distance",
    difficulty: "Medium",
    company: "Capgemini",
    type: "Subjective",
    description: "Explain the formulas used in boats and streams problems.",
    correctAnswer: "Downstream speed is boat speed plus stream speed, upstream speed is boat speed minus stream speed, and solving these two equations helps find unknown values.",
    explanation: "A complete answer should mention upstream, downstream, and how to isolate boat and stream speeds.",
    tags: ["boats and streams", "time and distance"]
  },
  {
    title: "Partnership Aptitude Logic",
    category: "Aptitude",
    topic: "Partnership",
    difficulty: "Medium",
    company: "Wipro",
    type: "Subjective",
    description: "How are profit shares calculated in partnership questions?",
    correctAnswer: "Profit shares are divided in the ratio of investment multiplied by time, so both capital amount and investment duration matter.",
    explanation: "Interview aptitude questions often test whether you use capital times time rather than capital alone.",
    tags: ["partnership", "profit sharing"]
  },
  {
    title: "Simple and Compound Interest Difference",
    category: "Aptitude",
    topic: "Percentages",
    difficulty: "Easy",
    company: "TCS",
    type: "Subjective",
    description: "Explain the difference between simple interest and compound interest.",
    correctAnswer: "Simple interest is calculated only on the principal, while compound interest is calculated on principal plus accumulated interest over time.",
    explanation: "The main expected difference is interest on principal versus interest on principal plus prior interest.",
    tags: ["interest", "percentages"]
  },
  {
    title: "Seating Arrangement Strategy",
    category: "Aptitude",
    topic: "Logical Reasoning",
    difficulty: "Medium",
    company: "Cognizant",
    type: "Subjective",
    description: "How do you systematically solve seating arrangement questions?",
    correctAnswer: "Start by fixing the strongest constraints first, draw a clear positional diagram, mark confirmed placements, and then eliminate impossible options step by step.",
    explanation: "Judges expect an organized approach more than memorized formulas for reasoning puzzles.",
    tags: ["logical reasoning", "puzzles"]
  },
  {
    title: "Why do you want to join our company?",
    category: "HR",
    topic: "Company Fit",
    difficulty: "Medium",
    company: "General",
    type: "Subjective",
    description: "Frame an interview answer that sounds researched and sincere.",
    correctAnswer: "Connect the company's work, culture, learning opportunities, and role fit with your own strengths and career direction using specific reasons instead of generic praise.",
    explanation: "A strong answer shows research, alignment, and genuine motivation.",
    tags: ["company fit", "motivation"]
  },
  {
    title: "What are your short-term and long-term goals?",
    category: "HR",
    topic: "Career Goals",
    difficulty: "Medium",
    company: "General",
    type: "Subjective",
    description: "Answer this common HR question in a realistic way.",
    correctAnswer: "Short-term goals should focus on learning and contributing in the role, while long-term goals should show growth, deeper expertise, and increasing responsibility aligned with the field.",
    explanation: "Good answers sound practical, ambitious, and consistent with the job role.",
    tags: ["career goals", "planning"]
  },
  {
    title: "Describe a time you worked in a team",
    category: "HR",
    topic: "Behavioral Interviews",
    difficulty: "Easy",
    company: "General",
    type: "Subjective",
    description: "Use a structured response to explain teamwork experience.",
    correctAnswer: "Use STAR to explain the situation, your role in the team, how you collaborated or resolved issues, and the final result achieved together.",
    explanation: "Interviewers want collaboration, communication, and ownership, not just a group story.",
    tags: ["teamwork", "star"]
  },
  {
    title: "Explain your final year project clearly",
    category: "HR",
    topic: "Project Discussion",
    difficulty: "Medium",
    company: "General",
    type: "Subjective",
    description: "What structure should you follow when judges ask you to explain your project?",
    correctAnswer: "Start with the problem statement, then explain the solution, technology stack, your personal contribution, key features, challenges, and the final outcome or deployment.",
    explanation: "A structured explanation makes your project sound stronger and easier to evaluate.",
    tags: ["project explanation", "presentation"]
  },
  {
    title: "Normalization up to 3NF",
    category: "Core Subjects",
    topic: "DBMS",
    difficulty: "Medium",
    company: "Oracle",
    type: "Subjective",
    description: "Explain 1NF, 2NF, and 3NF in a simple interview-ready way.",
    correctAnswer: "1NF removes repeating groups, 2NF removes partial dependency, and 3NF removes transitive dependency so the schema becomes more organized and less redundant.",
    explanation: "A good answer keeps the progression clear and mentions redundancy reduction.",
    tags: ["dbms", "normalization"]
  },
  {
    title: "What is an Index in DBMS?",
    category: "Core Subjects",
    topic: "DBMS",
    difficulty: "Easy",
    company: "Morgan Stanley",
    type: "Subjective",
    description: "Explain what a database index is and why it is useful.",
    correctAnswer: "An index is a data structure that improves data retrieval speed by helping the database find rows faster, though it adds extra storage and update cost.",
    explanation: "A balanced answer should mention both faster reads and maintenance overhead.",
    tags: ["dbms", "indexing"]
  },
  {
    title: "Thread Scheduling Concept",
    category: "Core Subjects",
    topic: "Operating Systems",
    difficulty: "Medium",
    company: "Intel",
    type: "Subjective",
    description: "Explain what CPU scheduling tries to optimize.",
    correctAnswer: "CPU scheduling decides which ready process or thread gets CPU time, aiming to improve utilization, response time, waiting time, throughput, and fairness.",
    explanation: "A complete answer names the main scheduling goals, not just algorithm names.",
    tags: ["os", "scheduling"]
  },
  {
    title: "What happens when you type a URL in the browser?",
    category: "Core Subjects",
    topic: "Computer Networks",
    difficulty: "Medium",
    company: "Cisco",
    type: "Subjective",
    description: "Explain the high-level browser-to-server flow after a user enters a URL.",
    correctAnswer: "The browser resolves the domain using DNS, establishes a TCP and possibly TLS connection, sends an HTTP request, receives the response, and then renders the page resources.",
    explanation: "This is a classic systems question combining DNS, TCP, HTTP, and rendering basics.",
    tags: ["networks", "dns", "http"]
  },
  {
    title: "Abstraction vs Encapsulation",
    category: "Core Subjects",
    topic: "OOP",
    difficulty: "Easy",
    company: "Zoho",
    type: "Subjective",
    description: "Explain the difference between abstraction and encapsulation.",
    correctAnswer: "Abstraction focuses on showing only essential behavior and hiding complexity, while encapsulation bundles data and methods together and restricts direct access to internal state.",
    explanation: "A good answer clearly separates what is shown from how data is protected.",
    tags: ["oop", "principles"]
  },
  {
    title: "Java Collections Framework Overview",
    category: "Core Subjects",
    topic: "Java",
    difficulty: "Medium",
    company: "IBM",
    type: "Subjective",
    description: "Give a basic interview explanation of the Java Collections Framework.",
    correctAnswer: "The Java Collections Framework provides reusable data structures and algorithms through interfaces like List, Set, Queue, and Map and implementations such as ArrayList, HashSet, and HashMap.",
    explanation: "Interviewers expect the main interfaces, common implementations, and why the framework is useful.",
    tags: ["java", "collections"]
  },
  {
    title: "Python List Comprehension",
    category: "Core Subjects",
    topic: "Python",
    difficulty: "Easy",
    company: "Deloitte",
    type: "Subjective",
    description: "Explain what list comprehension is in Python and why it is useful.",
    correctAnswer: "List comprehension is a concise way to create lists by combining iteration and optional filtering in one readable expression.",
    explanation: "A strong answer mentions readability, concise syntax, and transformation or filtering use cases.",
    tags: ["python", "syntax"]
  },
  {
    title: "REST API Basics",
    category: "Core Subjects",
    topic: "Web Development Basics",
    difficulty: "Easy",
    company: "Postman",
    type: "Subjective",
    description: "Explain what a REST API is in simple interview-friendly language.",
    correctAnswer: "A REST API exposes resources over HTTP using standard methods like GET, POST, PUT, and DELETE so clients and servers can communicate in a structured, stateless way.",
    explanation: "The most important points are resources, HTTP methods, and stateless communication.",
    tags: ["rest", "api", "http"]
  }
];

const upscFieldQuestions = [
  {
    title: "Indian Constitution Preamble",
    field: "UPSC",
    category: "General Studies",
    topic: "Polity",
    difficulty: "Easy",
    company: "UPSC",
    type: "Subjective",
    description: "Explain the importance of the Preamble in the Indian Constitution.",
    correctAnswer: "The Preamble reflects the core values and goals of the Constitution such as justice, liberty, equality, and fraternity and acts as a guiding spirit for interpretation.",
    explanation: "A strong answer connects the Preamble with constitutional ideals and interpretive value.",
    tags: ["upsc", "polity", "constitution"]
  },
  {
    title: "Current Affairs Preparation Strategy",
    field: "UPSC",
    category: "Current Affairs",
    topic: "Current Affairs",
    difficulty: "Easy",
    company: "UPSC",
    type: "Subjective",
    description: "How should a UPSC aspirant prepare current affairs effectively?",
    correctAnswer: "Preparation should combine regular newspaper reading, issue-based notes, monthly revision, and linking events with syllabus topics.",
    explanation: "Judges often want process clarity rather than resource listing only.",
    tags: ["upsc", "current affairs", "strategy"]
  },
  {
    title: "Ethics in Public Service",
    field: "UPSC",
    category: "Essay & Ethics",
    topic: "Ethics",
    difficulty: "Medium",
    company: "UPSC",
    type: "Subjective",
    description: "Why is integrity important in public service?",
    correctAnswer: "Integrity builds public trust, improves fair decision-making, reduces corruption, and helps civil servants act in public interest.",
    explanation: "Tie ethics to governance quality and public trust.",
    tags: ["upsc", "ethics", "integrity"]
  },
  {
    title: "Why do you want to join civil services?",
    field: "UPSC",
    category: "Interview Personality",
    topic: "Personality Test",
    difficulty: "Easy",
    company: "UPSC",
    type: "Subjective",
    description: "Frame an honest and mature answer for the UPSC personality test.",
    correctAnswer: "The answer should focus on public service motivation, administrative responsibility, and long-term commitment rather than status or power.",
    explanation: "Panelists look for maturity, self-awareness, and service orientation.",
    tags: ["upsc", "interview", "motivation"]
  }
];

const ndaFieldQuestions = [
  {
    title: "Quadratic Equation Roots",
    field: "NDA",
    category: "Mathematics",
    topic: "Algebra",
    difficulty: "Easy",
    company: "NDA",
    type: "Subjective",
    description: "Explain how to find the roots of a quadratic equation.",
    correctAnswer: "Roots of ax^2 + bx + c = 0 can be found using factorization or the quadratic formula.",
    explanation: "Mention both the formula and the role of the discriminant.",
    tags: ["nda", "maths", "algebra"]
  },
  {
    title: "General Knowledge Strategy",
    field: "NDA",
    category: "General Ability",
    topic: "General Knowledge",
    difficulty: "Easy",
    company: "NDA",
    type: "Subjective",
    description: "How should a candidate prepare general knowledge for NDA?",
    correctAnswer: "Preparation should include daily current affairs, basic science, history, geography, polity, and defence-related awareness.",
    explanation: "A broad yet disciplined preparation approach matters here.",
    tags: ["nda", "general ability", "gk"]
  },
  {
    title: "Current Affairs for Defence Aspirants",
    field: "NDA",
    category: "Current Affairs",
    topic: "Current Affairs",
    difficulty: "Easy",
    company: "NDA",
    type: "Subjective",
    description: "What kind of current affairs should NDA aspirants prioritize?",
    correctAnswer: "They should prioritize national events, defence exercises, international relations, awards, science developments, and major initiatives.",
    explanation: "Focus on broad awareness with defence relevance.",
    tags: ["nda", "current affairs", "defence"]
  },
  {
    title: "Leadership in SSB Interview",
    field: "NDA",
    category: "SSB Interview",
    topic: "Leadership",
    difficulty: "Medium",
    company: "NDA",
    type: "Subjective",
    description: "What kind of leadership qualities does the SSB look for?",
    correctAnswer: "The SSB looks for initiative, responsibility, teamwork, confidence, communication, emotional balance, and sound decision making.",
    explanation: "Officer-like qualities must be practical and behavior-based.",
    tags: ["nda", "ssb", "leadership"]
  }
];

const bankingFieldQuestions = [
  {
    title: "Simplification in Banking Exams",
    field: "Banking",
    category: "Quantitative Aptitude",
    topic: "Arithmetic",
    difficulty: "Easy",
    company: "Banking",
    type: "Subjective",
    description: "Why is simplification important in banking aptitude sections?",
    correctAnswer: "Simplification questions improve speed, accuracy, and number handling for arithmetic and DI sections.",
    explanation: "Aptitude preparation is heavily speed-driven.",
    tags: ["banking", "quant", "arithmetic"]
  },
  {
    title: "Seating Arrangement Approach",
    field: "Banking",
    category: "Reasoning",
    topic: "Seating Arrangement",
    difficulty: "Medium",
    company: "Banking",
    type: "Subjective",
    description: "How should you solve seating arrangement problems in reasoning sections?",
    correctAnswer: "Identify the arrangement type, place fixed clues, track positive and negative conditions, and solve with a clean diagram.",
    explanation: "This checks structured reasoning rather than final answer only.",
    tags: ["banking", "reasoning", "arrangement"]
  },
  {
    title: "Reading Comprehension Strategy",
    field: "Banking",
    category: "English",
    topic: "Reading Comprehension",
    difficulty: "Medium",
    company: "Banking",
    type: "Subjective",
    description: "How can candidates improve reading comprehension performance in banking exams?",
    correctAnswer: "Practice identifying tone, central idea, inference, vocabulary, and fact-based details while managing time carefully.",
    explanation: "RC performance improves through structured reading habits.",
    tags: ["banking", "english", "rc"]
  },
  {
    title: "Functions of RBI",
    field: "Banking",
    category: "Banking Awareness",
    topic: "RBI",
    difficulty: "Easy",
    company: "Banking",
    type: "Subjective",
    description: "Explain the main functions of the Reserve Bank of India.",
    correctAnswer: "The RBI manages monetary policy, issues currency, regulates banks, maintains financial stability, and oversees payment systems.",
    explanation: "A concise list with regulatory context works well.",
    tags: ["banking", "rbi", "awareness"]
  }
];

const sscFieldQuestions = [
  {
    title: "Average Formula Usage",
    field: "SSC",
    category: "Quantitative Aptitude",
    topic: "Average",
    difficulty: "Easy",
    company: "SSC",
    type: "Subjective",
    description: "Explain the standard way to solve average problems quickly in SSC exams.",
    correctAnswer: "Use average = total / number of terms, convert statements into totals, and compare changes systematically.",
    explanation: "Speed and method clarity matter most here.",
    tags: ["ssc", "quant", "average"]
  },
  {
    title: "Coding-Decoding Logic",
    field: "SSC",
    category: "General Intelligence",
    topic: "Coding-Decoding",
    difficulty: "Easy",
    company: "SSC",
    type: "Subjective",
    description: "What mindset is useful for solving coding-decoding questions?",
    correctAnswer: "Look for consistent letter or number shifts, position patterns, reverse ordering, and hidden sequence rules.",
    explanation: "Pattern recognition is central here.",
    tags: ["ssc", "reasoning", "coding-decoding"]
  },
  {
    title: "Active and Passive Voice",
    field: "SSC",
    category: "English",
    topic: "Grammar",
    difficulty: "Medium",
    company: "SSC",
    type: "Subjective",
    description: "What should a student remember while converting active to passive voice?",
    correctAnswer: "Identify tense, move the object into subject position, use the appropriate form of be, and change the main verb to past participle.",
    explanation: "A process-based answer is ideal.",
    tags: ["ssc", "english", "voice"]
  },
  {
    title: "Static GK Preparation",
    field: "SSC",
    category: "General Awareness",
    topic: "Static GK",
    difficulty: "Easy",
    company: "SSC",
    type: "Subjective",
    description: "What should be included in static GK preparation for SSC?",
    correctAnswer: "Static GK should include geography basics, history, polity, institutions, national symbols, sports, awards, and books.",
    explanation: "A wide but revision-friendly strategy works best.",
    tags: ["ssc", "gk", "static"]
  }
];
const TARGET_VISIBLE_PER_CATEGORY = 1000;
const FIELD_CATEGORY_ORDER = {
  Software: ["DSA", "Aptitude", "HR", "Core Subjects"],
  UPSC: ["General Studies", "Current Affairs", "Essay & Ethics", "Interview Personality"],
  NDA: ["Mathematics", "General Ability", "Current Affairs", "SSB Interview"],
  Banking: ["Quantitative Aptitude", "Reasoning", "English", "Banking Awareness"],
  SSC: ["Quantitative Aptitude", "General Intelligence", "English", "General Awareness"]
};
const bulkCompanies = [
  "Amazon",
  "Microsoft",
  "Google",
  "Infosys",
  "TCS",
  "Accenture",
  "Wipro",
  "Cognizant",
  "Capgemini",
  "Deloitte",
  "Oracle",
  "IBM"
];
const fieldCompanyMap = {
  Software: bulkCompanies,
  UPSC: ["UPSC", "Civil Services", "Public Administration", "Policy Round"],
  NDA: ["NDA", "SSB Board", "Defence Service", "Officer Selection"],
  Banking: ["Banking", "IBPS", "SBI", "RBI"],
  SSC: ["SSC", "Government Exam", "Central Recruitment", "Competitive Round"]
};
const practiceAngles = [
  "Focus on the interview-ready explanation and mention one practical use case.",
  "Frame your answer the way you would explain it in a technical round.",
  "Add one edge case or limitation while answering this version.",
  "Practice giving a concise answer first and then expand if asked for more detail.",
  "Use this variation to revise the core formula, pattern, or decision-making steps.",
  "Answer this as if a judge asks for both concept clarity and one example."
];

const normalizeDifficulty = (question, variantIndex) => {
  const difficultyCycle = ["Easy", "Medium", "Medium", "Hard"];
  if (question.type === "Coding") {
    return difficultyCycle[variantIndex % difficultyCycle.length];
  }
  if (question.difficulty === "Hard") return "Hard";
  return difficultyCycle[(variantIndex + 1) % difficultyCycle.length];
};

const createPracticeVariant = (question, variantIndex, categoryIndex) => {
  const angle = practiceAngles[(variantIndex + categoryIndex) % practiceAngles.length];
  const companyPool = fieldCompanyMap[question.field || "Software"] || bulkCompanies;
  const company = companyPool[(variantIndex + categoryIndex) % companyPool.length];
  const variantLabel = variantIndex + 1;

  return {
    ...question,
    title: `${question.title} Practice Variant ${variantLabel}`,
    company,
    difficulty: normalizeDifficulty(question, variantIndex),
    description: `${question.description} Practice focus ${variantLabel}: ${angle}`,
    explanation: `${question.explanation} Practice note: ${angle}`,
    tags: [...new Set([...(question.tags || []), "practice-variant", `set-${variantLabel}`])]
  };
};

const buildLargeQuestionBank = (questions) => {
  const expanded = [...questions];

  Object.entries(FIELD_CATEGORY_ORDER).forEach(([field, categories]) => {
    categories.forEach((category, categoryIndex) => {
      const visibleBase = questions.filter(
        (question) => question.field === field && question.category === category && question.type !== "MCQ"
      );
      const sourcePool = visibleBase.length
        ? visibleBase
        : questions.filter((question) => question.field === field && question.category === category);

      if (!sourcePool.length) return;

      let visibleCount = questions.filter(
        (question) => question.field === field && question.category === category && question.type !== "MCQ"
      ).length;
      let variantIndex = 0;

      while (visibleCount < TARGET_VISIBLE_PER_CATEGORY) {
        const source = sourcePool[variantIndex % sourcePool.length];
        const clone = createPracticeVariant(source, variantIndex, categoryIndex);
        expanded.push(clone);
        if (clone.type !== "MCQ") visibleCount += 1;
        variantIndex += 1;
      }
    });
  });

  return expanded;
};

const softwareFieldQuestions = baseSeedQuestions.map((question) => ({
  ...question,
  field: "Software"
}));

const allBaseQuestions = [
  ...softwareFieldQuestions,
  ...upscFieldQuestions,
  ...ndaFieldQuestions,
  ...bankingFieldQuestions,
  ...sscFieldQuestions
];

const seedQuestions = buildLargeQuestionBank(allBaseQuestions);

export default seedQuestions;





