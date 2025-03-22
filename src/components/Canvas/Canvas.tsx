import { useCanvas } from '../../hooks/useCanvas';
import { useCanvasContext } from '../../context/CanvasContext';
import { type Idea } from '@/types/canvas';
import { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Save } from "lucide-react";

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

    const handleIdeaChange = (ideaId: string, field: keyof Idea, value: string) => {
        const updatedIdeas = ideas.map(idea =>
            idea.ideaId === ideaId ? { ...idea, [field]: value } : idea
        );
        setIdeas(updatedIdeas);
    };

    const handleSaveIdea = (ideaId: string) => {
        const idea = ideas.find(i => i.ideaId === ideaId);
        if (idea) {
            updateIdea(ideaId, { description: idea.description, timeComplexity: idea.timeComplexity, spaceComplexity: idea.spaceComplexity });
        }
    };

    const handleAddIdea = () => {
        const newIdea: Omit<Idea, 'ideaId'> = {
            description: '',
            timeComplexity: '',
            spaceComplexity: ''
        };
        addIdea(newIdea);
    };

    const handleDeleteIdea = (ideaId: string) => {
        deleteIdea(ideaId);
    };

    return (
        <div className="flex flex-1 flex-row gap-4 p-4 h-full">
            <div className="grid auto-rows-min gap-4 md:grid-rows-3 w-1/2">
                <div className="rounded-xl bg-muted/50 p-4 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold">Constraints</h2>
                        {isEditing.constraints ? (
                            <Button size="sm" onClick={handleSaveConstraints}>
                                <Save className="h-4 w-4 mr-2" />
                                Save
                            </Button>
                        ) : (
                            <Button size="sm" variant="ghost" onClick={() => setIsEditing({ ...isEditing, constraints: true })}>
                                Edit
                            </Button>
                        )}
                    </div>
                    {isEditing.constraints ? (
                        <Textarea
                            className="flex-1 resize-none"
                            value={constraints}
                            onChange={(e) => setConstraints(e.target.value)}
                        />
                    ) : (
                        <div className="whitespace-pre-wrap">{constraints}</div>
                    )}
                </div>

                <div className="rounded-xl bg-muted/50 p-4 flex flex-col h-full overflow-y-auto">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold">Ideas</h2>
                        <Button size="sm" onClick={handleAddIdea}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Idea
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {ideas.map((idea: Idea) => (
                            <div key={idea.ideaId} className="border rounded p-3 space-y-2">
                                <div className="flex flex-col space-y-1">
                                    <label className="text-sm font-medium">Description:</label>
                                    <Textarea
                                        rows={2}
                                        value={idea.description}
                                        onChange={(e) => handleIdeaChange(idea.ideaId, 'description', e.target.value)}
                                        onBlur={() => handleSaveIdea(idea.ideaId)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="text-sm font-medium">Time Complexity:</label>
                                    <Textarea
                                        rows={1}
                                        value={idea.timeComplexity}
                                        onChange={(e) => handleIdeaChange(idea.ideaId, 'timeComplexity', e.target.value)}
                                        onBlur={() => handleSaveIdea(idea.ideaId)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="text-sm font-medium">Space Complexity:</label>
                                    <Textarea
                                        rows={1}
                                        value={idea.spaceComplexity}
                                        onChange={(e) => handleIdeaChange(idea.ideaId, 'spaceComplexity', e.target.value)}
                                        onBlur={() => handleSaveIdea(idea.ideaId)}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDeleteIdea(idea.ideaId)}
                                    >
                                        <Minus className="h-4 w-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl bg-muted/50 p-4 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold">Test Cases</h2>
                        {isEditing.testCases ? (
                            <Button size="sm" onClick={handleSaveTestCases}>
                                <Save className="h-4 w-4 mr-2" />
                                Save
                            </Button>
                        ) : (
                            <Button size="sm" variant="ghost" onClick={() => setIsEditing({ ...isEditing, testCases: true })}>
                                Edit
                            </Button>
                        )}
                    </div>
                    {isEditing.testCases ? (
                        <Textarea
                            className="flex-1 resize-none"
                            value={testCases}
                            onChange={(e) => setTestCases(e.target.value)}
                        />
                    ) : (
                        <div className="whitespace-pre-wrap">{testCases}</div>
                    )}
                </div>
            </div>

            <div className="flex-1 rounded-xl bg-muted/50 p-4 flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">Code</h2>
                    {isEditing.code ? (
                        <Button size="sm" onClick={handleSaveCode}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                        </Button>
                    ) : (
                        <Button size="sm" variant="ghost" onClick={() => setIsEditing({ ...isEditing, code: true })}>
                            Edit
                        </Button>
                    )}
                </div>
                <div className="flex-1">
                    {isEditing.code ? (
                        <Textarea
                            className="h-full resize-none font-mono"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    ) : (
                        <div className="whitespace-pre-wrap font-mono overflow-auto h-full">{code}</div>
                    )}
                </div>
            </div>
        </div>
    );
}