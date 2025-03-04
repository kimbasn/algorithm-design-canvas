import { Box, Textarea, Flex } from '@chakra-ui/react';

interface TextAreaEditorProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    fieldName: string;
}



export const TextAreaEditor = ({ value = '', onChange, fieldName }: TextAreaEditorProps) => {
    return (
        <Box  h={"100%"}>
            <Flex h="full" fontFamily="mono" fontSize="sm" height={"100%"}>
                <Textarea
                    value={value}
                    onChange={onChange}
                    flex="1"
                    p="4"
                    resize="none"
                    placeholder={`Enter ${fieldName}...`}
                    focusVisibleRing={"false"}
                    style={{
                        wordWrap: "break-word",
                        wordBreak: "break-word",
                        outline: "none"
                    }}
                />
            </Flex>
        </Box>
    );
};