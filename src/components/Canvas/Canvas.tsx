import { useCanvas } from '../../hooks/useCanvas';
import { useCanvasContext } from '../../context/CanvasContext';
import { type Idea } from '@/types/canvas';
import { useState, useEffect } from 'react';

import CanvasSection from './CanvasSection';
import IdeasSection from './IdeasSection';
import CodeEditor from './CodeEditor';
import { cn } from '@/lib/utils';

export default function Canvas() {
    const { currentCanvas } = useCanvasContext();
    const {
        canvas,
        loading,
    } = useCanvas(currentCanvas?.canvasId ?? '');

    const [, setConstraints] = useState('');
    const [, setTestCases] = useState('');
    const [, setCode] = useState('');
    const [, setIdeas] = useState<Idea[]>([]);


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

    return (
        <div className="flex flex-col lg:flex-row gap-4 p-4 h-[calc(100vh-3.5rem)] w-full box-border overflow-hidden">
            <div className="w-full lg:w-[350px] lg:min-w-[300px] lg:flex-shrink-0 h-[40vh] lg:h-full">
                <div className={cn(
                    "rounded-xl shadow-md transition-all duration-300 ease-in-out h-full overflow-hidden hover:shadow-lg flex flex-col",
                    "bg-white dark:bg-[#1f2937]",
                    "border border-gray-200 dark:border-gray-700"
                )}>
                    {/* Constraints Section */}
                    <CanvasSection sectionName="constraints" placeholder="Enter constraints here..." icon={<i className="fas fa-list-check mr-2"></i>} />

                    {/* Ideas Section */}
                    <IdeasSection title="Ideas" icon={<i className="fas fa-lightbulb mr-2"></i>} />

                    {/* Test Cases Section */}
                    <CanvasSection sectionName="testCases" placeholder="Enter test cases here..." icon={<i className="fas fa-vial mr-2"></i>} />
                </div>
            </div>

            {/* Main Code Editor */}
            <div className="flex-1 h-[60vh] lg:h-full w-full overflow-hidden">
                <CodeEditor />
            </div>
        </div>
    );
}