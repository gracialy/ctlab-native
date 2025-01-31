import { Module } from '@/types/module';

export const modules: Module[] = [
    {
      id: 'ctman-intro',
      title: 'Introduction to CTMan Gameplay',
      description: 'Master the fundamental controls and learn how to navigate CTMan through the maze using simple commands.',
      pages: [
        {
          id: 'learning-objectives',
          title: 'Learning Objectives',
          content: [
            {
              type: 'list',
              content: [
                'Understand basic computational thinking concepts',
                "Practice basic problem-solving skills",
                "Learn the commands and how it works",
                "Write your first commands to control CTMan"
              ]
            }
          ]
        },
        {
          id: 'computational-thinking',
          title: 'What is Computational Thinking?',
          content: [
            {
              type: 'paragraph',
              content: ['Meet **CTMan**, a Pac-Man like entity that move one step at a time insteads of continuously. To guide CTMan through a maze, you need to set up a set of commands that tell him where to move. You can consider formulating those commands as applying computational thinking!']
            },
            {
              type: 'paragraph',
              content: ['**Key Concepts**']
            },
            {
              type: 'paragraph',
              content: ['Computational thinking helps you solve problem using the following concepts:']
            },
            {
              type: 'list',
              content: [
                "**Decomposition**: Breaking down complex problem into smaller, more understandable components",
                "**Abstraction**: Focusing on essential details and ignoring irrelevant information",
                "**Pattern Recognition**: Identifying patterns and relationships within data (phenomenon)",
                "**Algorithm Design**: Developing step-by-step solutions to solve problems"
              ]
            }
          ]
        },
        {
          id: 'basic-commands',
          title: 'CTMan Basic Commands',
          content: [
            {
              type: 'paragraph',
              content: ['Just like Pac-Man, CTMan can move to four directions: **left, right, up, and down**.']
            },
            {
              type: 'paragraph',
              content: ['**Understanding Command Execution**']
            },
            {
              type: 'list',
              content: [
                "Commands are executed one at a time",
                "One command constitutes one movement of the CTMan",
                "Commands are executed in order from the first to the last"
              ]
            }
          ]
        },
        {
          id: 'special-commands',
          title: 'CTMan Special Commands',
          content: [
            {
              type: 'paragraph',
              content: ['To avoid formulating long program, CTMan uses **conditionals and loops**.']
            },
            {
              type: 'paragraph',
              content: ['**Special Commands**']
            },
            {
              type: 'list',
              content: [
                "**Loop until just before a wall**: Breaking down complex problem into smaller, more understandable components",
                "**Loop until the next crossroads**: Focusing on essential details and ignoring irrelevant information",
              ]
            },
            {
              type: 'paragraph',
              content: ['**Understanding Command Execution**']
            },
            {
              type: 'list',
              content: [
                "Special commands must be followed with at least one basic command",
                "Special commands will instruct CTMan to move according to the first next basic command as long as the loop applies",
                "Special commands musn't be directly followed by another special command."
              ]
            },
          ]
        },
        {
          id: 'get-started',
          title: 'Let\'s Get Started',
          content: [
            {
              type: 'paragraph',
              content: ['In a game session, you will be given **20 runs** where each run can only contains **maximum 10 commands**. Each dot will gain you **10 points**, but each collision will cause you **5 points**! You have **3 lives**, so try to achieve maximum score out of it! ^^']
            },
            {
              type: 'paragraph',
              content: ['**Next Steps**']
            },
            {
              type: 'paragraph',
              content: ['Once you\'re comfortable with these basics, you\'ll be ready to learn about:']
            },
            {
              type: 'list',
              content: [
                "Loops (for repeating actions)",
                "Conditions (for making decisions)",
                "Functions (for organizing commands)"
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'conditionals',
      title: 'Conditionals',
      description: 'Discover how to use conditionals and how it make CTMan perform actions logically.',
      pages: [
        {
          id: 'learning-objectives',
          title: 'Learning Objectives',
          content: [
            {
              type: 'list',
              content: [
                'Understand how to use conditionals to make decisions',
                "Practice using conditionals to control CTMan",
                "Write your first conditional commands to control CTMan"
              ]
            }
          ]
        },
        {
          id: 'conditionals',
          title: 'What are Conditionals?',
          content: [
            {
              type: 'paragraph',
              content: ['Conditionals are used to make decisions in programming. It allows you to execute a block of code only when a certain condition is met.']
            },
            {
              type: 'paragraph',
              content: ['**Key Concepts**']
            },
            {
              type: 'paragraph',
              content: ['Conditionals help you solve problem using the following concepts:']
            },
            {
              type: 'list',
              content: [
                "**Decision Making**: Making decision based on certain conditions",
                "**Branching**: Executing different code based on the condition",
                "**Comparison**: Comparing values to determine the outcome",
                "**Logical Operators**: Combining multiple conditions"
              ]
            }
          ]
        },
        {
          id: 'common-usage',
          title: 'Implementation in Programming',
          content: [
            {
              type: 'paragraph',
              content: ['In most programming language, conditionals are structured as **if-else** statements. It allows you to execute a block of code if the condition is true, and another block if the condition is false.']
            },
            {
              type: 'paragraph',
              content: ["**Example**"]
            },
            {
              type: 'paragraph',
              content: ['You are comparing two numbers: **a** and **b**. If **a** is greater than **b**, you will execute a block of code. Otherwise, you will execute another block of code. You can write it as:']
            },
            {
              type: 'paragraph',
              content: ["if a > b:"]
            },
            {
              type: 'paragraph',
              content: ["  print('a is greater than b')" ]
            },
            {
              type: 'paragraph',
              content: ["else:"]
            },
            {
              type: 'paragraph',
              content: ["  print('b is greater than a')" ]
            }
          ]
        },
        {
          id: 'ctman-usage',
          title: 'Implementation in CTMan',
          content: [
            {
              type: 'paragraph',
              content: ['In CTMan, there are no explicit conditionals command. However, conditionals are implicitly used to make decisions based on the surrounding.']
            },
            {
              type: 'paragraph',
              content: ["**Example**"]
            },
            {
              type: 'list',
              content: [
                'You want to make CTMan move to the right if there is a wall in front of it.',
                'You want to make CTMan move to the left on the next crossroads.'
              ]
            },
            {
              type: 'paragraph',
              content: ['Notice the conditionals are implicitly used in the special commands. You will learn more about it in the **loop** module.']
            }
          ]
        },
        {
          id: 'next-steps',
          title: 'Moving Forward',
          content: [
            {
              type: 'paragraph',
              content: ['Conditionals are essential in programming to make decisions. You\'re introduced to the **if-else** statement, which is the most common conditional structure. However, CTMan will show you how conditionals are basically used everywhere in computational thinking. Practice using **special commands** to get a grasp of it!']
            },
            {
              type: 'paragraph',
              content: ['**Next Steps**']
            },
            {
              type: 'paragraph',
              content: ['Once you\'re comfortable with these basics, you\'ll be ready to learn about:']
            },
            {
              type: 'list',
              content: [
                "Loops (for repeating actions)",
                "Functions (for organizing commands)"
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'loops',
      title: 'Loops',
      description: 'Learn how to use loops to make CTMan perform repetitive actions efficiently.',
      pages: [
        {
          id: 'learning-objectives',
          title: 'Learning Objectives',
          content: [
            {
              type: 'list',
              content: [
                'Understand how loops can simplify repetitive tasks',
                'Learn different types of loops and their use cases',
                'Practice using loops to control CTMan more efficiently'
              ]
            }
          ]
        },
        {
          id: 'loops-introduction',
          title: 'What are Loops?',
          content: [
            {
              type: 'paragraph',
              content: ['Loops are programming constructs that allow you to repeat a set of commands multiple times. Instead of writing the same command over and over, you can use a loop to do it automatically.']
            },
            {
              type: 'paragraph',
              content: ['**Key Concepts**']
            },
            {
              type: 'paragraph',
              content: ['Loops help you solve problems using the following concepts:']
            },
            {
              type: 'list',
              content: [
                '**Repetition**: Executing the same set of commands multiple times',
                '**Iteration**: Going through a sequence of items one by one',
                '**Counter**: Keeping track of how many times something has been done',
                '**Exit Condition**: Determining when to stop the loop'
              ]
            }
          ]
        },
        {
          id: 'types-of-loops',
          title: 'Common Types of Loops',
          content: [
            {
              type: 'paragraph',
              content: ['In programming, there are several types of loops, each designed for specific situations:']
            },
            {
              type: 'list',
              content: [
                '**For Loop**: Used when you know exactly how many times you want to repeat something',
                '**While Loop**: Used when you want to repeat something until a condition is met',
                '**Do-While Loop**: Similar to while loop, but always executes at least once'
              ]
            },
            {
              type: 'paragraph',
              content: ['**Example**']
            },
            {
              type: 'paragraph',
              content: ['Here\'s how you might use a for loop to move forward 5 times:']
            },
            {
              type: 'paragraph',
              content: ['for i in range(5):']
            },
            {
              type: 'paragraph',
              content: ['    move_forward()']
            }
          ]
        },
        {
          id: 'ctman-loops',
          title: 'Loops in CTMan',
          content: [
            {
              type: 'paragraph',
              content: ['In CTMan, loops are essential for efficient movement and problem-solving. You can use loops to:']
            },
            {
              type: 'list',
              content: [
                'Move CTMan multiple steps in one direction',
                'Search for a specific item or location',
                'Follow a pattern until reaching a goal',
                'Navigate through mazes efficiently'
              ]
            },
            {
              type: 'paragraph',
              content: ['**CTMan Loop Commands**']
            },
            {
              type: 'list',
              content: [
                '**Until Wall**: Repeats until CTMan encounters a wall',
                '**Until Crossroads**: Repeats until CTMan is in a middle of a crossroad (more than 2 possible moves)',
              ]
            }
          ]
        },
        {
          id: 'next-steps',
          title: 'Moving Forward',
          content: [
            {
              type: 'paragraph',
              content: ['Now that you understand loops, you can write more efficient commands for CTMan. Remember that loops can be combined with conditionals to create more sophisticated behaviors!']
            },
            {
              type: 'paragraph',
              content: ['**Next Steps**']
            },
            {
              type: 'paragraph',
              content: ['After mastering loops, you\'ll be ready to learn about:']
            },
            {
              type: 'list',
              content: [
                'Functions (for creating reusable command sequences)',
                'Advanced Problem Solving (combining all concepts)'
              ]
            }
          ]
        }
      ]
    }
  ];