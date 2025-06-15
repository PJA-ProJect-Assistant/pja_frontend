import { WSHeader } from "../../../components/header/WSHeader";
import ProjectForm from "./ProjectForm";
import "./IdeaPage.css";

export default function IdeaPage() {
  return (
    <div className="ideapage-container">
      <WSHeader title="아이디어 요약" />
      <ProjectForm />
    </div>
  );
}
