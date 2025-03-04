import React, { useState, useRef } from "react";
import {
    Box,
    Table,
    Icon,
    Text,
    Flex,
} from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useColorModeValue } from "../../components/ui/color-mode";

interface Idea {
    id: number;
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
}

interface IdeasProps {
    initialIdeas?: Idea[];
    onRowsChange?: (rows: Idea[]) => void;
    minLines?: number;
}

const TestCases: React.FC<IdeasProps> = ({
    initialIdeas: initialRows = [],
    onRowsChange,
    minLines = 3 // Default minimum lines for idea descriptions
}) => {
    const [ideas, setIdeas] = useState<Idea[]>(initialRows.length > 0 ? initialRows : [
        { id: Date.now(), description: "", timeComplexity: "", spaceComplexity: "" }
    ]);

    // Refs for each cell that needs cursor control
    const cellRefs = useRef<Map<string, HTMLTableCellElement>>(new Map());

    const borderColor = useColorModeValue("gray.200", "gray.700");
    const headerBg = useColorModeValue("gray.100", "gray.700");

    // Calculate the minimum height based on line height
    const lineHeight = 1.5; // Standard line height
    const minHeight = `${minLines * lineHeight}em`;
    const minComplexityHeight = "1.5em"; // Single line for complexity cells

    const addIdea = () => {
        const newIdea = {
            id: Date.now(),
            description: "",
            timeComplexity: "",
            spaceComplexity: ""
        };
        const updatedIdeas = [...ideas, newIdea];
        setIdeas(updatedIdeas);
        if (onRowsChange) onRowsChange(updatedIdeas);
    };

    const removeIdea = (id: number) => {
        if (ideas.length <= 1) return;
        const updatedIdeas = ideas.filter(idea => idea.id !== id);
        setIdeas(updatedIdeas);
        if (onRowsChange) onRowsChange(updatedIdeas);
    };

    // const updateIdea = (id: number, field: keyof Idea, value: string) => {
    //     const updatedIdeas = ideas.map(idea => {
    //         if (idea.id === id) {
    //             return { ...idea, [field]: value };
    //         }
    //         return idea;
    //     });
    //     setIdeas(updatedIdeas);
    //     if (onRowsChange) onRowsChange(updatedIdeas);
    // };

    const handleCellClick = (element: HTMLTableCellElement) => {
        // Focus on the cell
        element.focus();

        // Position cursor at the beginning of the content
        const selection = window.getSelection();
        const range = document.createRange();

        if (selection && element.firstChild) {
            range.setStart(element.firstChild, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        } else if (selection) {
            // If no child nodes (empty cell), just focus
            element.focus();
        }
    };

    const setCellRef = (element: HTMLTableCellElement | null, id: number, field: string) => {
        if (element) {
            cellRefs.current.set(`${id}-${field}`, element);
        }
    };

    return (
        <Box borderWidth="1px" borderColor={borderColor} borderRadius="md" overflow="hidden">
            <Table.Root variant="outline" size="md" style={{ width: "100%" }}>
                <Table.Header bg={headerBg}>
                    <Table.Row>
                        <Table.Cell colSpan={3} align="center">
                            <Flex align="center">
                                <Text>Test Cases</Text>
                                <Icon
                                    onClick={addIdea}
                                    as={FaPlus}
                                    mr={2}
                                    boxSize={4}
                                    cursor="pointer"
                                />
                            </Flex>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell width="60%">
                            <Flex align="center">
                                <Text>Input</Text>
                            </Flex>
                        </Table.Cell>
                        <Table.Cell width="40%">Output</Table.Cell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {ideas.map((idea) => (
                        <React.Fragment key={idea.id}>
                            <Table.Row>
                                <Table.Cell
                                    p={2}
                                    borderRight="1px solid"
                                    borderColor={borderColor}
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                    ref={(el) => setCellRef(el, idea.id, 'description')}
                                    onClick={(e) => handleCellClick(e.currentTarget)}
                                    //onInput={(e) => updateIdea(idea.id, 'description', e.currentTarget.textContent || "")}
                                    style={{
                                        minHeight: minHeight,
                                        verticalAlign: "top",
                                        whiteSpace: "pre-wrap",
                                        outline: "none"
                                    }}
                                >
                                    {idea.description}
                                </Table.Cell>
                                <Table.Cell
                                    p={2}
                                    borderBottom="1px solid"
                                    borderColor={borderColor}
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                    ref={(el) => setCellRef(el, idea.id, 'timeComplexity')}
                                    onClick={(e) => handleCellClick(e.currentTarget)}
                                    //onInput={(e) => updateIdea(idea.id, 'timeComplexity', e.currentTarget.textContent || "")}
                                    style={{
                                        minHeight: minComplexityHeight,
                                        verticalAlign: "top",
                                        whiteSpace: "pre-wrap",
                                        outline: "none"
                                    }}
                                >
                                    {idea.timeComplexity}
                                </Table.Cell>
                                <Table.Cell width="5%" p={0}>
                                    <Icon
                                        as={FaTrash}
                                        boxSize={3}
                                        color="red.500"
                                        cursor={ideas.length > 1 ? "pointer" : "not-allowed"}
                                        opacity={ideas.length > 1 ? 1 : 0.5}
                                        onClick={() => ideas.length > 1 && removeIdea(idea.id)}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        </React.Fragment>
                    ))}
                </Table.Body>
            </Table.Root>
        </Box>
    );
};

export default TestCases;