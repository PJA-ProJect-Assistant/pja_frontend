import "./MemberTabComp.css";
import InviteModal from "./InviteModal";

interface MemberTabCompProps {
  isInviteModalOpen: boolean;
  onCloseInviteModal: () => void;
}

const MemberTabComp = ({
  isInviteModalOpen,
  onCloseInviteModal,
}: MemberTabCompProps) => {
  return (
    <>
      {isInviteModalOpen && <InviteModal onClose={onCloseInviteModal} />}

      <div className="member-tab-box">
        <div className="Mem-profile-img"></div>
        <div className="Mem-user-info">
          <div className="Mem-user-name">민정이바보</div>
          <div className="Mem-user-email">1234@gmail.com</div>
        </div>
      </div>
    </>
  );
};

export default MemberTabComp;
