  import { ListView } from "@/components/refine-ui/views/list-view";
  import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
  import { DataTable } from "@/components/refine-ui/data-table/data-table";
  import { CreateButton } from "@/components/refine-ui/buttons/create";
  import { ShowButton } from "@/components/refine-ui/buttons/show";
  import { EditButton } from "@/components/refine-ui/buttons/edit";
  import { DeleteButton } from "@/components/refine-ui/buttons/delete";
  import { Input } from "@/components/ui/input";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
  import { Search } from "lucide-react";
  import { useMemo, useState } from "react";
  import { useTable } from "@refinedev/react-table";
  import { useList } from "@refinedev/core";
  import { Subject, DepartmentDetail } from "@/types";
  import { ColumnDef } from "@tanstack/react-table";
  import { Badge } from "@/components/ui/badge";


  const SubjectList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDept, setSelectedDept] = useState('all');

    const { query: deptsQuery } = useList<DepartmentDetail>({
      resource: 'departments',
      pagination: { pageSize: 100 },
    });
    const departments = deptsQuery?.data?.data || [];

    const filters = [
      ...(selectedDept !== 'all' ? [{ field: 'department', operator: 'eq' as const, value: selectedDept }] : []),
      ...(searchQuery ? [{ field: 'name', operator: 'contains' as const, value: searchQuery }] : []),
    ];

    const columns = useMemo<ColumnDef<Subject>[]>(() => [
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
        size: 200,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => <span className="font-medium text-foreground">{getValue<string>()}</span>,
      },
      {
        id: 'department',
        accessorKey: 'department.name',
        size: 160,
        header: () => <p className="column-title">Department</p>,
        cell: ({ getValue }) => <span className="text-muted-foreground">{getValue<string>() || '—'}</span>,
      },
      {
        id: 'description',
        accessorKey: 'description',
        size: 260,
        header: () => <p className="column-title">Description</p>,
        cell: ({ getValue }) => <span className="text-sm text-muted-foreground line-clamp-1">{getValue<string>() || '—'}</span>,
      },
      {
        id: 'actions',
        size: 160,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex gap-1">
            <ShowButton resource="subjects" recordItemId={row.original.id} variant="ghost" size="sm" />
            <EditButton resource="subjects" recordItemId={row.original.id} variant="ghost" size="sm" />
            <DeleteButton resource="subjects" recordItemId={row.original.id} variant="ghost" size="sm" />
          </div>
        ),
      },
    ], []);

    const table = useTable<Subject>({
      columns,
      refineCoreProps: {
        resource: 'subjects',
        pagination: { pageSize: 10, mode: 'server' },
        filters: { permanent: filters },
      },
    });

    return (
      <ListView>
        <Breadcrumb />
        <h1 className="page-title">Subjects</h1>
        <div className="intro-row">
          <p>Manage academic subjects.</p>
          <div className="actions-row">
            <div className="search-field">
              <Search className="search-icon" />
              <Input type="text" placeholder="Search subjects..." className="pl-10"
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <Select value={selectedDept} onValueChange={setSelectedDept}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(d => (
                  <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CreateButton resource="subjects" />
          </div>
        </div>
        <DataTable table={table} />
      </ListView>
    );
  };

  export default SubjectList;