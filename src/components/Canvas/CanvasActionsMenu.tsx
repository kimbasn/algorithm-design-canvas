import { IconButton, Stack } from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { MenuContent, MenuRoot, MenuTrigger } from "../ui/menu"

import EditCanvas from "./EditCanvas"
import DeleteCanvas from "./DeleteCanvas"
import { Canvas } from "../../types"

interface CanvasActionsMenuProps {
  canvas: Canvas
  updateCanvas: (id: number, problemName: string, problemUrl: string) => void;
  deleteCanvas: (id: number) => void;
}

export const CanvasActionsMenu = ({ canvas, updateCanvas, deleteCanvas }: CanvasActionsMenuProps) => {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton variant="ghost" color="inherit">
          <BsThreeDotsVertical />
        </IconButton>
      </MenuTrigger>
      <MenuContent>
        <Stack>
          <EditCanvas canvas={canvas} updateCanvas={updateCanvas} />
          <DeleteCanvas deleteCanvas={deleteCanvas} id={canvas.id} />
        </Stack>
      </MenuContent>
    </MenuRoot>
  )
}
