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
  const normalizedBase = softwareBaseQuestions.map((question) => ({
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

