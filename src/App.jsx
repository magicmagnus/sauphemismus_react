import React from "react";
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import SauphemismusLayout from "./layouts/SauphemismusLayout.jsx";
import SauphemismusPage from "./pages/SauphemismusPage.jsx";

import PilzfinderPage from "./pages/PilzfinderPage.jsx";
import JustGPTThingsPage from "./pages/JustGPTThingsPage.jsx";
import FaktemismusPage from "./pages/FaktemismusPage.jsx";
import SauphemismusEnPage from "./pages/SauphemismusEnPage.jsx";
import AusredenPage from "./pages/AusredenPage.jsx";
import ChessGPTPage from "./pages/ChessGPTPage.jsx";
import SprichwortePage from "./pages/SprichwortePage.jsx";
import BibelzitatePage from "./pages/BibelzitatePage.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/sauphemismus" replace />} />

            {/* Routes that use SauphemismusLayout */}
            <Route path="/:themeSlug" element={<SauphemismusLayout />}>
                <Route path="sauphemismus" element={<SauphemismusPage />} />
                <Route path="sauphemismusen" element={<SauphemismusEnPage />} />
                <Route path="pilzfinder" element={<PilzfinderPage />} />
                <Route path="ausreden" element={<AusredenPage />} />
                <Route path="chessgpt" element={<ChessGPTPage />} />
            </Route>

            {/* Routes that don't use SauphemismusLayout */}
            <Route path="justgptthings" element={<JustGPTThingsPage />} />
            <Route path="faktemismus" element={<FaktemismusPage />} />
            <Route path="sprichworte" element={<SprichwortePage />} />
            <Route path="bibelzitate" element={<BibelzitatePage />} />
        </Route>,
    ),
);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;
