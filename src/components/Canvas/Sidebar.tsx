import {
    Box,
    Flex,
    Heading,
    Text,
    VStack,
    Badge,
} from "@chakra-ui/react";
import { Tooltip } from "../../components/ui/tooltip"
import { useColorModeValue } from "../../components/ui/color-mode"
import { Separator } from "@chakra-ui/react"
import AddCanvas from "./AddCanvas";
import { CanvasActionsMenu } from "./CanvasActionsMenu";
import { Canvas, emptyCanvas } from "../../types";

interface SidebarProps {
    canvases: Canvas[];
    currentCanvasId: number;
    addNewCanvas: (problemName: string, problemUrl: string) => void;
    switchCanvas: (id: number) => void;
    deleteCanvas: (id: number) => void;
    editCanvas: (id: number, problemName: string, problemUrl: string) => void;
}

export const Sidebar = ({
    canvases,
    currentCanvasId: currentCanvasIndex,
    addNewCanvas,
    switchCanvas,
    deleteCanvas,
    editCanvas
}: SidebarProps) => {
    // Add an empty canvas if no canvases exist
    if (canvases.length === 0) {
        canvases.push({...emptyCanvas, problemName: "Untitled Canvas"});
    }

    const bgColor = useColorModeValue("gray.50", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const headerBgColor = useColorModeValue("white", "gray.900");
    const activeCanvasBg = useColorModeValue("blue.50", "blue.900");
    const hoverBg = useColorModeValue("gray.100", "gray.700");

    return (
        <Flex
            direction="column"
            w="64"
            h="100vh"
            bg={bgColor}
            borderRightWidth="1px"
            borderColor={borderColor}
            shadow="sm"
        >
            {/* Header */}
            <Box
                px="4"
                py="3"
                bg={headerBgColor}
                borderBottomWidth="1px"
                borderColor={borderColor}
                shadow="sm"
            >
                <Heading size="md" fontWeight="semibold" color="blue.600">
                    Canvases
                </Heading>
            </Box>

            {/* Add New Button */}
            <Box w="100%" p="4">
                <AddCanvas addNewCanvas={addNewCanvas} />
            </Box>

            <Separator /> 

            {/* Canvas Count */}
            <Flex px="4" py="2" justify="space-between" align="center">
                <Text fontSize="sm" color="gray.500" fontWeight="medium">
                    Your Canvases
                </Text>
                <Badge colorScheme="blue" borderRadius="full" px="2">
                    {canvases.length}
                </Badge>
            </Flex>

            {/* Canvas List */}
            <VStack
                flex="1"
                overflowY="auto"
                // spacing="1"
                align="stretch"
                px="2"
                py="2"
            >
                {canvases.map((canvas, index) => (
                    <Tooltip
                        key={canvas.id}
                        content={canvas.problemUrl || "No URL provided"}
                    >
                        <Box
                            p="3"
                            borderRadius="md"
                            cursor="pointer"
                            bg={index === currentCanvasIndex ? activeCanvasBg : 'transparent'}
                            _hover={{ bg: hoverBg }}
                            onClick={() => switchCanvas(index)}
                            borderLeftWidth={index === currentCanvasIndex ? "4px" : "0"}
                            borderLeftColor="blue.500"
                            transition="all 0.2s"
                        >
                            <Flex justify="space-between" align="center">
                                <Flex align="center">
                                    <Text
                                        fontWeight={index === currentCanvasIndex ? "medium" : "normal"}
                                    >
                                        {canvas.problemName}
                                    </Text>
                                </Flex>
                                <Box>
                                    <CanvasActionsMenu
                                        updateCanvas={editCanvas}
                                        deleteCanvas={deleteCanvas}
                                        canvas={canvas}
                                    />
                                </Box>
                            </Flex>
                        </Box>
                    </Tooltip>
                ))}
            </VStack>
        </Flex>
    );
};