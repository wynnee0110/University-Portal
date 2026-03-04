import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { Input } from "@/components/ui/input";
import { Search, Building2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { DepartmentDetail } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

const DepartmentList = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const searchFilters = searchQuery ? [
        { field: 'name', operator: 'contains' as const, value: searchQuery }
    ] : [];

    const columns = useMemo<ColumnDef<DepartmentDetail>[]>(() => [
        {
            id: 'code',
            accessorKey: 'code',
            size: 100,
            header: () => <p className="column-title">Code</p>,
            cell: ({ getValue }) => <Badge variant="outline">{getValue<string>()}</Badge>,
        },
        {
            id: 'name',
            accessorKey: 'name',
            size: 220,
            header: () => <p className="column-title">Name</p>,
            cell: ({ getValue }) => <span className="font-medium text-foreground">{getValue<string>()}</span>,
        },
        {
            id: 'description',
            accessorKey: 'description',
            size: 300,
            header: () => <p className="column-title">Description</p>,
            cell: ({ getValue }) => <span className="text-muted-foreground text-sm">{getValue<string>() || '—'}</span>,
        },
        {
            id: 'subjectCount',
            accessorKey: 'subjectCount',
            size: 120,
            header: () => <p className="column-title">Subjects</p>,
            cell: ({ getValue }) => <Badge variant="secondary">{getValue<number>() ?? 0} subjects</Badge>,
        },
        {
            id: 'actions',
            size: 160,
            header: () => <p className="column-title">Actions</p>,
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <ShowButton resource="departments" recordItemId={row.original.id} variant="ghost" size="sm" />
                    <EditButton resource="departments" recordItemId={row.original.id} variant="ghost" size="sm" />
                    <DeleteButton resource="departments" recordItemId={row.original.id} variant="ghost" size="sm"  />
                </div>
            ),
        },
    ], []);

    const table = useTable<DepartmentDetail>({
        columns,
        refineCoreProps: {
            resource: 'departments',
            pagination: { pageSize: 10, mode: 'server' },
            filters: { permanent: [...searchFilters] },
        },
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Departments</h1>
            <div className="intro-row">
                <p>Manage academic departments.</p>
                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input type="text" placeholder="Search departments..." className="pl-10"
                            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                    <CreateButton resource="departments" />
                </div>
            </div>
            <DataTable table={table} />
        </ListView>
    );
};

export default DepartmentList;
