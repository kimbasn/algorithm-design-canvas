import { useForm, type SubmitHandler } from "react-hook-form";
import {
    Button,
    Input,
    Stack,
    Flex,
    Icon,
    Text,
    Box
} from "@chakra-ui/react";
import { useColorModeValue } from "../../components/ui/color-mode"
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
    DialogBody,
    DialogActionTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Field } from "../ui/field";

import { Canvas } from "../../types";

interface AddCanvasProps {
    addNewCanvas: (problemName: string, problemUrl: string) => void;
}

const AddCanvas = ({ addNewCanvas }: AddCanvasProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<Canvas>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: {
            problemName: "",
            problemUrl: "",
        },
    });

    const onCancel = () => {
        setIsOpen(false);
        reset();
    };

    const onSubmit: SubmitHandler<Canvas> = (data) => {
        addNewCanvas(data.problemName, data.problemUrl);
        setIsOpen(false);
        reset();
    };

    const buttonBg = useColorModeValue("white", "gray.700");
    const buttonHoverBg = useColorModeValue("blue.50", "blue.900");
    const buttonBorderColor = useColorModeValue("blue.100", "blue.700");
    const iconColor = useColorModeValue("blue.500", "blue.300");

    return (
        <DialogRoot placement="top" open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
            <DialogTrigger asChild>
                <Box
                    as="button"
                    borderWidth="1px"
                    borderStyle="dashed"
                    borderColor={buttonBorderColor}
                    borderRadius="md"
                    p={3}
                    w="100%"
                    bg={buttonBg}
                    _hover={{
                        bg: buttonHoverBg,
                        shadow: "sm",
                        transform: "translateY(-1px)",
                        borderColor: "blue.300"
                    }}
                    transition="all 0.2s"
                >
                    <Flex align="center" justify="center">
                        <Icon
                            as={FaPlus}
                            mr={2}
                            color={iconColor}
                            boxSize={4}
                        />
                        <Text color={iconColor} fontWeight="medium">
                            Create New Canvas
                        </Text>
                    </Flex>
                </Box>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <Flex align="center">
                        <DialogTitle>Create New Canvas</DialogTitle>
                    </Flex>
                </DialogHeader>
                <DialogBody pb="4">
                    <Stack gap="4">
                        <Field
                            required
                            invalid={!!errors.problemName}
                            errorText={errors.problemName?.message}
                            label="Problem Name"
                        >
                            <Input
                                id="problemName"
                                {...register("problemName", {
                                    required: "Problem name is required.",
                                })}
                                placeholder="Problem Name"
                                type="text"
                            />
                        </Field>

                        <Field
                            invalid={!!errors.problemUrl}
                            errorText={errors.problemUrl?.message}
                            label="Problem URL"
                        >
                            <Input
                                id="problemUrl"
                                {...register("problemUrl")}
                                placeholder="Problem URL"
                                type="text"
                            />
                        </Field>
                    </Stack>
                </DialogBody>
                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button onClick={onCancel} variant="outline" size="md">Cancel</Button>
                    </DialogActionTrigger>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        color={buttonBg}
                        disabled={!isValid}
                        size="md"
                        ml={3}
                    >
                        <Icon
                            as={FaPlus}
                            mr={2}
                            color={iconColor}
                            boxSize={4}
                        />
                        Create Canvas
                    </Button>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    );
};

export default AddCanvas;