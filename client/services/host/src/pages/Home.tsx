import React, { lazy, Suspense } from "react";
import Header from "../components/Header";
const Students = lazy(() => import('students/Students'));
import "@packages/shared/src/styles.css";


const Home: React.FC = () => {
    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <Header />
            <Suspense fallback="Загрузка...">
                <Students />
            </Suspense>
        </div>
    );
};

export default Home;
