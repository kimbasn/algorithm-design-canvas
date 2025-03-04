import { Button, DialogTitle, Text } from "@chakra-ui/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FiTrash2 } from "react-icons/fi"

import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "../ui/dialog"

interface DeleteCanvasProps {
  id: number;
  deleteCanvas: (id: number) => void;
}

const DeleteCanvas = ({ id, deleteCanvas }: DeleteCanvasProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    handleSubmit,
  } = useForm()


  const onSubmit = () => {
    deleteCanvas(id)
    setIsOpen(false)
  }

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="top"
      role="alertdialog"
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" colorPalette="red">
          <FiTrash2 fontSize="16px" />
          Delete Canvas
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Canvas</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Text mb={4}>
            This canvas will be <strong>permanently deleted.</strong> Are you sure? You will not
            be able to undo this action.
          </Text>
        </DialogBody>
        <DialogFooter gap={2}>
          <DialogActionTrigger asChild>
            <Button
              variant="subtle"
              colorPalette="gray"
            >
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button
            variant="solid"
            colorPalette="red"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Delete
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}

export default DeleteCanvas
