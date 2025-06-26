import type { IsClose } from "../../types/common";
import * as Dialog from "@radix-ui/react-dialog";
import "./BasicModal.css";

interface BasicModalProps {
  modalTitle: string;
  modalDescription: string;
  Close: (open: boolean) => void;
}

export function BasicModal({
  modalTitle,
  modalDescription,
  Close,
}: BasicModalProps) {
  // 안내 문구용 모달
  return (
    <Dialog.Root open={true} onOpenChange={Close}>
      <Dialog.Portal>
        <Dialog.Overlay className="basic-modal-overlay" />
        <Dialog.Content className="basic-modal-content">
          <Dialog.Title className="basic-modal-title">
            {modalTitle}
          </Dialog.Title>
          <Dialog.Description className="basic-modal-description">
            {modalDescription}
          </Dialog.Description>
          <Dialog.Close asChild>
            <button className="basic-modal-close">확인</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
