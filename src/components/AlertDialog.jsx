import { IconButton } from '@chakra-ui/react';
import { LuTrash2, LuX, LuCheck } from "react-icons/lu"
import {
    DialogActionTrigger,
    DialogBody,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const AlertDialog = ({ onConfirm }) => {
    return (
        <DialogRoot role="alertdialog">
            <DialogTrigger asChild>
                <IconButton variant="ghost" size="xs">
                    <LuTrash2 />
                </IconButton>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <p>
                        이 작업은 되돌릴 수 없으며 <br />
                        삭제된 데이터는 영구적으로 삭제됩니다.
                    </p>
                </DialogBody>
                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <IconButton variant="outline" size="xs">
                            <LuX />
                        </IconButton>
                    </DialogActionTrigger>
                    <IconButton
                        colorPalette="red"
                        variant="outline"
                        size="xs"
                        onClick={() => onConfirm()}
                    >
                        <LuCheck />
                    </IconButton>
                </DialogFooter>
                {/* <DialogCloseTrigger /> */}
            </DialogContent>
        </DialogRoot>
    )
}

export default AlertDialog;