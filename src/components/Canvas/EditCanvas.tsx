import {
  Button,
  ButtonGroup,
  DialogActionTrigger,
  Input,
  Text,
  Stack,
} from "@chakra-ui/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field } from "../ui/field"

interface Canvas {
  id: number;
  problemName: string;
  problemUrl: string;
}

interface EditCanvasProps {
  canvas: Canvas;
  updateCanvas: (id: number, problemName: string, problemUrl: string) => void;
}

const EditCanvas = ({ canvas, updateCanvas }: EditCanvasProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Canvas>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: canvas,
  });

  const onSubmit: SubmitHandler<Canvas> = (data) => {
    updateCanvas(canvas.id, data.problemName, data.problemUrl);
    reset();
    setIsOpen(false);
  };

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="top"
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button variant="ghost">
          <FaEdit fontSize="16px" />
          Edit Canvas
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Canvas</DialogTitle>
        </DialogHeader>
        <DialogBody pb="4">
          <Text mb={4}>Update the Canvas details below.</Text>
          <Stack gap={4}>
            <Field
              required
              invalid={!!errors.problemName}
              errorText={errors.problemName?.message}
              label="Problem Name"
            >
              <Input
                id="problemName"
                {...register("problemName", {
                  required: "Problem is required.",
                })}
                defaultValue={canvas.problemName}
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
                defaultValue={canvas.problemUrl}
                type="text"
              />
            </Field>
          </Stack>
        </DialogBody>

        <DialogFooter gap={2}>
          <ButtonGroup>
            <DialogActionTrigger asChild>
              <Button
                variant="outline"
              >
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button onClick={handleSubmit(onSubmit)}>
              Save
            </Button>
          </ButtonGroup>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default EditCanvas;