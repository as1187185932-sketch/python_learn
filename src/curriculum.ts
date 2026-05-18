import type { Lesson } from "./types";

export const sectionOrder = [
  "warmup",
  "lesson",
  "example",
  "guided",
  "challenge",
  "reflection",
] as const;

export const sectionLabels: Record<(typeof sectionOrder)[number], string> = {
  warmup: "Warm-up recall",
  lesson: "Concept lesson",
  example: "Worked example",
  guided: "Guided practice",
  challenge: "Independent challenge",
  reflection: "Reflection",
};

export const lessons: Lesson[] = [
  {
    id: "day-1-values-variables",
    day: 1,
    module: "Python Basics",
    conceptId: "values-variables",
    title: "Values, Variables, and Mental Models",
    focus: "Use variables as named references and predict simple output.",
    minutes: 45,
    warmup: [
      "What is one thing a computer program can remember while it runs?",
      "Say out loud what you think happens when Python reads code from top to bottom.",
    ],
    lesson: [
      "A value is a piece of information, such as 7, 3.14, or 'Ada'.",
      "A variable is a name attached to a value. The name helps you reuse the value later.",
      "The equals sign assigns. Read name = 'Ada' as 'store Ada under the name name'.",
      "Python runs each line in order, so a later assignment can replace an earlier one.",
    ],
    workedExample: {
      prompt: "Predict the final print before checking the explanation.",
      code: "name = 'Ada'\nminutes = 20\nminutes = minutes + 25\nprint(name, minutes)",
      explanation:
        "The variable minutes starts as 20. The third line reads the old value, adds 25, then stores 45 back into minutes. The output is Ada 45.",
    },
    guidedPractice: {
      prompt:
        "Create variables for your name, today's topic, and the number of minutes you will study. Print a sentence using all three.",
      expected:
        "The program should define at least three variables and print one readable sentence containing their values.",
      hints: [
        "Start with name = 'Your name'.",
        "Use print() once you have all three variables.",
        "You can join pieces with commas inside print().",
      ],
      commonMistakes: [
        "Forgetting quotes around text.",
        "Using a variable before assigning it.",
        "Expecting = to compare instead of assign.",
      ],
      solution:
        "name = 'Maya'\ntopic = 'variables'\nminutes = 45\nprint(name, 'will study', topic, 'for', minutes, 'minutes')",
    },
    challenge: {
      prompt:
        "Write a tiny progress tracker: store completed exercises and total exercises, then print how many remain.",
      expected:
        "The code should calculate remaining exercises from two variables and print the result.",
      hints: [
        "Use total = 5 and completed = 2 to start.",
        "remaining should be total - completed.",
        "Print the remaining variable with a short label.",
      ],
      commonMistakes: [
        "Putting numbers in quotes and accidentally treating them as text.",
        "Writing total - completed inside quotes.",
      ],
      solution:
        "total = 5\ncompleted = 2\nremaining = total - completed\nprint('Exercises left:', remaining)",
    },
    reflectionPrompts: [
      "What changed in your mental model of variables today?",
      "What mistake will you watch for tomorrow?",
    ],
  },
  {
    id: "day-2-types-input",
    day: 2,
    module: "Python Basics",
    conceptId: "types-input",
    title: "Types, Strings, Numbers, and Input",
    focus: "Tell text and numbers apart, then convert input when needed.",
    minutes: 45,
    warmup: [
      "Without looking back, explain what a variable does.",
      "Predict: if age = '20', is age text or a number?",
    ],
    lesson: [
      "A type tells Python what kind of value it is handling.",
      "Common beginner types are str for text, int for whole numbers, float for decimals, and bool for True/False.",
      "input() always gives you a string, even when the user types digits.",
      "Use int() or float() when you need numeric calculation.",
    ],
    workedExample: {
      prompt: "Read the code and explain why int() matters.",
      code: "age_text = input('Age: ')\nage_next_year = int(age_text) + 1\nprint('Next year:', age_next_year)",
      explanation:
        "input() returns text. int(age_text) converts the text to a whole number so Python can add 1 mathematically.",
    },
    guidedPractice: {
      prompt:
        "Ask for a number of study minutes, convert it to an integer, then print how many minutes remain after a 10-minute warm-up.",
      expected:
        "The program should use input(), int(), subtraction, and print the remaining minutes.",
      hints: [
        "Store input in a variable before converting.",
        "remaining = int(minutes_text) - 10",
        "Use print('Practice minutes:', remaining).",
      ],
      commonMistakes: [
        "Trying to subtract 10 from the raw input string.",
        "Forgetting that int() needs parentheses around the value.",
      ],
      solution:
        "minutes_text = input('Study minutes: ')\nremaining = int(minutes_text) - 10\nprint('Practice minutes:', remaining)",
    },
    challenge: {
      prompt:
        "Build a simple daily score: ask for completed exercises and confidence from 1 to 5, then print completed * confidence.",
      expected:
        "Both inputs should be converted to integers before multiplication.",
      hints: [
        "Use two input() calls.",
        "Convert each answer with int().",
        "Multiplication uses * in Python.",
      ],
      commonMistakes: [
        "Multiplying strings and getting repeated text.",
        "Using x instead of * for multiplication.",
      ],
      solution:
        "completed = int(input('Completed exercises: '))\nconfidence = int(input('Confidence 1-5: '))\nscore = completed * confidence\nprint('Daily score:', score)",
    },
    reflectionPrompts: [
      "How can you tell when a conversion is needed?",
      "What type-related error would you now recognize faster?",
    ],
  },
  {
    id: "day-3-conditionals",
    day: 3,
    module: "Control Flow",
    conceptId: "conditionals",
    title: "Conditionals and Decisions",
    focus: "Use if, elif, and else to make programs choose a path.",
    minutes: 45,
    warmup: [
      "What does input() return by default?",
      "Name one situation where a program should make a decision.",
    ],
    lesson: [
      "A conditional lets your program run different code based on a true/false test.",
      "Use if for the first test, elif for extra tests, and else for the fallback.",
      "Indentation matters. The indented block belongs to the condition above it.",
      "Comparison operators include ==, !=, <, <=, >, and >=.",
    ],
    workedExample: {
      prompt: "Trace which branch runs for score = 82.",
      code: "score = 82\nif score >= 90:\n    print('excellent')\nelif score >= 70:\n    print('solid')\nelse:\n    print('review')",
      explanation:
        "82 is not at least 90, so Python checks the elif. 82 is at least 70, so it prints solid and skips the else.",
    },
    guidedPractice: {
      prompt:
        "Ask for confidence from 1 to 5. Print 'review first' for 1-2, 'practice' for 3, and 'new lesson' for 4-5.",
      expected:
        "The code should convert input to int and use if/elif/else with correct ranges.",
      hints: [
        "Start with confidence = int(input('Confidence: ')).",
        "Use confidence <= 2 for the first branch.",
        "Use confidence == 3 for the middle branch.",
      ],
      commonMistakes: [
        "Using = instead of == in a condition.",
        "Forgetting the colon after if or elif.",
        "Not indenting the print lines.",
      ],
      solution:
        "confidence = int(input('Confidence: '))\nif confidence <= 2:\n    print('review first')\nelif confidence == 3:\n    print('practice')\nelse:\n    print('new lesson')",
    },
    challenge: {
      prompt:
        "Create a lesson gate: if exercises_completed is at least 3 and confidence is at least 4, print 'move on'; otherwise print 'repeat practice'.",
      expected:
        "The condition should combine two comparisons with and.",
      hints: [
        "Use and when both conditions must be true.",
        "Try exercises_completed = 3 and confidence = 4.",
        "Then change one value to test the other branch.",
      ],
      commonMistakes: [
        "Writing two if statements when one combined decision is clearer.",
        "Using & instead of and.",
      ],
      solution:
        "exercises_completed = 3\nconfidence = 4\nif exercises_completed >= 3 and confidence >= 4:\n    print('move on')\nelse:\n    print('repeat practice')",
    },
    reflectionPrompts: [
      "How did indentation change your reading of the code?",
      "Which comparison operator still needs more practice?",
    ],
  },
  {
    id: "day-4-loops",
    day: 4,
    module: "Control Flow",
    conceptId: "loops",
    title: "Loops for Repetition",
    focus: "Use for loops to repeat predictable work.",
    minutes: 45,
    warmup: [
      "What is the difference between = and ==?",
      "Describe one repetitive task a program could handle.",
    ],
    lesson: [
      "A for loop repeats a block for each item in a sequence.",
      "range(5) produces 0, 1, 2, 3, 4.",
      "The loop variable changes each time through the loop.",
      "Loops are best when the same pattern should happen multiple times.",
    ],
    workedExample: {
      prompt: "Predict the output before reading the explanation.",
      code: "for day in range(1, 4):\n    print('Python day', day)",
      explanation:
        "range(1, 4) gives 1, 2, and 3. The print line runs once for each number.",
    },
    guidedPractice: {
      prompt:
        "Print a 5-day study checklist using a for loop. Each line should say Day 1, Day 2, and so on.",
      expected:
        "The solution should use range() and one indented print inside the loop.",
      hints: [
        "Use range(1, 6) to include 5.",
        "The loop variable can be called day.",
        "print('Day', day, 'study Python').",
      ],
      commonMistakes: [
        "Using range(1, 5) and missing day 5.",
        "Forgetting to indent the print line.",
      ],
      solution:
        "for day in range(1, 6):\n    print('Day', day, 'study Python')",
    },
    challenge: {
      prompt:
        "Use a loop to add up the minutes from five 9-minute practice blocks and print the total.",
      expected:
        "The program should initialize total, update it in a loop, and print 45.",
      hints: [
        "Start with total = 0.",
        "Repeat five times with range(5).",
        "Inside the loop, total = total + 9.",
      ],
      commonMistakes: [
        "Resetting total to 0 inside the loop.",
        "Printing before the loop is finished.",
      ],
      solution:
        "total = 0\nfor block in range(5):\n    total = total + 9\nprint('Total minutes:', total)",
    },
    reflectionPrompts: [
      "What did the loop variable represent in your code?",
      "Where should initialization happen when building a running total?",
    ],
  },
  {
    id: "day-5-functions",
    day: 5,
    module: "Functions",
    conceptId: "functions",
    title: "Functions as Reusable Thinking",
    focus: "Define a function, pass information in, and return a result.",
    minutes: 45,
    warmup: [
      "Where should a running total be initialized?",
      "Name one repeated calculation that could become a function.",
    ],
    lesson: [
      "A function packages a small job behind a name.",
      "Parameters are placeholders for information the function needs.",
      "return sends a value back to the caller.",
      "Good functions make code easier to test and reuse.",
    ],
    workedExample: {
      prompt: "Identify the parameter, argument, and return value.",
      code: "def remaining(total, completed):\n    return total - completed\n\nleft = remaining(5, 2)\nprint(left)",
      explanation:
        "total and completed are parameters. 5 and 2 are arguments. The function returns 3, which is stored in left.",
    },
    guidedPractice: {
      prompt:
        "Write a function named minutes_left(total, used) that returns total - used. Call it with 45 and 12.",
      expected:
        "The code should define a function with two parameters, return the difference, and print 33.",
      hints: [
        "Start with def minutes_left(total, used):",
        "Indent the return line.",
        "Store the call result before printing it.",
      ],
      commonMistakes: [
        "Printing inside the function when returning would be cleaner.",
        "Forgetting parentheses in the function call.",
      ],
      solution:
        "def minutes_left(total, used):\n    return total - used\n\nleft = minutes_left(45, 12)\nprint(left)",
    },
    challenge: {
      prompt:
        "Create a confidence_label(score) function that returns 'low' for 1-2, 'steady' for 3, and 'strong' for 4-5.",
      expected:
        "The function should use conditionals and return a string for each case.",
      hints: [
        "Use if score <= 2 first.",
        "Use elif score == 3 for the middle.",
        "Use else for 4 or 5.",
      ],
      commonMistakes: [
        "Using print instead of return, making the function harder to reuse.",
        "Leaving out one branch.",
      ],
      solution:
        "def confidence_label(score):\n    if score <= 2:\n        return 'low'\n    elif score == 3:\n        return 'steady'\n    else:\n        return 'strong'\n\nprint(confidence_label(4))",
    },
    reflectionPrompts: [
      "How does return differ from print?",
      "What is one future task you could package as a function?",
    ],
  },
  {
    id: "day-6-lists",
    day: 6,
    module: "Data Structures",
    conceptId: "lists",
    title: "Lists and Small Collections",
    focus: "Store multiple related values and process them with loops.",
    minutes: 45,
    warmup: [
      "What does a function return do?",
      "What would be awkward about storing five scores in five separate variables?",
    ],
    lesson: [
      "A list stores ordered values in one variable.",
      "Use square brackets to create a list: scores = [3, 4, 5].",
      "Indexes start at 0, so scores[0] is the first item.",
      "Loops and lists work together when you want to process a collection.",
    ],
    workedExample: {
      prompt: "Trace how total changes.",
      code: "scores = [3, 4, 5]\ntotal = 0\nfor score in scores:\n    total = total + score\nprint(total)",
      explanation:
        "The loop visits 3, then 4, then 5. The total becomes 3, then 7, then 12.",
    },
    guidedPractice: {
      prompt:
        "Create a list of three study topics. Use a loop to print each topic with the words 'Review:'.",
      expected:
        "The code should create a list of strings and loop through it.",
      hints: [
        "topics = ['variables', 'types', 'if statements']",
        "Use for topic in topics:",
        "Print the label and topic together.",
      ],
      commonMistakes: [
        "Forgetting commas between list items.",
        "Trying to access an index that does not exist.",
      ],
      solution:
        "topics = ['variables', 'types', 'if statements']\nfor topic in topics:\n    print('Review:', topic)",
    },
    challenge: {
      prompt:
        "Given confidences = [2, 5, 3, 4], count how many are at least 4 and print the count.",
      expected:
        "The solution should loop through the list, use a conditional, and update a count.",
      hints: [
        "Start count = 0 before the loop.",
        "Inside the loop, check if confidence >= 4.",
        "Increment with count = count + 1.",
      ],
      commonMistakes: [
        "Resetting count inside the loop.",
        "Using the list variable where the item variable is needed.",
      ],
      solution:
        "confidences = [2, 5, 3, 4]\ncount = 0\nfor confidence in confidences:\n    if confidence >= 4:\n        count = count + 1\nprint('Strong topics:', count)",
    },
    reflectionPrompts: [
      "When is a list better than separate variables?",
      "What part of list indexing feels least automatic so far?",
    ],
  },
  {
    id: "day-7-mini-project",
    day: 7,
    module: "Project Practice",
    conceptId: "study-planner-project",
    title: "Mini Project: Study Planner",
    focus: "Combine variables, input, conditionals, loops, functions, and lists.",
    minutes: 45,
    warmup: [
      "Name the six ideas you practiced this week.",
      "Pick the one that deserves extra review today.",
    ],
    lesson: [
      "Projects help you interleave skills, which strengthens transfer.",
      "Start by naming the data your program needs.",
      "Then write one small function at a time.",
      "Use print-based feedback to verify each step before adding more.",
    ],
    workedExample: {
      prompt: "Notice how the function keeps one decision isolated.",
      code: "def plan_for(confidence):\n    if confidence <= 2:\n        return 'review notes'\n    elif confidence == 3:\n        return 'do guided practice'\n    else:\n        return 'try a challenge'\n\nprint(plan_for(2))",
      explanation:
        "The function turns a confidence score into a study action. That small reusable decision can power a larger planner.",
    },
    guidedPractice: {
      prompt:
        "Write a function that accepts a topic and confidence, then returns a sentence recommending review, practice, or challenge.",
      expected:
        "The function should use a conditional and include the topic in the returned sentence.",
      hints: [
        "Use def recommend(topic, confidence):",
        "Use confidence <= 2 for review.",
        "Return strings that include topic with commas or f-strings.",
      ],
      commonMistakes: [
        "Trying to do the whole project before the function works.",
        "Mixing string and number concatenation without conversion.",
      ],
      solution:
        "def recommend(topic, confidence):\n    if confidence <= 2:\n        return 'Review ' + topic\n    elif confidence == 3:\n        return 'Practice ' + topic\n    else:\n        return 'Challenge yourself with ' + topic\n\nprint(recommend('loops', 4))",
    },
    challenge: {
      prompt:
        "Create topics = ['variables', 'conditionals', 'loops'] and confidences = [5, 2, 3]. Loop through them by index and print a recommendation for each.",
      expected:
        "The solution should combine a function, two lists, range(len(topics)), and a loop.",
      hints: [
        "Reuse the recommend function.",
        "for index in range(len(topics)):",
        "topic = topics[index] and confidence = confidences[index].",
      ],
      commonMistakes: [
        "Looping over topics but not getting the matching confidence.",
        "Forgetting that indexes start at 0.",
      ],
      solution:
        "def recommend(topic, confidence):\n    if confidence <= 2:\n        return 'Review ' + topic\n    elif confidence == 3:\n        return 'Practice ' + topic\n    else:\n        return 'Challenge yourself with ' + topic\n\ntopics = ['variables', 'conditionals', 'loops']\nconfidences = [5, 2, 3]\nfor index in range(len(topics)):\n    print(recommend(topics[index], confidences[index]))",
    },
    reflectionPrompts: [
      "Which concept became more connected during the project?",
      "What is one small project you want to build next?",
    ],
  },
];
