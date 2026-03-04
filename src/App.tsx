import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data";
import DashBoard from "./pages/DashBoard";
import { Home } from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout";
import { Book } from "lucide-react";
import { Outlet } from "react-router";
import SubjectList from "./pages/subjects/List";
import SubjectsCreate from "./pages/subjects/Create";
import SubjectsEdit from "./pages/subjects/Edit";
import SubjectsShow from "./pages/subjects/Show";
import { GraduationCap, Users, Building2 } from "lucide-react";
import ClassesList from "./pages/classes/list";
import ClassesCreate from "./pages/classes/create";
import ClassesShow from "./pages/classes/show";
import ClassesEdit from "./pages/classes/edit";
import DepartmentList from "./pages/departments/list";
import DepartmentCreate from "./pages/departments/create";
import DepartmentEdit from "./pages/departments/edit";
import DepartmentShow from "./pages/departments/show";
import UserList from "./pages/users/list";
import UserEdit from "./pages/users/edit";
import UserShow from "./pages/users/show";

function App() {
  return (
    <BrowserRouter>

      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "vPdjlZ-7VL2fg-PRJnaL",
              }}
              resources={[
                {
                  name: "dashboard", list: '/',
                  meta: { label: 'Home', icon: <Home /> }

                },
                {
                  name: "subjects", list: '/subjects',
                  create: '/subjects/create',
                  edit: '/subjects/edit/:id',
                  show: '/subjects/show/:id',
                  meta: { label: 'Subjects', icon: <Book /> }

                },
                {
                  name: "classes", list: '/classes',
                  create: '/classes/create',
                  edit: '/classes/edit/:id',
                  show: '/classes/show/:id',
                  meta: { label: 'Classes', icon: <GraduationCap /> }
                },
                {
                  name: "departments", list: '/departments',
                  create: '/departments/create',
                  edit: '/departments/edit/:id',
                  show: '/departments/show/:id',
                  meta: { label: 'Departments', icon: <Building2 /> }
                },
                {
                  name: "users", list: '/users',
                  edit: '/users/edit/:id',
                  show: '/users/show/:id',
                  meta: { label: 'Users', icon: <Users /> }
                }
              ]}

            >
              <Routes>
                <Route element={
                  <Layout>
                    <Outlet />
                  </Layout>
                }>
                  <Route path="/" element={<DashBoard />} />

                  <Route path="subjects">
                    <Route index element={<SubjectList />} />
                    <Route path="create" element={<SubjectsCreate />} />
                    <Route path="edit/:id" element={<SubjectsEdit />} />
                    <Route path="show/:id" element={<SubjectsShow />} />
                  </Route>
                  <Route path="classes">
                    <Route index element={<ClassesList />} />
                    <Route path="create" element={<ClassesCreate />} />
                    <Route path="edit/:id" element={<ClassesEdit />} />
                    <Route path="show/:id" element={<ClassesShow />} />
                  </Route>
                  <Route path="departments">
                    <Route index element={<DepartmentList />} />
                    <Route path="create" element={<DepartmentCreate />} />
                    <Route path="edit/:id" element={<DepartmentEdit />} />
                    <Route path="show/:id" element={<DepartmentShow />} />
                  </Route>
                  <Route path="users">
                    <Route index element={<UserList />} />
                    <Route path="edit/:id" element={<UserEdit />} />
                    <Route path="show/:id" element={<UserShow />} />
                  </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
