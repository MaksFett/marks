import React, { Suspense } from "react";
import Header from "../components/Header";
import Grades from 'grades/Grades';
import "@packages/shared/src/styles.css";


const GradeList: React.FC = () => {
    return (
        <div style={{ padding: "20px" }}>
            <Header />
            <Suspense fallback="Загрузка...">
                <Grades />
            </Suspense>
        </div>
    );
};

export default GradeList;
