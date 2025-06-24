import "./ListPage.css";
import CategoryProgress from "./CategoryProgress";
import Featurelist from "./Featurelist";
import ListTable from "./ListTable";
import { useCategoryFeatureCategory } from "../../../../hooks/useCategoryFeatureAction";

export default function ListPage() {
  const categoryFeatureData = useCategoryFeatureCategory();
  return (
    <div className="list-container">
      <div className="list-info">
        <CategoryProgress {...categoryFeatureData} />
        <Featurelist {...categoryFeatureData} />
      </div>
      <div className="list-table-box">
        <ListTable {...categoryFeatureData} />
      </div>
    </div>
  );
}
