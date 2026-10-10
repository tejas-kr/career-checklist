# This checklist is versioned with the application. Progress is persisted per user in SQLite.
WEEKS = [
    {
        "week": 1, "title": "Establish your baseline", "focus": "Understand where you are starting",
        "tasks": [
            ("dsa-baseline", "Solve two easy array/hash-map problems without AI.", "Write down your approach and time complexity."),
            ("binary-search", "Attempt one easy binary-search problem.", "Pay attention to boundary conditions."),
            ("medium-attempt", "Attempt one medium problem for 30–45 minutes before viewing hints.", "Record where your reasoning got stuck."),
            ("architecture-sketch", "Draw the architecture of one backend service you know.", "Include request flow, database, queues, failures and retries."),
            ("work-improvement", "Identify one improvement you could own at work.", "Choose a measurable reliability, performance or testing outcome."),
            ("job-description", "Review one target job description.", "Note its level, coding expectations and system-design requirements."),
        ],
    },
    {
        "week": 2, "title": "Arrays and hash maps", "focus": "Build a reliable problem-solving process",
        "tasks": [
            ("arrays-strings", "Practise arrays and strings.", "Explain the brute-force solution before optimizing."),
            ("hash-maps", "Solve hash-map and set problems.", "Recognize when lookup speed changes the solution."),
            ("complexity", "Analyse time and space complexity for each solution.", "State complexity without guessing."),
            ("api-basics", "Review HTTP methods, status codes and API contracts.", "Design a small CRUD API."),
            ("mistake-log", "Start a mistake log.", "Record the trigger, missed insight and corrected approach."),
        ],
    },
    {
        "week": 3, "title": "Two pointers and sliding windows", "focus": "Recognize common patterns",
        "tasks": [
            ("two-pointers", "Solve two two-pointer problems.", "Explain the invariant you maintain."),
            ("sliding-window", "Solve two sliding-window problems.", "Identify when and why the window moves."),
            ("sql-indexes", "Review SQL indexes and query plans.", "Explain the trade-off between reads and writes."),
            ("project-story-1", "Write one project deep-dive outline.", "Cover context, your ownership, decisions and impact."),
        ],
    },
    {
        "week": 4, "title": "Stacks, queues and binary search", "focus": "Finish the first foundation block",
        "tasks": [
            ("stacks-queues", "Solve stack and queue problems.", "Include one monotonic-stack example if ready."),
            ("binary-search-patterns", "Practise binary search on sorted data and answer spaces.", "Be precise about loop conditions."),
            ("db-transactions", "Review transactions and isolation basics.", "Explain a lost-update or race scenario."),
            ("month-review", "Review your first month of mistakes.", "Choose the two patterns that need another pass."),
        ],
    },
    {
        "week": 5, "title": "Linked lists and recursion", "focus": "Strengthen pointer and call-stack reasoning",
        "tasks": [
            ("linked-lists", "Solve linked-list reversal and cycle problems.", "Draw pointer changes before coding."),
            ("recursion", "Trace recursive calls and base cases.", "Explain stack depth and termination."),
            ("design-caching", "Design a cache-backed read endpoint.", "Discuss invalidation and stale data."),
            ("mock-coding-1", "Complete one timed coding session.", "Review communication and edge cases, not just correctness."),
        ],
    },
    {
        "week": 6, "title": "Trees and heaps", "focus": "Build recursive and hierarchical reasoning",
        "tasks": [
            ("tree-traversal", "Practise tree DFS and BFS.", "Know when recursion versus an explicit queue is useful."),
            ("tree-properties", "Solve tree height, depth or ancestor problems.", "Define the state returned by each recursive call."),
            ("heaps", "Solve top-K or priority-queue problems.", "Explain the complexity of heap operations."),
            ("design-queues", "Review asynchronous queues and worker services.", "Cover retries, dead-letter queues and idempotency."),
        ],
    },
    {
        "week": 7, "title": "Graphs and backtracking", "focus": "Explore search spaces systematically",
        "tasks": [
            ("graph-bfs-dfs", "Solve graph traversal problems.", "Handle visited sets and disconnected components."),
            ("backtracking", "Solve one combination or permutation problem.", "State the choices, constraints and stopping condition."),
            ("design-rate-limit", "Design an API rate limiter.", "Compare a few algorithms and storage choices."),
            ("project-story-2", "Prepare a second project deep dive.", "Include a difficult failure or trade-off you handled."),
        ],
    },
    {
        "week": 8, "title": "Intervals and dynamic programming", "focus": "Consolidate interview patterns",
        "tasks": [
            ("intervals", "Solve interval merge or scheduling problems.", "Sort by the right boundary or start based on the problem."),
            ("dp-intro", "Work through introductory one-dimensional dynamic programming.", "Define the state and transition before coding."),
            ("coding-review", "Re-solve three earlier problems without notes.", "Compare your new reasoning with the original mistake log."),
            ("design-load-balancing", "Review load balancing and service health.", "Explain what happens when an instance becomes unhealthy."),
        ],
    },
    {
        "week": 9, "title": "End-to-end system design", "focus": "Move from components to complete systems",
        "tasks": [
            ("design-requirements", "Design a URL shortener from requirements to architecture.", "Clarify scale, latency, availability and key product needs."),
            ("design-data-model", "Define the data model and API contracts.", "Explain indexing, uniqueness and read/write patterns."),
            ("design-bottlenecks", "Identify bottlenecks and failure modes.", "Discuss caching, partitioning and observability where relevant."),
            ("design-walkthrough", "Present the design aloud in 30–40 minutes.", "Make assumptions explicit and defend trade-offs."),
        ],
    },
    {
        "week": 10, "title": "Reliability and distributed systems", "focus": "Design for failures, not only happy paths",
        "tasks": [
            ("idempotency", "Design an idempotent asynchronous operation.", "Explain how duplicate delivery is handled."),
            ("retries", "Define retry, timeout and backoff behaviour.", "Avoid retry storms and unbounded retries."),
            ("consistency", "Review consistency and transaction boundaries.", "Explain what guarantees the system actually provides."),
            ("design-notifications", "Design a notification service.", "Cover preferences, delivery attempts, rate limits and observability."),
        ],
    },
    {
        "week": 11, "title": "CS fundamentals", "focus": "Strengthen engineering reasoning",
        "tasks": [
            ("networking", "Review DNS, TCP, TLS and HTTP at a practical level.", "Trace a request from client to service."),
            ("os-concurrency", "Review processes, threads, locks and race conditions.", "Explain one concurrency failure and how to prevent it."),
            ("database-internals", "Review indexes, query plans and transaction isolation.", "Connect the concepts to a real query or service."),
            ("mock-design-1", "Complete one system-design mock.", "Write down the three biggest gaps afterwards."),
        ],
    },
    {
        "week": 12, "title": "Build or improve one system", "focus": "Create evidence of engineering depth",
        "tasks": [
            ("project-scope", "Choose one meaningful backend improvement or small project.", "Do not build a large project without a specific learning goal."),
            ("project-quality", "Add tests, structured logs and useful metrics.", "Make the behaviour observable and repeatable."),
            ("project-failure", "Test at least one failure or recovery scenario.", "Document expected behaviour and actual results."),
            ("project-writeup", "Document architecture and trade-offs.", "Include what you would change at a larger scale."),
        ],
    },
    {
        "week": 13, "title": "Mock interviews", "focus": "Practise under realistic conditions",
        "tasks": [
            ("mock-dsa", "Complete two timed coding mocks.", "Review correctness, communication and time management."),
            ("mock-design", "Complete one system-design mock.", "Practise requirement clarification and trade-off discussion."),
            ("weaknesses", "Select your three most persistent weaknesses.", "Create a focused remediation list."),
            ("behavioural", "Prepare stories about ownership, conflict, failure and impact.", "Use concrete examples rather than generic claims."),
        ],
    },
    {
        "week": 14, "title": "Résumé and role targeting", "focus": "Translate experience into a strong application",
        "tasks": [
            ("resume-impact", "Rewrite résumé bullets around ownership and outcomes.", "Include metrics only when accurate and defensible."),
            ("role-level", "Compare job descriptions at your likely level.", "Separate must-have requirements from nice-to-haves."),
            ("company-list", "Build a focused list of target teams and companies.", "Include realistic alternatives, not only dream employers."),
            ("referrals", "Identify appropriate contacts or referral routes.", "Personalize outreach and respect people's time."),
        ],
    },
    {
        "week": 15, "title": "Targeted applications", "focus": "Start the feedback loop",
        "tasks": [
            ("apply", "Apply to a small batch of well-matched roles.", "Track role, level, date and next step."),
            ("company-prep", "Review interview format for each target.", "Prioritize the skills actually tested for that role."),
            ("practice-gaps", "Practise the weakest area revealed by mocks.", "Measure progress against previous attempts."),
            ("project-explanation", "Explain one project in five minutes and then in depth.", "Be ready to defend alternatives and failure handling."),
        ],
    },
    {
        "week": 16, "title": "Review and next cycle", "focus": "Use evidence to decide what comes next",
        "tasks": [
            ("final-mock", "Complete a final coding and design mock.", "Compare against week 1 rather than relying on feelings."),
            ("progress-review", "Review solved problems, recurring mistakes and mock feedback.", "Identify evidence of improvement and remaining gaps."),
            ("pipeline-review", "Review applications and interview outcomes.", "Adjust role targeting or preparation based on actual feedback."),
            ("next-cycle", "Choose the next 8-week focus.", "Keep the plan narrow and based on evidence."),
        ],
    },
]
