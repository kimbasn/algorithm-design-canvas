import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "ruby", label: "Ruby" },
    { value: "php", label: "PHP" },
    { value: "scala", label: "Scala" },
    { value: "r", label: "R" },
    { value: "dart", label: "Dart" },
    { value: "typescript", label: "TypeScript" },
];

export default function CodeEditor() {
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const editorRef = useRef(null);
    const { theme } = useTheme();

    const handleRun = () => {
        setIsRunning(true);
        // TODO: Implement code execution logic
        setTimeout(() => setIsRunning(false), 1000);
    };

    const handleEditorMount = (editor: any) => {
        editorRef.current = editor;
    };

    const handleEditorChange = (value: string | undefined) => {
        setCode(value || "");
    };

    return (
        <div className={cn(
            "flex flex-col h-full w-full rounded-xl shadow-md transition-all duration-300 ease-in-out",
            "bg-white dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700",
            "overflow-hidden"
        )}>
            <div className={cn(
                "px-4 py-3 flex justify-between items-center",
                "border-b border-gray-200 dark:border-gray-700",
                "bg-gray-50/50 dark:bg-gray-800/50"
            )}>
                <div className="flex items-center gap-4">
                    <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map((lang) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                    {lang.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRun}
                        disabled={isRunning}
                        className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {isRunning ? (
                            <Pause className="h-4 w-4" />
                        ) : (
                            <Play className="h-4 w-4" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCode('')}
                        className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="flex-1 w-full overflow-hidden">
                <Editor
                    height="100%"
                    width="100%"
                    defaultLanguage={language}
                    defaultValue={code}
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    onMount={handleEditorMount}
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        readOnly: false,
                        cursorStyle: 'line',
                        automaticLayout: true,
                        tabSize: 4,
                        wordWrap: "on",
                        scrollbar: {
                            vertical: "visible",
                            horizontal: "visible",
                            useShadows: false,
                            verticalScrollbarSize: 10,
                            horizontalScrollbarSize: 10,
                            arrowSize: 30,
                        },
                        // Theme-specific options
                        ...(theme === "dark" ? {
                            backgroundColor: "#1f2937", // dark:bg-gray-800
                            foreground: "#f3f4f6", // dark:text-gray-100
                        } : {
                            backgroundColor: "#ffffff",
                            foreground: "#111827", // text-gray-900
                        }),
                    }}
                />
            </div>
        </div>
    );
}