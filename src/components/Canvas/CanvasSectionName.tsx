import { Box, Text } from '@chakra-ui/react'
import { useColorModeValue } from "../../components/ui/color-mode";

interface CanvasSectionNameProps {
    fieldName: string;
}



export const CanvasSectionName = ({ fieldName }: CanvasSectionNameProps) => {
    const headerBg = useColorModeValue("gray.100", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    return (
        <Box
            bg={headerBg}
            position={"sticky"}
            top={"0"}
            zIndex="1"
            p="2"
            border={"1px solid"}
            borderColor={borderColor}>
            <Text fontWeight="bold" >{fieldName}</Text>
        </Box>
    );
};