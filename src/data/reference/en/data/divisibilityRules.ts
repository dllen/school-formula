// divisibilityRules

export const DIVISIBILITY_RULES_ROWS: string[][] = [
    ["2", "Last digit is even (0, 2, 4, 6 or 8)."],
    ["3", "Sum of digits is a multiple of 3."],
    ["4", "Last two digits form a multiple of 4."],
    ["5", "Last digit is 0 or 5."],
    ["6", "Divisible by both 2 and 3."],
    ["7", "Double the last digit, subtract from the rest; result is a multiple of 7."],
    ["8", "Last three digits form a multiple of 8."],
    ["9", "Sum of digits is a multiple of 9."],
    ["10", "Last digit is 0."],
    ["11", "Difference between sums of alternating digits is a multiple of 11."],
    ["12", "Divisible by both 3 and 4."],
  ];
