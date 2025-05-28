import type { IsClose } from "../../types/common";
import * as Dialog from "@radix-ui/react-dialog";
import "./BasicModal.css";

export function WsmenuModal({ onClose }: IsClose) {
  // 수정,삭제,완료 등 권한 없을 때 띄우는 모달
  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className="modal-content">
          <Dialog.Title className="modal-title">
            작업 수행 권한이 없습니다
          </Dialog.Title>
          <Dialog.Description className="modal-description">
            워크스페이스 관리는 관리자만 가능합니다
          </Dialog.Description>
          <Dialog.Close asChild>
            <button className="modal-close">확인</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function WscompleteModal({ onClose }: IsClose) {
  // 수정,삭제,완료 등 권한 없을 때 띄우는 모달
  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className="modal-content">
          <Dialog.Title className="modal-title">
            워크스페이스를 완료할 수 없습니다
          </Dialog.Title>
          <Dialog.Description className="modal-description">
            프로젝트를 모두 완료한 후 완료 가능합니다
          </Dialog.Description>
          <Dialog.Close asChild>
            <button className="modal-close">확인</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
