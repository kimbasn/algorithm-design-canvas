// import { useCanvas } from '../../hooks/useCanvas';
// import { useCanvasContext } from '../../context/CanvasContext';
// import { type Idea } from '@/types/canvas';
// import { useState, useEffect } from 'react';
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Plus, Minus, Save } from "lucide-react";

import CanvasSection from './CanvasSection';
import CodeEditor from './CodeEditor';
export default function Canvas() {
    // const { currentCanvas } = useCanvasContext();
    // const {
    //     canvas,
    //     loading,
    //     updateCanvas,
    //     addIdea,
    //     updateIdea,
    //     deleteIdea
    // } = useCanvas(currentCanvas?.canvasId ?? '');

    // const [constraints, setConstraints] = useState('');
    // const [testCases, setTestCases] = useState('');
    // const [code, setCode] = useState('');
    // const [ideas, setIdeas] = useState<Idea[]>([]);
    // const [isEditing, setIsEditing] = useState({
    //     constraints: false,
    //     testCases: false,
    //     code: false
    // });

    // Initialize state when canvas data loads
    // useEffect(() => {
    //     if (canvas) {
    //         setConstraints(canvas.constraints ?? '');
    //         setTestCases(canvas.testCases ?? '');
    //         setCode(canvas.code ?? '');
    //         setIdeas(canvas.ideas ?? []);
    //     }
    // }, [canvas]);

    // if (loading) {
    //     return <div className="flex items-center justify-center h-full">Loading...</div>
    // }

    // if (!canvas) {
    //     return <div className="flex items-center justify-center h-full">Canvas not found</div>
    // }

    // const handleSaveConstraints = () => {
    //     updateCanvas({ constraints });
    //     setIsEditing({ ...isEditing, constraints: false });
    // };

    // const handleSaveTestCases = () => {
    //     updateCanvas({ testCases });
    //     setIsEditing({ ...isEditing, testCases: false });
    // };

    // const handleSaveCode = () => {
    //     updateCanvas({ code });
    //     setIsEditing({ ...isEditing, code: false });
    // };

    // const handleIdeaChange = (ideaId: string, field: keyof Idea, value: string) => {
    //     const updatedIdeas = ideas.map(idea =>
    //         idea.ideaId === ideaId ? { ...idea, [field]: value } : idea
    //     );
    //     setIdeas(updatedIdeas);
    // };

    // const handleSaveIdea = (ideaId: string) => {
    //     const idea = ideas.find(i => i.ideaId === ideaId);
    //     if (idea) {
    //         updateIdea(ideaId, { description: idea.description, timeComplexity: idea.timeComplexity, spaceComplexity: idea.spaceComplexity });
    //     }
    // };

    // const handleAddIdea = () => {
    //     const newIdea: Omit<Idea, 'ideaId'> = {
    //         description: '',
    //         timeComplexity: '',
    //         spaceComplexity: ''
    //     };
    //     addIdea(newIdea);
    // };

    // const handleDeleteIdea = (ideaId: string) => {
    //     deleteIdea(ideaId);
    // };

    return (
        <div className="flex gap-4 p-4 h-screen box-border">
            <div className="w-[350px] min-w-[300px] flex-shrink-0">
                <div className="bg-white rounded-xl shadow-md transition-all duration-300 ease-in-out h-[calc(100vh-2rem)] overflow-hidden hover:shadow-lg flex flex-col">
                    {/* Constraints Section */}
                    <CanvasSection title="Constraints" placeholder="Enter constraints here..." icon={<i className="fas fa-list-check mr-2"></i>} />

                    {/* <!-- Ideas Section --> */}
                    <CanvasSection title="Ideas" placeholder="Enter ideas here..." icon={<i className="fas fa-lightbulb mr-2"></i>} />                    

                    {/* <!-- Test Cases Section --> */}
                    <CanvasSection title="Test Cases" placeholder="Enter test cases here..." icon={<i className="fas fa-vial mr-2"></i>} />
                </div>
            </div>

            {/* Resize Handle */}
            {/* <div className="w-1.5 bg-gray-200 cursor-col-resize transition-colors duration-200 hover:bg-blue-500"></div> */}

            {/* Main Code Editor */}
            <CodeEditor />
        </div>
    );
}