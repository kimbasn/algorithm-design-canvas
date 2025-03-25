import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RotateCcw } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

import { Language } from "@/types/canvas";
import { useCanvasContext } from "@/context/CanvasContext";

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
    const { currentCanvas, updateCanvas } = useCanvasContext();
    const [language, setLanguage] = useState<Language>(() => {
        const canvasLang = currentCanvas?.language;
        return canvasLang && Object.values(Language).includes(canvasLang as Language)
            ? canvasLang as Language
            : Language.PYTHON;
    });
    // const [isRunning, setIsRunning] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
    const { theme } = useTheme();

    // const handleRun = async () => {
    //     if (!currentCanvas?.canvasId) return;

    //     setIsRunning(true);
    //     setIsLoading(true);
    //     try {
    //         // TODO: Implement code execution logic
    //         await new Promise(resolve => setTimeout(resolve, 1000));
    //     } catch (error) {
    //         console.error('Code execution failed:', error);
    //     } finally {
    //         setIsRunning(false);
    //         setIsLoading(false);
    //     }
    // };

    const handleEditorMount = useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;
    }, []);

    const handleEditorChange = useCallback((value: string | undefined) => {
        if (!currentCanvas?.canvasId) return;
        try {
            updateCanvas(currentCanvas.canvasId, { code: value || "" });
        } catch (error) {
            console.error('Failed to update code:', error);
        }
    }, [currentCanvas?.canvasId, updateCanvas]);

    const handleReset = useCallback(() => {
        if (editorRef.current) {
            editorRef.current.setValue('');
            handleEditorChange('');
        }
    }, [handleEditorChange]);

    useEffect(() => {
        if (!currentCanvas?.canvasId) return;
        try {
            updateCanvas(currentCanvas.canvasId, { language });
        } catch (error) {
            console.error('Failed to update language:', error);
        }
    }, [language, currentCanvas?.canvasId, updateCanvas]);

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
                    <Select
                        value={language}
                        onValueChange={(value) => setLanguage(value as Language)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.sort((a, b) => a.label.localeCompare(b.label)).map((lang) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                    {lang.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    {/* <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRun}
                        disabled={isRunning || isLoading}
                        className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {isRunning ? (
                            <Pause className="h-4 w-4" />
                        ) : (
                            <Play className="h-4 w-4" />
                        )}
                    </Button> */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleReset}
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
                    language={language}
                    value={currentCanvas?.code}
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
                        ...(theme === "dark" ? {
                            backgroundColor: "#1f2937",
                            foreground: "#f3f4f6",
                        } : {
                            backgroundColor: "#ffffff",
                            foreground: "#111827",
                        }),
                    }}
                />
            </div>
        </div>
    );
}