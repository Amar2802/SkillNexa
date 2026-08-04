const roadmaps = [
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description: "Master problem solving, algorithms, and key data structures from arrays to dynamic programming.",
    estimatedTime: "80 Hours",
    difficulty: "Hard",
    relatedTopics: ["Coding Practice", "System Design"],
    topics: [
      {
        name: "Arrays & Sorting",
        level: "Beginner",
        cheatSheet: "Arrays are contiguous memory blocks. Operations: Access O(1), Search O(n) (or O(log n) if sorted), Insertion/Deletion O(n). Popular algorithms include QuickSort, MergeSort, and Binary Search.",
        revision: [
          { question: "What is Kadane's algorithm used for?", answer: "Finding the maximum sum contiguous subarray in O(n) time." },
          { question: "What is the time complexity of Merge Sort?", answer: "O(n log n) in all cases (best, average, worst) due to divide-and-conquer." }
        ],
        mcqs: [
          {
            question: "Which sorting algorithm is stable and has O(n log n) worst-case time complexity?",
            options: ["Quick Sort", "Merge Sort", "Bubble Sort", "Selection Sort"],
            correctAnswer: "Merge Sort",
            explanation: "Merge Sort is stable and guarantees O(n log n) time, unlike Quick Sort which can degrade to O(n^2)."
          }
        ],
        questions: ["Two Sum", "Best Time to Buy and Sell Stock", "Rotate Array", "Merge Intervals"]
      },
      {
        name: "Strings & Palindromes",
        level: "Beginner",
        cheatSheet: "Strings are sequences of characters. In many languages, they are immutable. Two-pointer technique and sliding window are frequently used to solve string matching and palindrome problems.",
        revision: [
          { question: "How does the KMP algorithm optimize pattern matching?", answer: "It uses a prefix table (LPS) to avoid backtracking, achieving O(n + m) time." }
        ],
        mcqs: [
          {
            question: "What is the space complexity of storing a frequency map for an ASCII string of length N?",
            options: ["O(N)", "O(1)", "O(log N)", "O(N^2)"],
            correctAnswer: "O(1)",
            explanation: "Since ASCII has a fixed size of 128 or 256 characters, the map size is bounded by a constant."
          }
        ],
        questions: ["Valid Anagram", "Longest Substring Without Repeating Characters", "Minimum Window Substring", "Reverse Words"]
      },
      {
        name: "Linked Lists & Pointers",
        level: "Intermediate",
        cheatSheet: "Linked lists consist of nodes with data and next pointers. Access is O(n), but insertion/deletion is O(1) if pointer is known. Key pattern: Fast and Slow pointers (Tortoise and Hare) for cycle detection.",
        revision: [
          { question: "How do you detect a cycle in a linked list?", answer: "Use Floyd's Cycle Detection (Fast & Slow pointers). If they meet, a cycle exists." }
        ],
        mcqs: [
          {
            question: "Which pointer setup is ideal for finding the middle node of a Linked List in one pass?",
            options: ["Two pointers starting at opposite ends", "One pointer moving double the speed of another", "Three pointers", "Recursion only"],
            correctAnswer: "One pointer moving double the speed of another",
            explanation: "When the fast pointer reaches the end, the slow pointer (moving at half speed) will be exactly at the middle."
          }
        ],
        questions: ["Reverse Linked List", "Merge Two Sorted Lists", "Linked List Cycle", "Remove Nth Node From End"]
      },
      {
        name: "Stacks & Queues",
        level: "Intermediate",
        cheatSheet: "Stacks follow LIFO (Last In First Out); Queues follow FIFO (First In First Out). Circular Queue uses arrays with head/tail pointers wrapping around. Stacks are used in matching brackets, history tracking, and Monotonic Stacks.",
        revision: [
          { question: "What is a Monotonic Stack?", answer: "A stack that maintains elements in sorted order (increasing/decreasing) to find next greater/smaller elements in O(n)." }
        ],
        mcqs: [
          {
            question: "Which data structure is best suited for implementing Breadth-First Search (BFS)?",
            options: ["Stack", "Queue", "Min-Heap", "Binary Tree"],
            correctAnswer: "Queue",
            explanation: "BFS explores nodes level-by-level, requiring a FIFO Queue to track visited order."
          }
        ],
        questions: ["Valid Parentheses", "Min Stack", "Next Greater Element", "Sliding Window Maximum"]
      },
      {
        name: "Trees & Graphs",
        level: "Advanced",
        cheatSheet: "Trees are hierarchical graphs without cycles. Traversal: DFS (Inorder, Preorder, Postorder) and BFS (Level Order). Graphs represent network nodes. Traversal: DFS/BFS. Shortest paths: Dijkstra (positive weights), Bellman-Ford (allows negative weights). Cycles: Topological sort (for DAGs), Union-Find.",
        revision: [
          { question: "What is Topological Sort used for?", answer: "To order tasks with dependency constraints (only works on DAGs)." },
          { question: "What is the time complexity of Dijkstra's algorithm using a Min-Heap?", answer: "O((V + E) log V)." }
        ],
        mcqs: [
          {
            question: "Which graph algorithm is used to detect negative weight cycles?",
            options: ["Dijkstra", "Kruskal", "Bellman-Ford", "Prim"],
            correctAnswer: "Bellman-Ford",
            explanation: "Bellman-Ford can run V-1 relaxations and detect cycles if a further relaxation reduces distance."
          }
        ],
        questions: ["Maximum Depth of Binary Tree", "Lowest Common Ancestor", "Invert Binary Tree", "Dijkstra Shortest Path"]
      },
      {
        name: "Recursion & Backtracking",
        level: "Advanced",
        cheatSheet: "Recursion solves a problem by solving smaller subproblems. Backtracking is a systematic search that builds candidates and abandons a path ('backtracks') as soon as it determines it cannot yield a valid solution (e.g. Sudoku, N-Queens).",
        revision: [
          { question: "What is the typical time complexity of generating all permutations?", answer: "O(n * n!) due to n! permutations of length n." }
        ],
        mcqs: [
          {
            question: "What is the primary risk of deep recursion without tail call optimization?",
            options: ["Memory Leak", "Stack Overflow", "Infinite Loop", "Null Pointer Reference"],
            correctAnswer: "Stack Overflow",
            explanation: "Each recursive call consumes a stack frame, which can exceed the call stack size limit."
          }
        ],
        questions: ["Subsets", "Permutations", "Combination Sum", "N-Queens"]
      },
      {
        name: "Dynamic Programming",
        level: "Advanced",
        cheatSheet: "DP solves problems by combining solutions to overlapping subproblems. Key steps: 1. Define state. 2. Establish transition relation. 3. Memoize (Top-down) or Tabulate (Bottom-up). Common problems: Fibonacci, Knapsack, LIS, LCS, Coin Change.",
        revision: [
          { question: "What is the difference between Memoization and Tabulation?", answer: "Memoization is top-down (recursive with caching); Tabulation is bottom-up (iterative array filling)." }
        ],
        mcqs: [
          {
            question: "What is the time complexity of the classic 0/1 Knapsack DP solution?",
            options: ["O(2^N)", "O(N * W)", "O(N log N)", "O(W^2)"],
            correctAnswer: "O(N * W)",
            explanation: "The DP table size is N (items) times W (capacity), leading to O(N*W) computations."
          }
        ],
        questions: ["House Robber", "Longest Increasing Subsequence", "Longest Common Subsequence", "Coin Change"]
      }
    ]
  },
  {
    id: "core_cs",
    title: "Core Computer Science",
    description: "Deep dive into Operating Systems, Database Management Systems, Computer Networks, and Object-Oriented Programming.",
    estimatedTime: "50 Hours",
    difficulty: "Medium",
    relatedTopics: ["SQL", "System Design"],
    topics: [
      {
        name: "Operating Systems",
        level: "Beginner",
        cheatSheet: "OS manages resources. Core concepts: Processes (isolated memory) vs Threads (shared memory). Deadlock conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait. Virtual Memory uses paging to expand physical RAM.",
        revision: [
          { question: "What is context switching?", answer: "Storing the state of a process/thread so it can be resumed later, allowing multitasking." },
          { question: "Explain Mutex vs Semaphore.", answer: "Mutex is locking mechanism (1 owner); Semaphore is signaling mechanism (allows N resources)." }
        ],
        mcqs: [
          {
            question: "Which of the following is NOT a necessary condition for Deadlock?",
            options: ["Mutual Exclusion", "No Preemption", "Circular Wait", "Preemptive Scheduling"],
            correctAnswer: "Preemptive Scheduling",
            explanation: "The four deadlock conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait."
          }
        ],
        questions: ["Explain Paging and Virtual Memory", "Describe scheduling algorithms like Round Robin"]
      },
      {
        name: "DBMS & Transactions",
        level: "Intermediate",
        cheatSheet: "Normalization reduces redundancy (1NF, 2NF, 3NF, BCNF). Indexes speed up reads (B-Trees) but slow down writes. ACID: Atomicity, Consistency, Isolation, Durability. Joins: Inner, Left, Right, Outer.",
        revision: [
          { question: "What does Isolation mean in ACID?", answer: "Transactions execute concurrently without interfering with each other." }
        ],
        mcqs: [
          {
            question: "Which index type is default in most relational databases for primary keys?",
            options: ["Hash Index", "B-Tree Index", "GiST Index", "Bitmap Index"],
            correctAnswer: "B-Tree Index",
            explanation: "B-Trees allow sorted range queries and O(log n) lookups, making them ideal for primary keys."
          }
        ],
        questions: ["Explain ACID Properties", "Difference between Clustered and Non-Clustered Indexes"]
      },
      {
        name: "Computer Networks & Security",
        level: "Intermediate",
        cheatSheet: "TCP (connection-oriented, reliable, handshakes) vs UDP (connectionless, fast, streaming). HTTP (stateless, text) vs HTTPS (secured with SSL/TLS). Authentication: JWT (stateless token), Sessions (state stored on server, cookie references).",
        revision: [
          { question: "What is the three-way handshake in TCP?", answer: "SYN, SYN-ACK, ACK. Establishes a reliable connection." }
        ],
        mcqs: [
          {
            question: "Which port is standard for HTTPS traffic?",
            options: ["80", "443", "8080", "22"],
            correctAnswer: "443",
            explanation: "Port 80 is for HTTP, while port 443 is standard for secured HTTPS traffic."
          }
        ],
        questions: ["Explain DNS resolution process", "What happens when you type a URL in a browser?"]
      },
      {
        name: "Object-Oriented Programming (OOP)",
        level: "Beginner",
        cheatSheet: "Four pillars: 1. Inheritance (reusability). 2. Polymorphism (overloading/overriding). 3. Abstraction (interface vs implementation). 4. Encapsulation (data hiding, accessors). SOLID: Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.",
        revision: [
          { question: "What is Liskov Substitution Principle?", answer: "Subtypes must be substitutable for their base types without altering program correctness." }
        ],
        mcqs: [
          {
            question: "Which OOP concept is demonstrated when a subclass provides a specific implementation of a method declared in its parent class?",
            options: ["Method Overloading", "Method Overriding", "Encapsulation", "Multiple Inheritance"],
            correctAnswer: "Method Overriding",
            explanation: "Overriding is runtime polymorphism where a child class replaces a parent class method."
          }
        ],
        questions: ["Explain SOLID Principles with examples", "Abstract Class vs Interface"]
      }
    ]
  },
  {
    id: "js",
    title: "JavaScript",
    description: "Master modern Javascript from scoping and event loop to advanced functional techniques like throttling and memoization.",
    estimatedTime: "30 Hours",
    difficulty: "Medium",
    relatedTopics: ["React", "Node + Express"],
    topics: [
      {
        name: "JavaScript Basics & Scopes",
        level: "Beginner",
        cheatSheet: "Variables: var (function scope, hoisted), let/const (block scope, temporal dead zone). Hoisting: declarations are moved to the top of their scope. Closures: a function retains access to its lexical scope even when executed outside it.",
        revision: [
          { question: "What is Closure?", answer: "A function that has access to its outer function's scope variables even after the outer function has returned." }
        ],
        mcqs: [
          {
            question: "What is output of: console.log(typeof null)?",
            options: ["'null'", "'undefined'", "'object'", "'string'"],
            correctAnswer: "'object'",
            explanation: "This is a historical bug in JavaScript where null represents an empty object pointer."
          }
        ],
        questions: ["Explain the Temporal Dead Zone", "Implement a basic counter using closures"]
      },
      {
        name: "Asynchronous JavaScript",
        level: "Intermediate",
        cheatSheet: "Promises represent a future value (Pending, Fulfilled, Rejected). Async/Await is syntactic sugar over Promises. Event Loop: Call Stack, Web APIs, Callback Queue, Microtask Queue (Promises have priority).",
        revision: [
          { question: "What is the difference between Callback Queue and Microtask Queue?", answer: "Microtasks (Promises, process.nextTick) are executed completely before the next event loop tick, whereas Callback Queue tasks run one-by-one." }
        ],
        mcqs: [
          {
            question: "Which of the following executes first in the event loop?",
            options: ["setTimeout callback", "Promise callback (Microtask)", "setInterval callback", "setImmediate callback"],
            correctAnswer: "Promise callback (Microtask)",
            explanation: "Microtask queue is processed immediately after the current call stack clears, before rendering and macro tasks."
          }
        ],
        questions: ["Explain the Event Loop in detail", "Implement Promise.all from scratch"]
      },
      {
        name: "Advanced Patterns & Functions",
        level: "Advanced",
        cheatSheet: "Context binds: call (args listed), apply (args array), bind (returns new function bound with 'this'). Optimization: Debouncing (delay execution until idle), Throttling (limit execution to once per tick), Memoization (caching results). Prototype: objects inherit properties through prototypical chain.",
        revision: [
          { question: "What is the difference between debouncing and throttling?", answer: "Debouncing triggers after a delay of inactivity; throttling triggers at regular intervals during activity." }
        ],
        mcqs: [
          {
            question: "How does the 'this' keyword behave in arrow functions?",
            options: ["It refers to the object calling the function", "It is dynamically bound at runtime", "It lexically inherits 'this' from the enclosing context", "It is always undefined"],
            correctAnswer: "It lexically inherits 'this' from the enclosing context",
            explanation: "Arrow functions do not define their own 'this' binding. They capture the 'this' value of the surrounding scope."
          }
        ],
        questions: ["Write a debounce function", "Write a throttle function", "Explain prototypal inheritance"]
      }
    ]
  },
  {
    id: "react",
    title: "React",
    description: "Learn functional components, state management, hook optimizations, context API, and advanced rendering mechanics.",
    estimatedTime: "35 Hours",
    difficulty: "Medium",
    relatedTopics: ["JavaScript", "Node + Express"],
    topics: [
      {
        name: "React Fundamentals & Hooks",
        level: "Beginner",
        cheatSheet: "Components return JSX. State (`useState`) triggers re-render on changes; Props pass data down. Hooks rules: only call at top level, only in React functions. `useEffect` performs side-effects (runs after render; cleanup triggers before next run).",
        revision: [
          { question: "What does the dependency array in useEffect do?", answer: "Triggers the effect callback only if any of the dependencies change between renders." }
        ],
        mcqs: [
          {
            question: "What is the Virtual DOM in React?",
            options: ["A direct copy of the browser's DOM", "An in-memory representation of the UI synced with the real DOM via reconciliation", "A framework configuration", "A database of components"],
            correctAnswer: "An in-memory representation of the UI synced with the real DOM via reconciliation",
            explanation: "React maintains a virtual DOM tree and uses a diffing algorithm to batch changes to the real DOM."
          }
        ],
        questions: ["Explain React Reconciliation", "Build a custom hook useLocalStorage"]
      },
      {
        name: "Performance & Optimization",
        level: "Advanced",
        cheatSheet: "Avoid re-renders: `useMemo` caches computed values, `useCallback` caches function definitions. `React.memo` prevents component re-rendering if props are unchanged. Code splitting: `lazy` and `Suspense` load bundles on demand.",
        revision: [
          { question: "When should you NOT use useMemo?", answer: "For cheap computations, as the overhead of dependency checking and cache lookup can exceed the savings." }
        ],
        mcqs: [
          {
            question: "Which hook should be used to store a mutable value that does NOT trigger a re-render when updated?",
            options: ["useState", "useMemo", "useRef", "useReducer"],
            correctAnswer: "useRef",
            explanation: "Updating useRef.current changes the value without notifying React or causing a component re-render."
          }
        ],
        questions: ["Compare useMemo and useCallback", "Optimize a heavy rendering list in React"]
      }
    ]
  },
  {
    id: "node_express",
    title: "Node + Express",
    description: "Build scalable REST APIs, structure middleware pipelines, configure authentication, and implement error and security controls.",
    estimatedTime: "40 Hours",
    difficulty: "Medium",
    relatedTopics: ["MongoDB", "JavaScript"],
    topics: [
      {
        name: "APIs & Middleware",
        level: "Beginner",
        cheatSheet: "Node.js runs JS on the server. Express is a minimalist framework. Middleware are functions with access to `req`, `res`, and `next` in the request-response cycle. MVC pattern: Models (data), Views (UI/JSON response), Controllers (routing handler logic).",
        revision: [
          { question: "What is the purpose of next() in Express middleware?", answer: "It passes control to the next middleware function in the stack." }
        ],
        mcqs: [
          {
            question: "Which HTTP status code represents a Bad Request validation error?",
            options: ["400", "401", "403", "500"],
            correctAnswer: "400",
            explanation: "400 Bad Request indicates that the server cannot process the request due to client error (e.g. bad syntax, invalid payload)."
          }
        ],
        questions: ["Explain Express Middleware architecture", "Write a custom request logging middleware"]
      },
      {
        name: "Security & Authentication",
        level: "Advanced",
        cheatSheet: "Secure API: JWT headers for stateless auth, Cookies (HttpOnly, Secure) for CSRF/session security. Security headers: Helmet. CORS prevents cross-origin unauthorized resource requests. Rate limiting protects against DDoS/brute force.",
        revision: [
          { question: "Why should refresh tokens be stored in HttpOnly cookies?", answer: "To prevent cross-site scripting (XSS) attacks from reading the token from JS memory." }
        ],
        mcqs: [
          {
            question: "What does CORS stand for?",
            options: ["Cross-Origin Resource Sharing", "Centralized Origin Resource Security", "Common Origin Registry System", "Cookie Origin Restriction Standard"],
            correctAnswer: "Cross-Origin Resource Sharing",
            explanation: "CORS is a browser mechanism that tells the browser whether to allow a web page to make requests to another origin."
          }
        ],
        questions: ["Describe JWT authentication flow", "Implement rate limiting in Express"]
      }
    ]
  },
  {
    id: "mongodb",
    title: "MongoDB",
    description: "Learn schema designs, relations, indexes, aggregation frameworks, and transaction management in NoSQL.",
    estimatedTime: "25 Hours",
    difficulty: "Medium",
    relatedTopics: ["Node + Express"],
    topics: [
      {
        name: "NoSQL & Schemas",
        level: "Beginner",
        cheatSheet: "MongoDB is document-oriented (BSON). Relational joins are achieved via `populate()` (ref) or denormalization (embedding). Aggregation pipeline: `$match`, `$group`, `$sort`, `$project`, `$unwind` processes collection data efficiently.",
        revision: [
          { question: "When should you embed vs reference data?", answer: "Embed for one-to-few relations and data that changes together; reference for one-to-many, unbound growth, or shared entities." }
        ],
        mcqs: [
          {
            question: "Which aggregation stage is used to deconstruct an array field from the input documents to output a document for each element?",
            options: ["$group", "$project", "$unwind", "$match"],
            correctAnswer: "$unwind",
            explanation: "$unwind splits an array of elements into separate documents, replicating the non-array parent data."
          }
        ],
        questions: ["Explain embedding vs referencing", "Build an aggregation query to average scores grouped by user"]
      }
    ]
  },
  {
    id: "git",
    title: "Git & GitHub",
    description: "Master version control workflows: merge, rebase, cherry-pick, stash, and resolving conflicts.",
    estimatedTime: "10 Hours",
    difficulty: "Easy",
    relatedTopics: ["Project Interview"],
    topics: [
      {
        name: "Version Control Workflows",
        level: "Beginner",
        cheatSheet: "Git tracks code changes. Commit: save snapshot. Push: upload to remote. Pull: download & merge remote. Branching: isolated environments. Merge: combine branches (adds merge commit). Rebase: move branch commits on top of another branch (cleans history).",
        revision: [
          { question: "What is Git Stash?", answer: "Temporarily saves uncommitted changes to a dirty workspace so you can switch branches without committing." },
          { question: "What is a merge conflict and how is it resolved?", answer: "Occurs when changes are made to the same line in two branches; solved by opening the file, selecting the preferred edits, and committing." }
        ],
        mcqs: [
          {
            question: "Which command applies specific commits from another branch without merging the whole branch?",
            options: ["git merge", "git cherry-pick", "git rebase", "git checkout"],
            correctAnswer: "git cherry-pick",
            explanation: "Cherry-pick selects a specific commit hash from any branch and applies it as a new commit on the current branch."
          }
        ],
        questions: ["Explain Git Rebase vs Git Merge", "How do you handle a merge conflict?"]
      }
    ]
  },
  {
    id: "system_design",
    title: "System Design",
    description: "Learn horizontal scaling, load balancers, caching, CDNs, and designs for chat apps, URL shorteners, etc.",
    estimatedTime: "45 Hours",
    difficulty: "Hard",
    relatedTopics: ["Core CS"],
    topics: [
      {
        name: "System Design Basics",
        level: "Intermediate",
        cheatSheet: "Scaling: Vertical (larger VM) vs Horizontal (more VMs). Load Balancer distributes traffic. Cache (Redis) speeds up hot-data reads. CDN caches static files near users. Rate Limiting protects backend routes.",
        revision: [
          { question: "What is horizontal scaling?", answer: "Adding more machine nodes to a system's resource pool to distribute workload." }
        ],
        mcqs: [
          {
            question: "Which component is best suited for distributing client requests across multiple servers?",
            options: ["Database", "Cache", "Load Balancer", "Reverse Proxy only"],
            correctAnswer: "Load Balancer",
            explanation: "Load Balancers share resource loads across server clusters to maintain high availability and prevent performance bottlenecks."
          }
        ],
        questions: ["Design a URL Shortener", "Explain cache invalidation strategies"]
      }
    ]
  },
  {
    id: "project_interview",
    title: "Project Interview",
    description: "Learn to explain your projects, database schemas, scaling choices, and technical trade-offs to interviewers.",
    estimatedTime: "20 Hours",
    difficulty: "Medium",
    relatedTopics: ["Resume Preparation", "Communication"],
    topics: [
      {
        name: "Explaining Project Architecture",
        level: "Intermediate",
        cheatSheet: "Structure explanations using STAR (Situation, Task, Action, Result). State: 1. Tech stack. 2. Scaling challenge or bottleneck. 3. System design flowchart (Frontend -> API Gateway -> Auth Service -> Microservices -> DBs). 4. Key metrics (e.g. reduced load times by 40%).",
        revision: [
          { question: "How do you handle a question about your project's scaling failures?", answer: "Explain the bottleneck honestly, the telemetry used to find it, the solution (e.g. index/cache), and the quantifiable result." }
        ],
        mcqs: [
          {
            question: "What is the recommended framework for structuring project discussion answers?",
            options: ["REST", "STAR", "MVC", "ACID"],
            correctAnswer: "STAR",
            explanation: "STAR (Situation, Task, Action, Result) is the gold standard for behavioral and technical storytelling."
          }
        ],
        questions: ["Walk through your most complex project schema", "How did you optimize slow query bottlenecks in your project?"]
      }
    ]
  },
  {
    id: "sql",
    title: "SQL",
    description: "Write clean SQL queries: joins, aggregations, window functions, and subqueries.",
    estimatedTime: "20 Hours",
    difficulty: "Medium",
    relatedTopics: ["Core CS", "MongoDB"],
    topics: [
      {
        name: "Relational Queries & Aggregations",
        level: "Beginner",
        cheatSheet: "Joins: INNER, LEFT (all matching + left rows), RIGHT, FULL. GROUP BY aggregates data (needs aggregates like COUNT, SUM, AVG). HAVING filters aggregated records (unlike WHERE which runs before aggregation).",
        revision: [
          { question: "What is the difference between WHERE and HAVING?", answer: "WHERE filters rows before groups are formed; HAVING filters groups after GROUP BY is processed." }
        ],
        mcqs: [
          {
            question: "Which JOIN returns all rows from the left table and matching rows from the right table?",
            options: ["INNER JOIN", "RIGHT JOIN", "LEFT JOIN", "CROSS JOIN"],
            correctAnswer: "LEFT JOIN",
            explanation: "LEFT JOIN (or LEFT OUTER JOIN) returns all records from the left table, and matching records from the right."
          }
        ],
        questions: ["Write a query to find duplicates in a table", "Explain Window Functions (ROW_NUMBER, DENSE_RANK)"]
      }
    ]
  },
  {
    id: "aptitude",
    title: "Aptitude & Puzzles",
    description: "Solve quantitative problems, probability, logical puzzles, and work-time calculations.",
    estimatedTime: "25 Hours",
    difficulty: "Easy",
    relatedTopics: ["Core CS"],
    topics: [
      {
        name: "Quantitative Aptitude",
        level: "Beginner",
        cheatSheet: "Formulas: Percentage = (change/base)*100. Probability = desired_outcomes/total_outcomes. Time & Work: work done = rate * time; if A takes X days and B takes Y days, together they take (X*Y)/(X+Y) days.",
        revision: [
          { question: "If A completes a job in 10 days and B in 15 days, how long do they take together?", answer: "(10 * 15) / (10 + 15) = 150 / 25 = 6 days." }
        ],
        mcqs: [
          {
            question: "What is the probability of rolling a sum of 7 with two six-sided dice?",
            options: ["1/6", "1/12", "5/36", "7/36"],
            correctAnswer: "1/6",
            explanation: "There are 6 winning pairs (1+6, 2+5, 3+4, 4+3, 5+2, 6+1) out of 36 outcomes, so 6/36 = 1/6."
          }
        ],
        questions: ["Work, Time, and Distance word problems", "Classic logical puzzle: Bridge crossing at night"]
      }
    ]
  },
  {
    id: "hr_interview",
    title: "HR & Behavioral Interview",
    description: "Master non-technical rounds, behavioral answers (STAR), values, and company-specific fit.",
    estimatedTime: "15 Hours",
    difficulty: "Easy",
    relatedTopics: ["Communication", "Project Interview"],
    topics: [
      {
        name: "Behavioral Bank",
        level: "Beginner",
        cheatSheet: "Core questions: 'Tell me about yourself', 'Strengths & Weaknesses', 'Describe a conflict with a teammate', 'Why do you want to join us?'. Always keep answers structured, positive, and focused on growth.",
        revision: [
          { question: "How do you explain a weakness in an HR interview?", answer: "State a genuine but non-critical skill gap, explain how you recognized it, and show the active steps you are taking to overcome it." }
        ],
        mcqs: [
          {
            question: "What is the most critical element to highlight at the end of a conflict resolution answer?",
            options: ["Who was at fault", "How the conflict arose", "The learning takeaway and how it benefited the team", "That you didn't back down"],
            correctAnswer: "The learning takeaway and how it benefited the team",
            explanation: "HR interviewers look for collaborative maturity, active listening, and constructive team results."
          }
        ],
        questions: ["Answer: Tell me about a time you failed.", "Answer: Why should we hire you?"]
      }
    ]
  },
  {
    id: "resume_prep",
    title: "Resume Preparation",
    description: "Optimize your resume for ATS scanners, prepare checklist, and structure project details.",
    estimatedTime: "10 Hours",
    difficulty: "Easy",
    relatedTopics: ["Project Interview", "HR Interview"],
    topics: [
      {
        name: "ATS Checklists",
        level: "Beginner",
        cheatSheet: "ATS (Applicant Tracking System) rules: 1. Use single-column layouts. 2. Avoid tables, icons, and text boxes. 3. Include keywords from the job description. 4. Use action verbs (Designed, Created, Optimized). 5. Quantify results (X%, $Y savings).",
        revision: [
          { question: "What is the best file format to submit a resume for ATS compliance?", answer: "PDF, unless the portal explicitly requests a Word document (.docx)." }
        ],
        mcqs: [
          {
            question: "Which of the following is an ATS-friendly formatting choice?",
            options: ["Adding tables to align columns", "Using images for technical badges", "Simple chronological text formatting", "Using multi-column sidebars"],
            correctAnswer: "Simple chronological text formatting",
            explanation: "ATS readers parse text linearly. Sidebars and tables often cause parsing failures or jumbled text."
          }
        ],
        questions: ["ATS resume compliance checklist review", "Quantify bullet points: Formula (Accomplished [X] as measured by [Y], by doing [Z])"]
      }
    ]
  },
  {
    id: "coding_practice",
    title: "Coding Practice",
    description: "Curated 150-250 question bank across Easy, Medium, and Hard tiers with AI evaluation.",
    estimatedTime: "60 Hours",
    difficulty: "Hard",
    relatedTopics: ["DSA"],
    topics: [
      {
        name: "Problem Lists",
        level: "Intermediate",
        cheatSheet: "Practice sorted patterns. Dedicate 40% time to Easy, 50% to Medium, and 10% to Hard. Maintain consistency: write clean code, dry run with test cases, and explain space-time complexity.",
        revision: [
          { question: "What is the best way to handle getting stuck on a coding question?", answer: "Spend max 45 mins trying to solve. If stuck, look at the hints first. If still stuck, view the solution, understand the pattern, and write it down." }
        ],
        mcqs: [
          {
            question: "What is the worst-case space complexity of a recursively called depth-first search (DFS) on a binary tree?",
            options: ["O(1)", "O(log N)", "O(H) where H is the height of the tree", "O(N^2)"],
            correctAnswer: "O(H) where H is the height of the tree",
            explanation: "The recursion stack grows up to the maximum depth of the tree (height H), which is O(N) in a skewed tree, or O(log N) in a balanced tree."
          }
        ],
        questions: ["Solve: Longest Palindromic Substring", "Solve: Course Schedule (Graph DFS Cycle Detection)"]
      }
    ]
  },
  {
    id: "comm",
    title: "Communication",
    description: "Learn to think out loud, explain complexity, trade-offs, and ask clarifying questions.",
    estimatedTime: "15 Hours",
    difficulty: "Easy",
    relatedTopics: ["HR Interview", "Project Interview"],
    topics: [
      {
        name: "Thinking Out Loud",
        level: "Beginner",
        cheatSheet: "Interview communication checklist: 1. Do not start coding immediately; state your understanding of the question. 2. Ask clarifying questions (input ranges, edge cases, null inputs). 3. Walk through a brute-force approach first. 4. Propose improvements before rewriting. 5. Discuss time-space trade-offs clearly.",
        revision: [
          { question: "Why is it important to explain brute-force first?", answer: "It establishes a baseline, proves you understand the problem, and gives you a fallback solution in case you cannot find the optimized code." }
        ],
        mcqs: [
          {
            question: "When presented with an ambiguous question, what is the best first step?",
            options: ["Start writing code immediately", "Propose the most complex solution", "Ask clarifying questions about input bounds and assumptions", "Guess the constraints"],
            correctAnswer: "Ask clarifying questions about input bounds and assumptions",
            explanation: "Clarifying parameters shows structured engineering communication and avoids wasting time coding the wrong solution."
          }
        ],
        questions: ["Practice: Walk through code complexity explanations", "Communication exercise: Proposing a trade-off between memory and speed"]
      }
    ]
  }
];

export default roadmaps;
