import { Box, Flex, Heading, Link } from '@chakra-ui/react';
import { Canvas } from '../../types';

interface CanvasHeaderProps {
    selectedCanvas: Canvas;
}

export const CanvasHeader = ({ selectedCanvas }: CanvasHeaderProps) => {
    return (
        <Box borderBottomWidth="1px" borderColor="gray.200">
            <Flex justify="space-between" align="center" bg="white" px="4" py="2">
                <Heading as="h1" size="lg" fontWeight="medium" color="gray.600">
                    The Algorithm Design Canvas
                </Heading>
                <Link
                    href={selectedCanvas?.problemUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="blue.600"
                    _hover={{ color: 'blue.700' }}
                >
                    {selectedCanvas?.problemName}
                </Link>
            </Flex>
        </Box>
    );
};

export default CanvasHeader;