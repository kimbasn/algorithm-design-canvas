import {
    Flex,
    Button,
    Link,
    Heading,
} from '@chakra-ui/react'
import { ColorModeButton } from "../ui/color-mode"



export const Header = () => {
    return (
        <Flex
            as="header"
            align="center"
            justify="space-between"
            py={4}
            px={6}
            borderBottomWidth={1}
        >
            <Flex align="center" gap={4}>
                <Link href='/' _hover={{ textDecoration: 'none' }}>
                    <Heading size="lg" color="blue.500">AlgoDesignCanvas</Heading>
                </Link>
            </Flex>
            <Flex gap={2}>
                <ColorModeButton />
                <Button variant="outline">
                    Login
                </Button>
                <Button variant="outline">
                    Sign up
                </Button>
            </Flex>
        </Flex>
    );
};