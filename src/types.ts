/**
 * Represents a canvas for designing algorithms.
 */
export interface Canvas {
  id: number;
  problemName: string;
  problemUrl: string;
  constraints: string;
  ideas: Idea[];
  testCases: string;
  code: string;
}

function generateUniqueId(): number {
  return  Date.now();
}

/**
 * Represents an idea for solving a problem.
 */
export interface Idea {
  id: number;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export const emptyIdea: Idea = {
  id: generateUniqueId(),
  description: '',
  timeComplexity: '',
  spaceComplexity: '',
}

/**
 * Represents a test case for the problem.
 */
export interface TestCase {
  id: number;
  input: string;
  output: string;
}

export const emptyTestCase: TestCase = {
  id: generateUniqueId(),
  input: '',
  output: ''
}

export const emptyCanvas: Canvas = {
  id: generateUniqueId(),
  problemName: 'Untitled Canvas',
  problemUrl: '',
  constraints: '',
  ideas: [emptyIdea],
  testCases: '',
  code: ''
};
