const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting enhanced database seeding...');

  // Clear existing data
  await prisma.subject.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.timetable.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.event.deleteMany();
  await prisma.mess.deleteMany();
  await prisma.hostel.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding test users...');
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    },
  });

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
    },
  });

  console.log('✅ Test users created: test@example.com / john@example.com (password: password123)');

  console.log('Seeding teachers with LinkedIn profiles...');
  const teachers = await Promise.all([
    prisma.teacher.create({
      data: {
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@college.edu',
        password: hashedPassword,
        department: 'Computer Science',
        designation: 'Professor & HOD',
        qualification: 'Ph.D. in Computer Science, M.Tech, B.Tech',
        experience: '15 years',
        phone: '+91-9876543210',
        linkedin: 'https://linkedin.com/in/dr-rajesh-kumar-cse',
        specialization: 'Artificial Intelligence, Machine Learning, Data Science',
        bio: 'Dr. Rajesh Kumar is a distinguished professor with over 15 years of experience in computer science education. He has published more than 50 research papers in international journals and conferences. His research focuses on AI and ML applications in real-world problems.',
        officeHours: 'Mon-Fri: 10:00 AM - 12:00 PM',
        researchAreas: 'Machine Learning, Deep Learning, Natural Language Processing, Computer Vision, AI Ethics',
      },
    }),
    prisma.teacher.create({
      data: {
        name: 'Prof. Priya Sharma',
        email: 'priya.sharma@college.edu',
        password: hashedPassword,
        department: 'Mathematics',
        designation: 'Associate Professor',
        qualification: 'M.Sc. Mathematics, B.Sc. Mathematics',
        experience: '12 years',
        phone: '+91-9876543211',
        linkedin: 'https://linkedin.com/in/prof-priya-sharma-math',
        specialization: 'Applied Mathematics, Discrete Mathematics, Linear Algebra',
        bio: 'Prof. Priya Sharma specializes in applied mathematics and has been teaching for over 12 years. She has a passion for making complex mathematical concepts easy to understand.',
        officeHours: 'Mon-Wed-Fri: 2:00 PM - 4:00 PM',
        researchAreas: 'Numerical Analysis, Optimization Techniques, Mathematical Modeling, Graph Theory',
      },
    }),
    prisma.teacher.create({
      data: {
        name: 'Dr. Amit Patel',
        email: 'amit.patel@college.edu',
        password: hashedPassword,
        department: 'Electronics',
        designation: 'Assistant Professor',
        qualification: 'Ph.D. in Electronics Engineering, M.Tech, B.Tech',
        experience: '8 years',
        phone: '+91-9876543212',
        linkedin: 'https://linkedin.com/in/dr-amit-patel-ece',
        specialization: 'Digital Electronics, VLSI Design, Embedded Systems',
        bio: 'Dr. Amit Patel is an expert in digital electronics and VLSI design. He has worked on several industry projects and brings practical insights to his teaching.',
        officeHours: 'Tue-Thu: 11:00 AM - 1:00 PM',
        researchAreas: 'VLSI Design, IoT, Embedded Systems, Digital Signal Processing, Microcontrollers',
      },
    }),
    prisma.teacher.create({
      data: {
        name: 'Prof. Sneha Gupta',
        email: 'sneha.gupta@college.edu',
        password: hashedPassword,
        department: 'Computer Science',
        designation: 'Assistant Professor',
        qualification: 'M.Tech in Software Engineering, B.Tech CSE',
        experience: '10 years',
        phone: '+91-9876543213',
        linkedin: 'https://linkedin.com/in/prof-sneha-gupta-swe',
        specialization: 'Software Engineering, Web Development, Cloud Computing',
        bio: 'Prof. Sneha Gupta is passionate about software development and modern web technologies. She has extensive industry experience working with top tech companies.',
        officeHours: 'Mon-Thu: 3:00 PM - 5:00 PM',
        researchAreas: 'Software Architecture, Agile Methodologies, DevOps, Cloud Native Applications, Microservices',
      },
    }),
    prisma.teacher.create({
      data: {
        name: 'Dr. Vikram Singh',
        email: 'vikram.singh@college.edu',
        password: hashedPassword,
        department: 'Computer Science',
        designation: 'Associate Professor',
        qualification: 'Ph.D. in Computer Networks, M.Tech, B.Tech',
        experience: '13 years',
        phone: '+91-9876543214',
        linkedin: 'https://linkedin.com/in/dr-vikram-singh-networks',
        specialization: 'Computer Networks, Operating Systems, Cybersecurity',
        bio: 'Dr. Vikram Singh is a renowned expert in computer networks and cybersecurity. He has conducted numerous workshops on network security.',
        officeHours: 'Tue-Wed-Fri: 10:00 AM - 12:00 PM',
        researchAreas: 'Network Security, Wireless Networks, Cloud Security, Cryptography, Ethical Hacking',
      },
    }),
    prisma.teacher.create({
      data: {
        name: 'Prof. Anjali Verma',
        email: 'anjali.verma@college.edu',
        password: hashedPassword,
        department: 'Computer Science',
        designation: 'Assistant Professor',
        qualification: 'M.Tech in Mobile Computing, B.Tech CSE',
        experience: '7 years',
        phone: '+91-9876543215',
        linkedin: 'https://linkedin.com/in/prof-anjali-verma-mobile',
        specialization: 'Mobile App Development, UI/UX Design, Cross-platform Development',
        bio: 'Prof. Anjali Verma specializes in mobile application development and user experience design. She has developed several award-winning mobile apps.',
        officeHours: 'Mon-Wed: 1:00 PM - 3:00 PM',
        researchAreas: 'Mobile Computing, React Native, Flutter, Progressive Web Apps, Mobile UI/UX',
      },
    }),
  ]);

  console.log('Seeding semesters with complete details...');
  const semesters = await Promise.all([
    prisma.semester.create({ 
      data: { 
        name: 'Semester 1',
        description: 'Foundation semester covering basic programming, mathematics, and electronics fundamentals',
        credits: 22,
        duration: '6 months'
      } 
    }),
    prisma.semester.create({ 
      data: { 
        name: 'Semester 2',
        description: 'Intermediate semester focusing on data structures, advanced mathematics, and computer organization',
        credits: 24,
        duration: '6 months'
      } 
    }),
    prisma.semester.create({ 
      data: { 
        name: 'Semester 3',
        description: 'Advanced semester covering databases, operating systems, and web technologies',
        credits: 26,
        duration: '6 months'
      } 
    }),
    prisma.semester.create({ 
      data: { 
        name: 'Semester 4',
        description: 'Specialization semester with software engineering, networks, and mobile development',
        credits: 24,
        duration: '6 months'
      } 
    }),
  ]);

  console.log('Seeding subjects with comprehensive details...');
  
  await prisma.subject.create({
    data: {
      name: 'Programming Fundamentals',
      code: 'CS101',
      semesterId: semesters[0].id,
      teacherId: teachers[0].id,
      credits: 4,
      prerequisites: 'None',
      syllabus: 'Introduction to programming concepts, problem-solving techniques, and C programming language fundamentals.',
      topics: `📚 UNIT 1: Introduction to Programming (12 hours)
• Problem solving techniques
• Algorithms and Flowcharts
• Pseudocode
• Introduction to C language
• Structure of C program

📚 UNIT 2: Data Types and Operators (10 hours)
• Variables and Constants
• Data types (int, float, char, double)
• Operators (Arithmetic, Relational, Logical)
• Type conversion and casting
• Input/Output functions

📚 UNIT 3: Control Structures (12 hours)
• If-else statements
• Switch-case
• Loops (for, while, do-while)
• Break and continue
• Nested loops

📚 UNIT 4: Functions (10 hours)
• Function declaration and definition
• Function call and return
• Parameter passing
• Recursion
• Scope and lifetime of variables

📚 UNIT 5: Arrays and Strings (12 hours)
• One-dimensional arrays
• Two-dimensional arrays
• String handling
• String functions
• Array of strings`,
      examDetails: `📝 EXAMINATION PATTERN:

🎯 Continuous Assessment (40 marks):
• Contest 1: 10 marks (Week 4)
  - MCQs and coding problems
  - Topics: Units 1-2
  
• Contest 2: 10 marks (Week 8)
  - MCQs and coding problems
  - Topics: Units 3-4

• Mid Semester Exam: 20 marks (Week 10)
  - Written exam + Programming
  - Topics: Units 1-3
  - Duration: 2 hours

🎯 End Semester Exam (60 marks):
• Written Exam: 40 marks
  - Theory questions
  - Problem solving
  - All units covered
  
• Programming Exam: 20 marks
  - Practical coding test
  - 3-4 programs to write
  - Duration: 3 hours

📊 Total: 100 marks
Pass marks: 40/100`,
      roadmap: `🗺️ STUDY ROADMAP:

📅 Week 1-2: Foundation
✓ Understand problem-solving basics
✓ Learn flowcharts and algorithms
✓ Practice 10+ basic problems
✓ Set up C programming environment

📅 Week 3-4: Data Types & Operators
✓ Master all data types
✓ Practice 20+ operator problems
✓ Prepare for Contest 1
✓ Complete 5 mini projects

📅 Week 5-6: Control Structures
✓ Master if-else and loops
✓ Solve 30+ pattern problems
✓ Practice nested loops
✓ Build simple calculator

📅 Week 7-8: Functions
✓ Understand function concepts
✓ Practice recursion problems
✓ Prepare for Contest 2
✓ Build modular programs

📅 Week 9-10: Arrays & Strings
✓ Master array operations
✓ Learn string manipulation
✓ Mid-sem preparation
✓ Solve previous year papers

📅 Week 11-16: Advanced Practice
✓ Solve 100+ coding problems
✓ Build 3 major projects
✓ Practice previous papers
✓ End-sem preparation

🎯 Practice Resources:
• HackerRank C Programming
• LeetCode Easy problems
• GeeksforGeeks C tutorials
• College lab assignments`,
      learningOutcomes: `After completing this course, students will be able to:
• Write efficient C programs to solve real-world problems
• Understand and apply programming logic
• Debug and test programs effectively
• Use functions and modular programming
• Work with arrays and strings confidently`,
    },
  });

  await prisma.subject.create({
    data: {
      name: 'Mathematics I',
      code: 'MA101',
      semesterId: semesters[0].id,
      teacherId: teachers[1].id,
      credits: 4,
      prerequisites: 'Class 12 Mathematics',
      syllabus: 'Calculus, Linear Algebra, and Differential Equations for engineering applications.',
      topics: `📚 UNIT 1: Differential Calculus (12 hours)
• Limits and Continuity
• Differentiation rules
• Partial derivatives
• Applications of derivatives
• Maxima and Minima

📚 UNIT 2: Integral Calculus (12 hours)
• Integration techniques
• Definite and indefinite integrals
• Applications of integration
• Multiple integrals
• Area and volume calculations

📚 UNIT 3: Differential Equations (10 hours)
• First order differential equations
• Second order differential equations
• Linear differential equations
• Applications in engineering
• Solution methods

📚 UNIT 4: Linear Algebra (12 hours)
• Matrices and determinants
• System of linear equations
• Eigenvalues and eigenvectors
• Vector spaces
• Matrix operations

📚 UNIT 5: Series and Sequences (10 hours)
• Infinite series
• Convergence tests
• Power series
• Taylor and Maclaurin series
• Applications`,
      examDetails: `📝 EXAMINATION PATTERN:

🎯 Continuous Assessment (40 marks):
• Quiz 1: 10 marks (Week 4)
• Quiz 2: 10 marks (Week 8)
• Mid Semester Exam: 20 marks (Week 10)

🎯 End Semester Exam (60 marks):
• Written Exam: 60 marks
• Duration: 3 hours
• All units covered

📊 Total: 100 marks`,
      roadmap: `🗺️ STUDY ROADMAP:

📅 Week 1-3: Differential Calculus
✓ Practice 50+ derivative problems
✓ Solve application problems

📅 Week 4-6: Integral Calculus
✓ Master integration techniques
✓ Solve 40+ problems

📅 Week 7-9: Differential Equations
✓ Learn solution methods
✓ Practice 30+ DE problems

📅 Week 10-12: Linear Algebra
✓ Master matrix operations
✓ Solve system of equations

📅 Week 13-16: Series & Revision
✓ Complete all topics
✓ Solve previous papers`,
      learningOutcomes: `Students will be able to:
• Apply calculus in engineering problems
• Solve differential equations
• Work with matrices and linear systems
• Understand mathematical modeling`,
    },
  });

  await prisma.subject.create({
    data: {
      name: 'Digital Electronics',
      code: 'EC101',
      semesterId: semesters[0].id,
      teacherId: teachers[2].id,
      credits: 4,
      prerequisites: 'Basic Physics',
      syllabus: 'Number systems, Boolean algebra, logic gates, combinational and sequential circuits.',
      topics: `📚 UNIT 1: Number Systems (8 hours)
• Binary, Octal, Hexadecimal
• Number conversions
• Binary arithmetic
• 1's and 2's complement
• BCD codes

📚 UNIT 2: Boolean Algebra (10 hours)
• Boolean theorems
• Logic gates (AND, OR, NOT, NAND, NOR, XOR)
• Truth tables
• Karnaugh maps
• Logic simplification

📚 UNIT 3: Combinational Circuits (12 hours)
• Adders and Subtractors
• Multiplexers and Demultiplexers
• Encoders and Decoders
• Comparators
• Design examples

📚 UNIT 4: Sequential Circuits (12 hours)
• Flip-flops (SR, JK, D, T)
• Registers
• Counters
• State machines
• Memory elements

📚 UNIT 5: Digital Systems (10 hours)
• A/D and D/A converters
• Semiconductor memories
• Programmable logic devices
• Microprocessor basics`,
      examDetails: `📝 EXAMINATION PATTERN:

🎯 Continuous Assessment (40 marks):
• Lab Tests: 15 marks
• Contest: 10 marks
• Mid Semester: 15 marks

🎯 End Semester Exam (60 marks):
• Theory: 40 marks
• Practical: 20 marks

📊 Total: 100 marks`,
      roadmap: `🗺️ STUDY ROADMAP:

📅 Week 1-2: Number Systems
✓ Practice conversions
✓ Master binary arithmetic

📅 Week 3-5: Boolean Algebra
✓ Simplify 50+ expressions
✓ Design logic circuits

📅 Week 6-9: Combinational Circuits
✓ Build circuits in lab
✓ Design projects

📅 Week 10-13: Sequential Circuits
✓ Understand flip-flops
✓ Design counters

📅 Week 14-16: Digital Systems
✓ Complete all topics
✓ Final preparation`,
      learningOutcomes: `Students will be able to:
• Design combinational circuits
• Implement sequential circuits
• Simplify Boolean expressions
• Work with digital systems`,
    },
  });

  // SEMESTER 2 SUBJECTS
  await prisma.subject.create({
    data: {
      name: 'Data Structures',
      code: 'CS201',
      semesterId: semesters[1].id,
      teacherId: teachers[0].id,
      credits: 4,
      prerequisites: 'Programming Fundamentals',
      syllabus: 'Arrays, linked lists, stacks, queues, trees, graphs, searching and sorting algorithms.',
      topics: `📚 UNIT 1: Introduction & Arrays (10 hours)
• Data structure concepts
• Time and space complexity
• Big O notation
• Array operations
• Multi-dimensional arrays

📚 UNIT 2: Linked Lists (12 hours)
• Singly linked list
• Doubly linked list
• Circular linked list
• Operations (insert, delete, search)
• Applications

📚 UNIT 3: Stacks & Queues (12 hours)
• Stack operations
• Stack applications
• Queue operations
• Circular queue
• Priority queue
• Deque

📚 UNIT 4: Trees (14 hours)
• Binary trees
• Binary search trees
• Tree traversals
• AVL trees
• Heap
• Applications

📚 UNIT 5: Graphs & Sorting (12 hours)
• Graph representation
• BFS and DFS
• Sorting algorithms
• Searching algorithms
• Hashing`,
      examDetails: `📝 EXAMINATION PATTERN:

🎯 Continuous Assessment (40 marks):
• Coding Contest 1: 10 marks (Week 5)
• Coding Contest 2: 10 marks (Week 9)
• Mid Semester: 20 marks (Week 10)

🎯 End Semester Exam (60 marks):
• Theory: 30 marks
• Coding Exam: 30 marks

📊 Total: 100 marks`,
      roadmap: `🗺️ STUDY ROADMAP:

📅 Week 1-3: Arrays & Complexity
✓ Master array problems
✓ Understand Big O
✓ Solve 30+ problems

📅 Week 4-6: Linked Lists
✓ Implement all types
✓ Solve 40+ problems
✓ Contest 1 preparation

📅 Week 7-9: Stacks & Queues
✓ Master operations
✓ Solve applications
✓ Contest 2 preparation

📅 Week 10-13: Trees
✓ Implement BST
✓ Practice traversals
✓ Solve 50+ tree problems

📅 Week 14-16: Graphs & Sorting
✓ Implement algorithms
✓ Practice on LeetCode
✓ Final preparation

🎯 Practice Platforms:
• LeetCode (200+ problems)
• HackerRank Data Structures
• GeeksforGeeks DSA
• Codeforces`,
      learningOutcomes: `Students will be able to:
• Choose appropriate data structures
• Implement complex data structures
• Analyze algorithm complexity
• Solve coding interview problems`,
    },
  });

  // Continue with remaining subjects...
  await prisma.subject.create({
    data: {
      name: 'Mathematics II',
      code: 'MA201',
      semesterId: semesters[1].id,
      teacherId: teachers[1].id,
      credits: 4,
      prerequisites: 'Mathematics I',
      syllabus: 'Probability, Statistics, Complex Analysis, and Transform Techniques.',
      topics: `📚 UNIT 1: Probability (12 hours)
• Basic probability concepts
• Conditional probability
• Bayes theorem
• Random variables
• Probability distributions

📚 UNIT 2: Statistics (12 hours)
• Mean, median, mode
• Standard deviation
• Correlation and regression
• Hypothesis testing
• Statistical inference

📚 UNIT 3: Complex Analysis (10 hours)
• Complex numbers
• Functions of complex variables
• Cauchy-Riemann equations
• Contour integration
• Residue theorem

📚 UNIT 4: Laplace Transform (10 hours)
• Definition and properties
• Inverse Laplace transform
• Applications to differential equations
• Transfer functions
• System analysis

📚 UNIT 5: Fourier Analysis (12 hours)
• Fourier series
• Fourier transform
• Properties and applications
• Signal processing basics`,
      examDetails: `📝 EXAMINATION PATTERN:

🎯 Continuous Assessment (40 marks):
• Quiz 1: 10 marks
• Quiz 2: 10 marks
• Mid Semester: 20 marks

🎯 End Semester: 60 marks

📊 Total: 100 marks`,
      roadmap: `🗺️ STUDY ROADMAP:

📅 Week 1-4: Probability & Statistics
✓ Solve 60+ problems
✓ Understand distributions

📅 Week 5-8: Complex Analysis
✓ Master complex functions
✓ Practice integration

📅 Week 9-12: Transforms
✓ Learn Laplace & Fourier
✓ Solve applications

📅 Week 13-16: Revision
✓ Complete all topics
✓ Previous papers`,
      learningOutcomes: `Students will master:
• Probability and statistics
• Complex analysis
• Transform techniques
• Mathematical applications`,
    },
  });

  await prisma.subject.create({
    data: {
      name: 'Computer Organization',
      code: 'CS202',
      semesterId: semesters[1].id,
      teacherId: teachers[3].id,
      credits: 4,
      prerequisites: 'Digital Electronics',
      syllabus: 'Computer architecture, instruction sets, memory hierarchy, I/O organization.',
      topics: `📚 UNIT 1: Basic Computer Organization (10 hours)
• Von Neumann architecture
• CPU organization
• Instruction cycle
• Registers and buses
• Control unit

📚 UNIT 2: Instruction Set Architecture (12 hours)
• Instruction formats
• Addressing modes
• RISC vs CISC
• Assembly language
• Instruction execution

📚 UNIT 3: Memory Organization (12 hours)
• Memory hierarchy
• Cache memory
• Virtual memory
• Memory mapping
• Memory management

📚 UNIT 4: I/O Organization (10 hours)
• I/O interfaces
• Interrupt handling
• DMA
• I/O processors
• Peripheral devices

📚 UNIT 5: Pipelining & Parallelism (12 hours)
• Instruction pipelining
• Pipeline hazards
• Parallel processing
• Multicore processors`,
      examDetails: `📝 EXAMINATION PATTERN:

🎯 Continuous Assessment (40 marks):
• Assignments: 15 marks
• Mid Semester: 25 marks

🎯 End Semester: 60 marks

📊 Total: 100 marks`,
      roadmap: `🗺️ STUDY ROADMAP:

📅 Week 1-4: Basic Organization
✓ Understand architecture
✓ Study CPU design

📅 Week 5-8: Instructions & Memory
✓ Learn ISA
✓ Master memory concepts

📅 Week 9-12: I/O & Pipelining
✓ Study I/O systems
✓ Understand pipelining

📅 Week 13-16: Revision
✓ Complete topics
✓ Practice problems`,
      learningOutcomes: `Students will understand:
• Computer architecture
• Instruction execution
• Memory systems
• I/O organization`,
    },
  });

  // SEMESTER 3 SUBJECTS
  await prisma.subject.create({
    data: {
      name: 'Database Management Systems',
      code: 'CS301',
      semesterId: semesters[2].id,
      teacherId: teachers[2].id,
      credits: 4,
      prerequisites: 'Data Structures',
      syllabus: 'Database concepts, SQL, normalization, transactions, and database design.',
      topics: `📚 UNIT 1: Introduction to DBMS (10 hours)
• Database concepts
• DBMS architecture
• Data models
• ER modeling
• Schema design

📚 UNIT 2: SQL (14 hours)
• DDL, DML, DCL
• SELECT queries
• Joins and subqueries
• Aggregate functions
• Views and indexes

📚 UNIT 3: Normalization (10 hours)
• Functional dependencies
• Normal forms (1NF to BCNF)
• Decomposition
• Denormalization
• Database design

📚 UNIT 4: Transactions (10 hours)
• ACID properties
• Concurrency control
• Locking protocols
• Deadlock handling
• Recovery techniques

📚 UNIT 5: Advanced Topics (12 hours)
• NoSQL databases
• MongoDB basics
• Database security
• Query optimization
• Distributed databases`,
      examDetails: `📝 EXAMINATION PATTERN:

🎯 Continuous Assessment (40 marks):
• SQL Contest: 10 marks
• Lab Tests: 15 marks
• Mid Semester: 15 marks

🎯 End Semester (60 marks):
• Theory: 35 marks
• SQL Practical: 25 marks

📊 Total: 100 marks`,
      roadmap: `🗺️ STUDY ROADMAP:

📅 Week 1-3: DBMS Basics
✓ Learn ER modeling
✓ Design 5 databases

📅 Week 4-7: SQL Mastery
✓ Practice 100+ queries
✓ Master joins
✓ Contest preparation

📅 Week 8-10: Normalization
✓ Normalize 20+ schemas
✓ Understand normal forms

📅 Week 11-13: Transactions
✓ Learn ACID properties
✓ Study concurrency

📅 Week 14-16: Advanced & Revision
✓ Explore NoSQL
✓ Final preparation

🎯 Practice Resources:
• SQLZoo
• HackerRank SQL
• LeetCode Database
• W3Schools SQL`,
      learningOutcomes: `Students will be able to:
• Design efficient databases
• Write complex SQL queries
• Normalize database schemas
• Manage transactions
• Work with NoSQL databases`,
    },
  });

  await prisma.subject.create({
    data: {
      name: 'Operating Systems',
      code: 'CS302',
      semesterId: semesters[2].id,
      teacherId: teachers[4].id,
      credits: 4,
      prerequisites: 'Computer Organization',
      syllabus: 'Process management, memory management, file systems, and OS concepts.',
      topics: `📚 UNIT 1: Introduction to OS (10 hours)
• OS functions and types
• System calls
• OS structure
• Virtual machines
• OS services

📚 UNIT 2: Process Management (14 hours)
• Process concept
• Process scheduling
• CPU scheduling algorithms
• Process synchronization
• Deadlocks

📚 UNIT 3: Memory Management (12 hours)
• Memory allocation
• Paging and segmentation
• Virtual memory
• Page replacement algorithms
• Memory optimization

📚 UNIT 4: File Systems (10 hours)
• File concepts
• Directory structure
• File allocation methods
• Disk scheduling
• File protection

📚 UNIT 5: I/O & Security (10 hours)
• I/O systems
• Device drivers
• OS security
• Protection mechanisms
• Case studies (Linux, Windows)`,
      examDetails: `📝 EXAMINATION PATTERN:

🎯 Continuous Assessment (40 marks):
• Assignments: 10 marks
• Lab Work: 10 marks
• Mid Semester: 20 marks

🎯 End Semester: 60 marks

📊 Total: 100 marks`,
      roadmap: `🗺️ STUDY ROADMAP:

📅 Week 1-4: OS Basics & Processes
✓ Understand OS concepts
✓ Study scheduling algorithms
✓ Solve 30+ problems

📅 Week 5-8: Memory Management
✓ Master paging
✓ Learn virtual memory
✓ Practice algorithms

📅 Week 9-12: File Systems
✓ Understand file operations
✓ Study disk scheduling

📅 Week 13-16: I/O & Revision
✓ Complete all topics
✓ Practice previous papers`,
      learningOutcomes: `Students will understand:
• OS architecture
• Process management
• Memory management
• File systems
• OS security`,
    },
  });

  await prisma.subject.create({
    data: {
      name: 'Web Technologies',
      code: 'CS303',
      semesterId: semesters[2].id,
      teacherId: teachers[5].id,
      credits: 4,
      prerequisites: 'Programming Fundamentals',
      syllabus: 'HTML, CSS, JavaScript, React, Node.js, and full-stack web development.',
      topics: `📚 UNIT 1: HTML & CSS (12 hours)
• HTML5 elements
• Semantic HTML
• CSS3 styling
• Flexbox and Grid
• Responsive design

📚 UNIT 2: JavaScript (14 hours)
• JS fundamentals
• DOM manipulation
• Events and forms
• ES6+ features
• Async programming

📚 UNIT 3: React.js (14 hours)
• React basics
• Components and props
• State and hooks
• React Router
• API integration

📚 UNIT 4: Backend Development (12 hours)
• Node.js basics
• Express.js framework
• REST APIs
• MongoDB integration
• Authentication

📚 UNIT 5: Full Stack Projects (8 hours)
• MERN stack
• Deployment
• Best practices
• Security
• Project work`,
      examDetails: `📝 EXAMINATION PATTERN:

🎯 Continuous Assessment (40 marks):
• Mini Projects: 20 marks
• Mid Semester: 20 marks

🎯 End Semester (60 marks):
• Theory: 30 marks
• Project: 30 marks

📊 Total: 100 marks`,
      roadmap: `🗺️ STUDY ROADMAP:

📅 Week 1-3: HTML & CSS
✓ Build 5 responsive websites
✓ Master CSS Grid

📅 Week 4-7: JavaScript
✓ Complete JS course
✓ Build 10 JS projects
✓ Master DOM

📅 Week 8-11: React.js
✓ Learn React fundamentals
✓ Build 5 React apps
✓ Master hooks

📅 Week 12-14: Backend
✓ Learn Node.js
✓ Build REST APIs
✓ Database integration

📅 Week 15-16: Full Stack Project
✓ Build complete app
✓ Deploy online

🎯 Practice Resources:
• FreeCodeCamp
• MDN Web Docs
• React official docs
• YouTube tutorials`,
      learningOutcomes: `Students will be able to:
• Build responsive websites
• Develop React applications
• Create REST APIs
• Build full-stack applications
• Deploy web applications`,
    },
  });

  // SEMESTER 4 SUBJECTS
  await prisma.subject.create({
    data: {
      name: 'Software Engineering',
      code: 'CS401',
      semesterId: semesters[3].id,
      teacherId: teachers[3].id,
      credits: 4,
      prerequisites: 'Data Structures',
      syllabus: 'Software development lifecycle, design patterns, testing, and project management.',
      topics: `📚 UNIT 1: Introduction to SE (10 hours)
• Software process models
• Agile methodology
• Scrum framework
• DevOps basics
• Project planning

📚 UNIT 2: Requirements Engineering (10 hours)
• Requirements gathering
• Use case diagrams
• User stories
• Requirements specification
• Validation

📚 UNIT 3: Design (12 hours)
• Software architecture
• Design patterns
• UML diagrams
• System design
• Design principles

📚 UNIT 4: Testing (12 hours)
• Testing strategies
• Unit testing
• Integration testing
• Test automation
• Quality assurance

📚 UNIT 5: Maintenance & Management (12 hours)
• Software maintenance
• Version control (Git)
• CI/CD
• Project management
• Software metrics`,
      examDetails: `📝 EXAMINATION PATTERN:

🎯 Continuous Assessment (40 marks):
• Project Work: 20 marks
• Mid Semester: 20 marks

🎯 End Semester: 60 marks

📊 Total: 100 marks`,
      roadmap: `🗺️ STUDY ROADMAP:

📅 Week 1-4: SE Basics & Requirements
✓ Learn SDLC models
✓ Practice use cases

📅 Week 5-8: Design
✓ Master design patterns
✓ Create UML diagrams

📅 Week 9-12: Testing
✓ Learn testing types
✓ Practice test cases

📅 Week 13-16: Project
✓ Build complete project
✓ Apply SE principles`,
      learningOutcomes: `Students will understand:
• Software development process
• Design patterns
• Testing methodologies
• Project management
• Agile practices`,
    },
  });

  await prisma.subject.create({
    data: {
      name: 'Computer Networks',
      code: 'CS402',
      semesterId: semesters[3].id,
      teacherId: teachers[4].id,
      credits: 4,
      prerequisites: 'Operating Systems',
      syllabus: 'Network layers, protocols, routing, and network security.',
      topics: `📚 UNIT 1: Introduction (10 hours)
• Network basics
• OSI model
• TCP/IP model
• Network topologies
• Transmission media

📚 UNIT 2: Data Link Layer (12 hours)
• Framing
• Error detection and correction
• Flow control
• MAC protocols
• Ethernet

📚 UNIT 3: Network Layer (14 hours)
• IP addressing
• Subnetting
• Routing algorithms
• IPv4 and IPv6
• ICMP

📚 UNIT 4: Transport Layer (12 hours)
• TCP and UDP
• Port numbers
• Connection management
• Flow control
• Congestion control

📚 UNIT 5: Application Layer (12 hours)
• HTTP/HTTPS
• DNS
• Email protocols
• FTP
• Network security basics`,
      examDetails: `📝 EXAMINATION PATTERN:

🎯 Continuous Assessment (40 marks):
• Lab Work: 15 marks
• Mid Semester: 25 marks

🎯 End Semester: 60 marks

📊 Total: 100 marks`,
      roadmap: `🗺️ STUDY ROADMAP:

📅 Week 1-4: Basics & Data Link
✓ Understand OSI model
✓ Learn protocols

📅 Week 5-8: Network Layer
✓ Master IP addressing
✓ Practice subnetting

📅 Week 9-12: Transport Layer
✓ Understand TCP/UDP
✓ Study protocols

📅 Week 13-16: Application & Security
✓ Learn application protocols
✓ Network security basics`,
      learningOutcomes: `Students will understand:
• Network architecture
• Routing and switching
• Network protocols
• IP addressing
• Network security`,
    },
  });

  await prisma.subject.create({
    data: {
      name: 'Mobile App Development',
      code: 'CS403',
      semesterId: semesters[3].id,
      teacherId: teachers[5].id,
      credits: 4,
      prerequisites: 'Web Technologies',
      syllabus: 'React Native, mobile UI/UX, APIs, and app deployment.',
      topics: `📚 UNIT 1: Mobile Development Basics (10 hours)
• Mobile platforms
• React Native setup
• Components and styling
• Navigation
• State management

📚 UNIT 2: UI/UX Design (12 hours)
• Mobile UI principles
• Responsive design
• Animations
• Gestures
• Platform-specific design

📚 UNIT 3: APIs & Data (12 hours)
• REST API integration
• Async storage
• Context API
• Redux basics
• Data fetching

📚 UNIT 4: Native Features (12 hours)
• Camera and gallery
• Location services
• Push notifications
• Device sensors
• Native modules

📚 UNIT 5: Deployment (10 hours)
• App optimization
• Testing
• Play Store deployment
• App Store deployment
• App maintenance`,
      examDetails: `📝 EXAMINATION PATTERN:

🎯 Continuous Assessment (40 marks):
• App Projects: 25 marks
• Mid Semester: 15 marks

🎯 End Semester (60 marks):
• Theory: 20 marks
• Final App Project: 40 marks

📊 Total: 100 marks`,
      roadmap: `🗺️ STUDY ROADMAP:

📅 Week 1-4: React Native Basics
✓ Setup environment
✓ Build 3 simple apps
✓ Master components

📅 Week 5-8: UI/UX
✓ Design beautiful UIs
✓ Add animations
✓ Build 5 UI projects

📅 Week 9-12: APIs & Features
✓ Integrate APIs
✓ Use native features
✓ Build complex apps

📅 Week 13-16: Final Project
✓ Build complete app
✓ Test thoroughly
✓ Deploy to stores

🎯 Practice Resources:
• React Native docs
• Expo documentation
• YouTube tutorials
• Udemy courses`,
      learningOutcomes: `Students will be able to:
• Build cross-platform mobile apps
• Design beautiful mobile UIs
• Integrate APIs and databases
• Use native device features
• Deploy apps to app stores`,
    },
  });

  // Seed Events with full details
  console.log('📅 Seeding events...');
  await Promise.all([
    prisma.event.create({
      data: {
        title: 'Tech Fest 2025 - Innovation Summit',
        date: new Date('2025-10-15'),
        time: '9:00 AM - 6:00 PM',
        venue: 'Main Auditorium & Tech Labs',
        description: 'Join us for the biggest tech event of the year! Tech Fest 2025 features coding competitions, hackathons, tech talks by industry experts, project exhibitions, and networking opportunities. Prizes worth ₹5 lakhs to be won! Open to all students. Register now and showcase your technical skills.',
        organizer: 'Technical Society & CSE Department',
        category: 'Technical',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Cultural Night - Euphoria 2025',
        date: new Date('2025-10-20'),
        time: '6:00 PM - 10:00 PM',
        venue: 'Open Air Theatre',
        description: 'Experience an evening of cultural extravaganza! Euphoria 2025 brings together music, dance, drama, and art performances by talented students. Special celebrity guest performance. Food stalls, games, and entertainment for everyone. Dress code: Traditional or Formal. Entry free for all students.',
        organizer: 'Cultural Committee',
        category: 'Cultural',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Annual Sports Day - Champions League',
        date: new Date('2025-10-25'),
        time: '7:00 AM - 5:00 PM',
        venue: 'Sports Complex & Grounds',
        description: 'Get ready for an action-packed day of sports and athletics! Champions League features cricket, football, basketball, volleyball, athletics, and indoor games. Inter-department competitions with trophies and medals for winners. Special guest: Olympic medalist. Come support your department!',
        organizer: 'Sports Committee & Physical Education Dept',
        category: 'Sports',
      },
    }),
  ]);

  console.log('Seeding mess menu...');
  await Promise.all([
    prisma.mess.create({
      data: {
        day: 'Monday',
        breakfast: 'Idli (3 pcs) with Sambar, Medu Vada (2 pcs), Coconut Chutney',
        lunch: 'Steamed Rice, Chapati (4 pcs), Dal Tadka, Paneer Butter Masala, Mix Veg Curry',
        snacks: 'Samosa, Masala Tea',
        dinner: 'Veg Fried Rice, Gobi Manchurian (Dry), Sweet Corn Soup, Ice Cream',
        timing: '7:00 AM - 9:30 PM'
      },
    }),
    prisma.mess.create({
      data: {
        day: 'Tuesday',
        breakfast: 'Poha with Peanuts, Jalebi (2 pcs), Banana/Seasonal Fruit',
        lunch: 'Steamed Rice, Chapati (4 pcs), Rajma Masala, Aloo Jeera, Cabbage Poriyal',
        snacks: 'Biscuits, Coffee/Tea',
        dinner: 'White Pasta in Red Sauce, Garlic Bread (3 pcs), Corn & Spinach Soup',
        timing: '7:00 AM - 9:30 PM'
      },
    }),
    prisma.mess.create({
      data: {
        day: 'Wednesday',
        breakfast: 'Upma with Vegetables, Coconut Chutney, Boiled Eggs (2 pcs)',
        lunch: 'Steamed Rice, Chapati (4 pcs), Chole Masala, Bhindi Fry, Aloo Matar',
        snacks: 'Paneer Pakora, Tea',
        dinner: 'Veg Biryani with Raita, Mirchi ka Salan, Gulab Jamun',
        timing: '7:00 AM - 9:30 PM'
      },
    }),
    prisma.mess.create({
      data: {
        day: 'Thursday',
        breakfast: 'Aloo Paratha (2 pcs), Curd & Pickle, Mixed Fruit Salad',
        lunch: 'Steamed Rice, Chapati (4 pcs), Sambar, Bhindi Masala, Aloo Gobi',
        snacks: 'Bread Butter, Tea',
        dinner: 'Hakka Noodles, Chilli Paneer (Dry), Hot & Sour Soup',
        timing: '7:00 AM - 9:30 PM'
      },
    }),
    prisma.mess.create({
      data: {
        day: 'Friday',
        breakfast: 'Masala Dosa with Sambar & Chutney, Filter Coffee/Tea',
        lunch: 'Steamed Rice, Chapati (4 pcs), Kadhi Pakora, Aloo Gobi Masala',
        snacks: 'Fruit Salad, Tea',
        dinner: 'Cheese Pizza (2 slices), Garlic Bread Sticks (4 pcs), French Fries',
        timing: '7:00 AM - 9:30 PM'
      },
    }),
    prisma.mess.create({
      data: {
        day: 'Saturday',
        breakfast: 'Veg Sandwich (Grilled), Tomato Ketchup, Orange Juice',
        lunch: 'Steamed Rice, Chapati (4 pcs), Dal Makhani, Paneer Tikka Masala',
        snacks: 'Cookies, Coffee',
        dinner: 'Veg Burger with Cheese, French Fries, Vanilla Ice Cream Sundae',
        timing: '7:00 AM - 9:30 PM'
      },
    }),
    prisma.mess.create({
      data: {
        day: 'Sunday',
        breakfast: 'Puri Bhaji (5 Puris), Aloo Sabzi, Halwa, Fresh Juice',
        lunch: 'Jeera Rice, Chapati (5 pcs), Dal Fry, Paneer Butter Masala, Veg Kolhapuri',
        snacks: 'Special Sunday Snack, Tea',
        dinner: 'Veg Fried Rice, Chilli Paneer, Veg Manchurian, Spring Rolls',
        timing: '7:30 AM - 10:00 PM'
      },
    }),
  ]);

  console.log('Seeding hostel...');
  await prisma.hostel.create({
    data: {
      name: `MyCampus Hostel - Premium Student Accommodation

🏢 FACILITIES & AMENITIES:

📱 Room Features:
• Spacious rooms with attached bathrooms
• 24/7 hot & cold water supply
• Individual study tables & chairs
• Comfortable beds with storage
• Ceiling fans & tube lights
• Individual cupboards with locks
• High-speed WiFi connectivity
• Power backup for essential areas

🍽️ Dining:
• Hygienic mess with varied menu
• Separate dining hall
• Pure vegetarian food
• Special meals on festivals
• Tea/Coffee available 24/7

🎯 Common Areas:
• TV room with DTH connection
• Indoor games room (Table Tennis, Carrom, Chess)
• Gym with modern equipment
• Library & Reading room
• Common room for gatherings
• Laundry facilities

🔒 Security:
• 24/7 security guards
• CCTV surveillance
• Biometric entry system
• Visitor management system
• Separate blocks for boys & girls
• Warden on premises

🏥 Additional Services:
• First aid medical facility
• Doctor on call
• Ambulance service
• Counseling services
• Maintenance staff 24/7

📞 Contact Information:
Boys Hostel Warden: +91-9876543220
Girls Hostel Warden: +91-9876543221
Hostel Office: +91-9876543222

⏰ Hostel Timings:
Entry: 6:00 AM - 10:00 PM
Late entry with permission only

💰 Fee Structure:
Single Occupancy: ₹80,000/year
Double Occupancy: ₹60,000/year
Triple Occupancy: ₹45,000/year
(Includes accommodation, electricity, water, WiFi)

📝 Hostel Rules:
• Maintain cleanliness
• No smoking/alcohol
• Respect quiet hours (11 PM - 6 AM)
• Visitors allowed in common areas only
• Regular room inspections
• Attendance mandatory`,
    },
  });

  console.log('🏫 Seeding professional college information...');
  await prisma.college.create({
    data: {
      name: 'Newton School of Technology',
      tagline: 'The Future of Engineering & Tech Leadership',
      location: 'Global Education Hub, Sonipat, Delhi NCR',
      about: 'Newton School of Technology is a premier institution dedicated to building the next generation of tech leaders. Founded with a vision to bridge the gap between academia and industry, we combine a cutting-edge computer science curriculum with world-class faculty and extensive industry exposure.',
      stats: [
        { label: 'Placements', value: '98%', icon: 'trending-up' },
        { label: 'Avg Package', value: '₹12.5 LPA', icon: 'award' },
        { label: 'Projects', value: '500+', icon: 'rocket' },
        { label: 'Partners', value: '50+', icon: 'business' }
      ],
      facilities: [
        { name: 'AI & ML Lab', icon: 'cpu' },
        { name: 'Digital Library', icon: 'book-open' },
        { name: 'Cloud Computing Hub', icon: 'cloud' },
        { name: 'Sports Arena', icon: 'dribbble' },
        { name: '24/7 Smart WiFi', icon: 'wifi' },
        { name: 'Gourmet Cafeteria', icon: 'food' }
      ],
      contactInfo: {
        phone: '011-4567-8900',
        email: 'admissions@nst.edu',
        website: 'www.newtonschool.co'
      }
    },
  });

  console.log('Seeding timetables...');
  await Promise.all(
    semesters.map((semester) =>
      prisma.timetable.create({
        data: {
          semesterId: semester.id,
        },
      })
    )
  );

  console.log('✅ Enhanced database seeding completed successfully!');
  console.log('Summary:');
  console.log(`   - ${teachers.length} Teachers (with LinkedIn profiles)`);
  console.log(`   - ${semesters.length} Semesters (with detailed info)`);
  console.log(`   - 12 Subjects (with complete syllabus, topics, exams, roadmap)`);
  console.log(`   - 3 Events (with full details)`);
  console.log(`   - 7 Mess Menu Items`);
  console.log(`   - 1 Hostel (comprehensive info)`);
  console.log(`   - 1 College Info (enhanced styling)`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
