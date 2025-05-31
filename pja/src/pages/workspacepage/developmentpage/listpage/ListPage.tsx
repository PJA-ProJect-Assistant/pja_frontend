import "./ListPage.css"
import CategoryProgress from "./CategoryProgress"
import Featurelist from "./Featurelist"

export default function ListPage() {
    return (
        <div className="list-container">
            <div className="list-info" >
                <CategoryProgress />
                <Featurelist />
            </div>
            <div className="list-table-box">

            </div>
        </div>
    )
}