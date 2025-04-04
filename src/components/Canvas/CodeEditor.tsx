
import { useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

import { useCanvasContext } from "@/context/CanvasContext";


export default function CodeEditor() {
    const { currentCanvas, updateCanvas } = useCanvasContext();
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
    const { theme } = useTheme();

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

    return (
        <div className={cn(
            "flex flex-col h-full w-full rounded-xl shadow-md transition-all duration-300 ease-in-out",
            "bg-white dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700",
            "overflow-hidden"
        )}>
            <div className={cn(
                "px-4 py-3 font-semibold flex justify-between items-center",
                "border-b border-gray-200 dark:border-gray-700",
                "bg-gray-50/50 dark:bg-[#1f2937]/50"
            )}>
                <div className="flex items-center gap-2">
                    <i className="fas fa-code mr-2"></i>
                    <span className="text-gray-900 dark:text-gray-100">Code</span>
                </div>
            </div>
            <div className="flex-1 w-full overflow-hidden">
                <Editor
                    height="100%"
                    width="100%"
                    value={currentCanvas?.code}
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    onMount={handleEditorMount}
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 16,
                        lineNumbers: "off",
                        roundedSelection: true,
                        scrollBeyondLastLine: false,
                        readOnly: false,
                        cursorStyle: 'line',
                        automaticLayout: true,
                        tabSize: 4,
                        wordWrap: "on",
                        lineHeight: 20, // Better spacing for readability
                        fontFamily: "Courier New, monospace", // Google Docs-style monospaced font
                        autoClosingBrackets: "never", // Helps when typing
                        autoClosingQuotes: "never",
                        occurrencesHighlight: 'off', // No highlight on word selection
                        parameterHints: { enabled: false }, // Disables auto hints
                        suggestOnTriggerCharacters: false, // Mimic plain text environment
                        quickSuggestions: false, // No auto-suggestions
                        acceptSuggestionOnEnter: "off",
                        snippetSuggestions: "none",
                        detectIndentation: false,
                        rulers: [],
                        renderWhitespace: "none",
                        formatOnType: false,
                        formatOnPaste: false,
                        selectionHighlight: false,
                        matchBrackets: "never",
                        bracketPairColorization: { enabled: false },
                        renderLineHighlight: "none",
                        colorDecorators: false,
                        scrollbar: {
                            vertical: "visible",
                            horizontal: "visible",
                            useShadows: false,
                            verticalScrollbarSize: 10,
                            horizontalScrollbarSize: 10,
                            arrowSize: 30,
                        },
                        ...(theme === "dark" ? {
                            backgroundColor: "#1e1e1e", // Dark mode color
                            foreground: "#d4d4d4",
                        } : {
                            backgroundColor: "#ffffff", // Light mode color
                            foreground: "#000000",
                        }),
                    }}
                />
            </div>
        </div>
    );
}