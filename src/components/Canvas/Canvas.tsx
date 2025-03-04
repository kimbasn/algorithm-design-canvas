import { useState, useEffect } from 'react';
import { Grid, Flex, GridItem, Box } from '@chakra-ui/react';

import { CanvasHeader } from './CanvasHeader';
import { Ideas } from './Ideas';
import { Sidebar } from './Sidebar';
import { CodeEditor } from './CodeEditor';
import { TextAreaEditor } from './TextAreaEditor';
import { Canvas, emptyCanvas, Idea, emptyIdea, TestCase} from '../../types';
import { CanvasSectionName } from './CanvasSectionName';

const LOCAL_STORAGE_KEY = 'canvases';

export const CanvasComponent = () => {
    const [canvases, setCanvases] = useState<Canvas[]>(() => {
        const savedCanvases = localStorage.getItem(LOCAL_STORAGE_KEY);
        return savedCanvases ? JSON.parse(savedCanvases) : [emptyCanvas];
    });
    const [currentCanvasIndex, setCurrentCanvasIndex] = useState(0);

    useEffect(() => {
        if (canvases.length === 0) {
            const newCanvas: Canvas = emptyCanvas;
            setCanvases([newCanvas]);
            setCurrentCanvasIndex(0);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([newCanvas]));
        } else {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(canvases));
        }
    }, [canvases]);

    const handleChange = (section: keyof Canvas, value: string | Idea[] | TestCase[]) => {
        setCanvases(prevCanvases => {
            const updatedCanvases = [...prevCanvases];
            updatedCanvases[currentCanvasIndex] = {
                ...updatedCanvases[currentCanvasIndex],
                [section]: value
            };
            return updatedCanvases
        });
    };

    const addNewCanvas = (problemName: string, problemUrl: string) => {
        const newCanvas: Canvas = {
            ...emptyCanvas,
            problemName: problemName,
            problemUrl: problemUrl,
        };
        setCanvases(prevCanvases => [...prevCanvases, newCanvas]);
        setCurrentCanvasIndex(canvases.length);
    };

    const deleteCanvas = (id: number) => {
        setCanvases(prevCanvases => {
            const updatedCanvases = prevCanvases.filter(canvas => canvas.id !== id);
            // canvases is empty after deleting the last canvas
            if (updatedCanvases.length === 0) {
                return [emptyCanvas];
            }
            // If the current canvas is deleted, switch to the next canvas (keep the same index)
            // If the last canvas is deleted, switch to the previous canvas
            if (currentCanvasIndex >= updatedCanvases.length) {
                setCurrentCanvasIndex(updatedCanvases.length - 1);
            }
            return updatedCanvases;
        });
    };

    const editCanvas = (id: number, problemName: string, problemUrl: string) => {
        //console.log(`Editing canvas with id ${id} with name ${problemName} and URL ${problemUrl}`);
        setCanvases(prevCanvases => {
            const canvasIndex = prevCanvases.findIndex(canvas => canvas.id === id);
            if (canvasIndex !== -1) {
                const updatedCanvases = [...prevCanvases];
                updatedCanvases[canvasIndex] = {
                    ...updatedCanvases[canvasIndex],
                    problemName: problemName,
                    problemUrl: problemUrl
                };
                return updatedCanvases;
            }
            return prevCanvases;
        });
    }

    const switchCanvas = (index: number) => {
        setCurrentCanvasIndex(index)
    }

    const addNewIdea = (idea: Idea) => {
        handleChange('ideas', [...canvases[currentCanvasIndex].ideas, idea]);
    }
    const removeIdea = (id: number) => {
        let remainingIdeas = canvases[currentCanvasIndex].ideas.filter(idea => idea.id !== id);
        if (remainingIdeas.length === 0) {
            remainingIdeas = [emptyIdea];
        }
        handleChange('ideas', remainingIdeas);
    }
    const updateIdea = (id: number, field: keyof Idea, value: string) => {
        handleChange('ideas', canvases[currentCanvasIndex].ideas.map(idea => idea.id === id ? { ...idea, [field]: value } : idea));
    };

    const currentCanvas = canvases[currentCanvasIndex]

    return (
        <Flex h="100vh">
            <Sidebar
                canvases={canvases}
                currentCanvasId={currentCanvasIndex}
                addNewCanvas={addNewCanvas}
                switchCanvas={switchCanvas}
                deleteCanvas={deleteCanvas}
                editCanvas={editCanvas}
            />
            <Flex flex="1" direction="column">
                <CanvasHeader selectedCanvas={currentCanvas} />
                <Grid templateColumns="1fr 3fr" flex="1" h="calc(100vh - 64px)">
                    {/* First column taking 1/3 of space */}
                    <GridItem>
                        <Flex direction="column"  h="full">
                            <Box flex={1} overflow={"auto"} h={"100%"} >
                                <CanvasSectionName fieldName={"Constraints"} />
                                <TextAreaEditor
                                    value={currentCanvas.constraints || ''}
                                    onChange={(e) => handleChange('constraints', e.target.value)}
                                    fieldName="Constraints"
                                />
                            </Box>
                            <Box flex={2} overflow={"auto"} >
                                <Ideas
                                    ideas={currentCanvas.ideas}
                                    addNewIdea={addNewIdea}
                                    removeIdea={removeIdea}
                                    updateIdea={updateIdea}
                                />
                            </Box>
                            <Box flex={1} overflow={"auto"} h={"100%"}>
                                <CanvasSectionName fieldName={"Test Cases"} />
                                <TextAreaEditor
                                    value={currentCanvas.testCases || ''}
                                    onChange={(e) => handleChange('testCases', e.target.value)}
                                    fieldName="Test Cases"
                                />
                            </Box>
                        </Flex>
                    </GridItem>

                    {/* Second column taking 2/3 of space */}
                    {/* Code Editor */}
                    <GridItem className="col-span-2 h-full overflow-y-auto">
                        <CodeEditor
                            value={currentCanvas.code || ''}
                            onChange={(value) => handleChange('code', value)}
                        />
                    </GridItem>
                </Grid>
            </Flex>
        </Flex>
    );
};