import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';

/* Idea schemas and types 
  - ideaId: unique identifier for the idea
  - description: description of the idea
  - timeComplexity: time complexity of the idea
  - spaceComplexity: space complexity of the idea
*/

export const createIdeaSchema = z.object({
  description: z.string().min(1, "Description is required"),
  timeComplexity: z.string(),
  spaceComplexity: z.string(),
});

export const ideaSchema = createIdeaSchema.extend({
  ideaId: z.string().uuid(),
});

export const updateIdeaSchema = createIdeaSchema.partial();

export type Idea = z.infer<typeof ideaSchema>;
export type CreateIdea = z.infer<typeof createIdeaSchema>;
export type UpdateIdea = z.infer<typeof updateIdeaSchema>;

export const createEmptyIdea = (): Idea => ({
  ideaId: uuidv4(),
  description: '',
  timeComplexity: '',
  spaceComplexity: '',
});

/* Canvas schemas and types 
  - canvasId: unique identifier for the canvas
  - problemName: name of the problem
  - problemUrl: url of the problem
  - constraints: constraints of the problem
  - ideas: array of ideas
  - testCases: test cases of the problem
  - code: code of the problem
  - language: language of the problem
*/

export enum Language {
    JAVASCRIPT = "javascript",
    PYTHON = "python",
    JAVA = "java",
    CSHARP = "csharp",
    CPP = "cpp",
    GO = "go",
    RUST = "rust",
    SWIFT = "swift",
    KOTLIN = "kotlin",
    RUBY = "ruby",
    PHP = "php",
    SCALA = "scala",
    R = "r",
    DART = "dart",
    TYPESCRIPT = "typescript",
}

export const languageSchema = z.enum([Language.PYTHON, Language.JAVASCRIPT, Language.TYPESCRIPT, Language.JAVA, Language.CSHARP, Language.CPP, Language.GO, Language.RUST, Language.SWIFT, Language.KOTLIN, Language.RUBY, Language.PHP, Language.SCALA, Language.R, Language.DART]);


// Canvas schemas and types
export const createCanvasSchema = z.object({
  problemName: z.string().min(2, {
    message: "Problem Name must be at least 2 characters.",
  }),
  problemUrl: z.string().url({ message: "Invalid url" }).optional(),
  canvasId: z.string().uuid().optional(),
});

export const canvasSchema = createCanvasSchema.extend({
  canvasId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  constraints: z.string().default(''),
  ideas: z.array(ideaSchema).default([]),
  testCases: z.string().default(''),
  code: z.string().default(''),
  language: languageSchema.default(Language.PYTHON),
});

export const updateCanvasSchema = canvasSchema.omit({
    canvasId: true,
    createdAt: true,
    updatedAt: true,
    ideas: true,
}).partial();


export type Canvas = z.infer<typeof canvasSchema>;
export type CreateCanvas = z.infer<typeof createCanvasSchema>;
export type UpdateCanvas = z.infer<typeof updateCanvasSchema>;

// Empty canvas object for initialization
export const createEmptyCanvas = (): Canvas => ({
  canvasId: uuidv4(),
  problemName: '',
  problemUrl: '',
  constraints: '',
  ideas: [],
  testCases: '',
  code: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  language: Language.PYTHON,
});