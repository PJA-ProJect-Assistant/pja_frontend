import "./MemberTabComp.css";
import InviteModal from "./InviteModal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../lib/axios";
import type { RootState } from "../../store/store";
import type { Member, MemberRole } from "../../types/invite";
import { deleteMember } from "../../services/workspaceMemberApi";

interface MemberTabCompProps {
  currentUserRole: MemberRole;
  isInviteModalOpen: boolean;
  onCloseInviteModal: () => void;
  onModify: (memberId: string) => void;
}

interface MemberListItemProps {
  member: Member;
  currentUserRole: MemberRole;
  onModify: (memberId: string) => void;
  onDelete: (memberId: string) => void;
}

const MemberListItem = ({
  member,
  currentUserRole,
  onModify,
  onDelete,
}: MemberListItemProps) => {
  const canManage = currentUserRole === "ADMIN";

  return (
    <div className="member-tab-box">
      <div className="member-info-container">
        <div
          className="Mem-profile-img"
          style={{
            backgroundImage: member.profile ? `url(${member.profile})` : "none",
          }}
        >
          {!member.profile && <div className="default-profile-icon">👤</div>}
        </div>
        <div className="Mem-user-info">
          <div className="Mem-user-name">{member.name}</div>
          <div className="Mem-user-email">{member.email}</div>
        </div>
      </div>
      <div className="member-action-container">
        {canManage && (
          <>
            <button
              className="member-modify-btn"
              onClick={() => onModify(member.memberId)}
            >
              수정
            </button>
            <button
              className="member-delete-btn"
              onClick={() => onDelete(member.memberId)}
            >
              삭제
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const MemberTabComp = ({
  currentUserRole,
  isInviteModalOpen,
  onCloseInviteModal,
  onModify,
}: MemberTabCompProps) => {
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const workspaceId = selectedWS?.workspaceId;

  const [members, setMembers] = useState<Member[]>([]);

  const fetchMembers = async () => {
    if (!workspaceId) return;
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get(`/workspaces/${workspaceId}/members`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data.status === "success") {
        setMembers(response.data.data);
      }
    } catch (error: any) {
      console.error("멤버 조회 실패", error.response?.data?.message || error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [workspaceId]);

  const handleDeleteMember = async (memberId: string) => {
    if (!workspaceId) return;
    const confirm = window.confirm("정말 이 멤버를 삭제하시겠습니까?");
    if (!confirm) return;

    try {
      await deleteMember(workspaceId, parseInt(memberId));
      setMembers((prev) => prev.filter((m) => m.memberId !== memberId));
    } catch (error: any) {
      alert(error.response?.data?.message || "멤버 삭제 실패");
    }
  };

  return (
    <>
      {isInviteModalOpen && <InviteModal onClose={onCloseInviteModal} />}
      {members.map((member) => (
        <MemberListItem
          key={member.memberId}
          member={member}
          currentUserRole={currentUserRole}
          onModify={onModify}
          onDelete={handleDeleteMember}
        />
      ))}
    </>
  );
};

export default MemberTabComp;
