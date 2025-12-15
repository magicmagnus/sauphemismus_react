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
import SprichworteLayout from "./layouts/SprichworteLayout.jsx";

import SauphemismusPage from "./pages/SauphemismusPage.jsx";
import PilzfinderPage from "./pages/PilzfinderPage.jsx";
import JustGPTThingsPage from "./pages/JustGPTThingsPage.jsx";
import FaketastischPage from "./pages/FaketastischPage.jsx";
import SauphemismusEnPage from "./pages/SauphemismusEnPage.jsx";
import AusredenPage from "./pages/AusredenPage.jsx";
import ChessGPTPage from "./pages/ChessGPTPage.jsx";
import SprichwortePage from "./pages/SprichwortePage.jsx";
import BibelzitatePage from "./pages/BibelzitatePage.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/faketastisch" replace />} />

            {/* Routes that use SauphemismusLayout */}
            <Route element={<SauphemismusLayout />}>
                <Route path="sauphemismus" element={<SauphemismusPage />} />
                <Route
                    path="sauphemismus_en"
                    element={<SauphemismusEnPage />}
                />
                <Route path="pilzfinder" element={<PilzfinderPage />} />
                <Route path="ausreden" element={<AusredenPage />} />
                <Route path="chessgpt" element={<ChessGPTPage />} />
            </Route>

            {/* Routes that use SprichworteLayout */}
            <Route element={<SprichworteLayout />}>
                <Route path="sprichworte" element={<SprichwortePage />} />
                <Route path="bibelzitate" element={<BibelzitatePage />} />
                <Route path="justgptthings" element={<JustGPTThingsPage />} />
            </Route>

            {/* Routes that don't use any specific layout */}

            <Route path="faketastisch" element={<FaketastischPage />} />
        </Route>,
    ),
);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;
