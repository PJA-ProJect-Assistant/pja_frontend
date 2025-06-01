import { useState } from "react"
import { WSHeader } from "../../../components/header/WSHeader"
import "./DevelopmentPage.css"
import ListPage from "./listpage/ListPage"

export default function DevelopmentPage() {
    const [page, setPage] = useState<number>(0)

    const menus = ['리스트', '칸반', '간트차트', '대시보드']
    return (
        <>
            <WSHeader title="" />
            <div className="develop-container">
                <div className="develop-navigate-container">
                    {menus.map((menu, index) => (
                        <div
                            key={index}
                            className={`develop-navigate ${page === index ? 'selected' : ''}`}
                            onClick={() => setPage(index)}
                        >
                            {menu}
                        </div>
                    ))}
                </div>
                {page === 0 && <ListPage />}
            </div>
        </>
    )
}