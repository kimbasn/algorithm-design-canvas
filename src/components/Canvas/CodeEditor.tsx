import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Code } from "lucide-react";
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
];

export default function CodeEditor() {
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState("");
    const editorRef = useRef(null);
    const { theme } = useTheme();

    const handleRun = () => {
        // TODO: Implement code execution
        console.log("Running code:", code);
    };

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
    };

    const handleEditorChange = (value: string | undefined) => {
        setCode(value || "");
    };

    return (
        <div className={cn(
            "flex flex-col h-full w-full rounded-lg shadow-sm",
            "bg-white dark:bg-gray-900",
            "border border-gray-200 dark:border-gray-700"
        )}>
            <div className={cn(
                "flex items-center justify-between px-4 py-3",
                "border-b border-gray-200 dark:border-gray-700",
                "bg-gray-50/50 dark:bg-gray-800/50"
            )}>
                <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">Code</span>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-[120px] h-8">
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
                    <Button
                        size="sm"
                        onClick={handleRun}
                        className="h-8"
                    >
                        <Play className="h-4 w-4 mr-2" />
                        Run
                    </Button>
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    language={language}
                    defaultValue=""
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        readOnly: false,
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