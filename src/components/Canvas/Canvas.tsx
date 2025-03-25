import { useCanvas } from '../../hooks/useCanvas';
import { useCanvasContext } from '../../context/CanvasContext';
import { type Idea } from '@/types/canvas';
import { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Save } from "lucide-react";

import CanvasSection from './CanvasSection';
import IdeasSection from './IdeasSection';
import CodeEditor from './CodeEditor';
import { cn } from '@/lib/utils';

export default function Canvas() {
    const { currentCanvas } = useCanvasContext();
    const {
        canvas,
        loading,
        updateCanvas,
        addIdea,
        updateIdea,
        deleteIdea
    } = useCanvas(currentCanvas?.canvasId ?? '');

    const [constraints, setConstraints] = useState('');
    const [testCases, setTestCases] = useState('');
    const [code, setCode] = useState('');
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isEditing, setIsEditing] = useState({
        constraints: false,
        testCases: false,
        code: false
    });

    // Initialize state when canvas data loads
    useEffect(() => {
        if (canvas) {
            setConstraints(canvas.constraints ?? '');
            setTestCases(canvas.testCases ?? '');
            setCode(canvas.code ?? '');
            setIdeas(canvas.ideas ?? []);
        }
    }, [canvas]);

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>
    }

    if (!canvas) {
        return <div className="flex items-center justify-center h-full">Canvas not found</div>
    }

    const handleSaveConstraints = () => {
        updateCanvas({ constraints });
        setIsEditing({ ...isEditing, constraints: false });
    };

    const handleSaveTestCases = () => {
        updateCanvas({ testCases });
        setIsEditing({ ...isEditing, testCases: false });
    };

    const handleSaveCode = () => {
        updateCanvas({ code });
        setIsEditing({ ...isEditing, code: false });
    };



    return (
        <div className="flex gap-4 p-4 h-full w-full box-border overflow-hidden">
            <div className="w-[350px] min-w-[300px] flex-shrink-0 h-full">
                <div className={cn(
                    "rounded-xl shadow-md transition-all duration-300 ease-in-out h-full overflow-hidden hover:shadow-lg flex flex-col",
                    "bg-white dark:bg-[#1f2937]",
                    "border border-gray-200 dark:border-gray-700"
                )}>
                    {/* Constraints Section */}
                    <CanvasSection sectionName="constraints" placeholder="Enter constraints here..." icon={<i className="fas fa-list-check mr-2"></i>} />

                    {/* Ideas Section */}
                    <IdeasSection title="Ideas" placeholder="Enter ideas here..." icon={<i className="fas fa-lightbulb mr-2"></i>} />

                    {/* Test Cases Section */}
                    <CanvasSection sectionName="testCases" placeholder="Enter test cases here..." icon={<i className="fas fa-vial mr-2"></i>} />
                </div>
            </div>

            {/* Main Code Editor */}
            <div className="flex-1 h-full w-full overflow-hidden">
                <CodeEditor />
            </div>
        </div>
    );
}