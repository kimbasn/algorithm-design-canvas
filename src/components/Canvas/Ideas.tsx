import React, { useCallback } from "react";
import {
    Box,
    Table,
    Icon,
    Text,
    Flex,
} from "@chakra-ui/react";
import { debounce } from "lodash";
import { FaPlus } from "react-icons/fa";
import { useColorModeValue } from "../../components/ui/color-mode";
import { Idea, emptyIdea } from "../../types";


interface IdeasProps {
    ideas: Idea[];
    addNewIdea: (idea: Idea) => void;
    removeIdea: (id: number) => void;
    updateIdea: (id: number, field: keyof Idea, value: string) => void;
}

export const Ideas = ({
    ideas,
    addNewIdea,
    updateIdea,
}: IdeasProps) => {
    if (ideas.length === 0) {
        ideas = [emptyIdea];
    }
    const DELAY_BEFORE_SAVE = 500;

    const borderColor = useColorModeValue("gray.200", "gray.700");
    const headerBg = useColorModeValue("gray.100", "gray.700");

    const debouncedUpdateIdea = useCallback(
        debounce((id: number, field: keyof Idea, value: string) => {
            updateIdea(id, field, value);
        }, DELAY_BEFORE_SAVE),
        [updateIdea]
    );

    const handleInput = (id: number, field: keyof Idea, value: string) => {
        debouncedUpdateIdea(id, field, value);
    };

    return (
        <Box borderWidth="1px" borderColor={borderColor} borderRadius="md">
            <Table.ScrollArea borderWidth="1px" rounded="md" height={"500px"}>
                <Table.Root size="sm" style={{ width: "100%" }} stickyHeader>
                    <Table.Header bg={headerBg} style={{ background: headerBg, borderBottom: `1px solid ${borderColor}` }}>
                        <Table.Row bg={headerBg}>
                            <Table.ColumnHeader width={"70%"}>
                                <Flex align="center"  borderColor={borderColor}>
                                    <Text fontWeight={"bold"}>Ideas</Text>
                                    <Icon
                                        onClick={() => addNewIdea({ ...emptyIdea, id: Date.now() })}
                                        as={FaPlus}
                                        mr={2}
                                        boxSize={4}
                                        cursor="pointer"
                                    />
                                </Flex>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader width={"30%"} fontWeight={"bold"} textAlign="end">Complexities</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {ideas.map((idea) => (
                            <React.Fragment key={idea.id}>
                                <Table.Row>
                                    <Table.Cell
                                        rowSpan={2}
                                        p={2}
                                        borderRight="1px solid"
                                        borderColor={borderColor}
                                        contentEditable={true}
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) => handleInput(idea.id, 'description', e.currentTarget.textContent || "")}
                                        style={{
                                            minHeight: "4.5em",
                                            verticalAlign: "top",
                                            //     whiteSpace: "pre-wrap",
                                            wordWrap: "break-word",
                                            wordBreak: "break-word",
                                            outline: "none",
                                            //     position: "relative",
                                            //     maxWidth: "300px"
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
                                        onBlur={(e) => handleInput(idea.id, 'timeComplexity', e.currentTarget.textContent || "")}
                                        style={{
                                            minHeight: "1.5em",
                                            verticalAlign: "top",
                                            whiteSpace: "pre-wrap",
                                            wordWrap: "break-word",
                                            wordBreak: "break-word",
                                            outline: "none",
                                            maxWidth: "150px"
                                        }}
                                    >
                                        {idea.timeComplexity}
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell
                                        p={2}
                                        contentEditable={true}
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) => handleInput(idea.id, 'spaceComplexity', e.currentTarget.textContent || "")}
                                        style={{
                                            minHeight: "1.5em",
                                            verticalAlign: "top",
                                            whiteSpace: "pre-wrap",
                                            wordWrap: "break-word",
                                            wordBreak: "break-word",
                                            outline: "none",
                                            maxWidth: "150px"
                                        }}
                                    >
                                        {idea.spaceComplexity}
                                    </Table.Cell>
                                </Table.Row>
                            </React.Fragment>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
        </Box>
    )
}
