import React, { lazy, Suspense } from "react";
import Header from "../components/Header";
const Grades = lazy(() => import('grades/Grades'));
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
