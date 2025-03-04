import CodeMirror from "@uiw/react-codemirror";
import { useRef } from 'react';
import { Box, Flex} from '@chakra-ui/react';
import { CanvasSectionName } from './CanvasSectionName';

interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export const CodeEditor = ({ value, onChange }: CodeEditorProps) => {
    const editorRef = useRef(null);

    return (
        <Flex direction="column" h="full">
            <CanvasSectionName fieldName="Code" />
            <Box flex="1" h="full">
                <CodeMirror
                    className="h-full"
                    ref={editorRef}
                    value={value}
                    onChange={onChange}
                    theme={'light'}
                    autoFocus={true}
                    placeholder={'Write your code here...'}
                />
            </Box>
        </Flex>
    );
};