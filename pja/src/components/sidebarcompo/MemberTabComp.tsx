import "./MemberTabComp.css";
import InviteModal from "./InviteModal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../lib/axios";
import type { RootState } from "../../store/store";

interface MemberTabCompProps {
  isInviteModalOpen: boolean;
  onCloseInviteModal: () => void;
}

interface Member {
  memberId: string;
  name: string;
  email: string;
  role: string;
  profile: string;
}

const MemberTabComp = ({
  isInviteModalOpen,
  onCloseInviteModal,
}: MemberTabCompProps) => {
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const workspaceId = selectedWS?.workspaceId;

  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchMembers = async() => {
      try {
            console.log("worksapceId는 ", workspaceId)
            const accessToken = localStorage.getItem("accessToken");
            const headers = {
              Authorization: `Bearer ${accessToken}`
            };
            const response = await api.get(
              `/workspaces/${workspaceId}/members`,
              { headers }
            );

            if(response.data.status === "success") {
              setMembers(response.data.data);
              console.log(response.data.data);
            }
          } catch (error: any) {
            if (error.response) {
              console.error("에러:", error.response.data.message);
            } else {
              console.error("서버 응답 실패");
            }
          }
        };

        fetchMembers();
  },[workspaceId]);


  return (
<>
      {isInviteModalOpen && <InviteModal onClose={onCloseInviteModal} />}

      {members.map((member) => (
        <div key={member.memberId} className="member-tab-box">
          <div className="Mem-profile-img">
            {member.profile ? (
              <img src={member.profile} alt="프로필 이미지" />
            ) : <></>}
          </div>
          <div className="Mem-user-info">
            <div className="Mem-user-name">{member.name}</div>
            <div className="Mem-user-email">{member.email}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MemberTabComp;
