import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const RoleBadge = ({ role }: { role: string }) => {
    switch (role) {
        case 'admin': return <Badge className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-purple-500/20">Admin</Badge>;
        case 'teacher': return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20">Teacher</Badge>;
        case 'student': return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">Student</Badge>;
        default: return <Badge variant="outline">{role}</Badge>;
    }
};

const UserList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');

    const filters = [
        ...(selectedRole !== 'all' ? [{ field: 'role', operator: 'eq' as const, value: selectedRole }] : []),
        ...(searchQuery ? [{ field: 'name', operator: 'contains' as const, value: searchQuery }] : []),
    ];

    const columns = useMemo<ColumnDef<User>[]>(() => [
        {
            id: 'user',
            accessorKey: 'name',
            size: 280,
            header: () => <p className="column-title">User</p>,
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        {row.original.image && <AvatarImage src={row.original.image} alt={row.original.name} />}
                        <AvatarFallback>{row.original.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium text-foreground">{row.original.name}</span>
                        <span className="text-sm text-muted-foreground">{row.original.email}</span>
                    </div>
                </div>
            ),
        },
        {
            id: 'role',
            accessorKey: 'role',
            size: 140,
            header: () => <p className="column-title">Role</p>,
            cell: ({ getValue }) => <RoleBadge role={getValue<string>()} />,
        },
        {
            id: 'actions',
            size: 160,
            header: () => <p className="column-title">Actions</p>,
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <ShowButton resource="users" recordItemId={row.original.id} variant="ghost" size="sm" />
                    <EditButton resource="users" recordItemId={row.original.id} variant="ghost" size="sm" />
                    <DeleteButton resource="users" recordItemId={row.original.id} variant="ghost" size="sm" />
                </div>
            ),
        },
    ], []);

    const table = useTable<User>({
        columns,
        refineCoreProps: {
            resource: 'users',
            pagination: { pageSize: 10, mode: 'server' },
            filters: { permanent: filters },
        },
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">System Users</h1>
            <div className="intro-row">
                <p>Manage admins, teachers, and students.</p>
                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input type="text" placeholder="Search by name..." className="pl-10"
                            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DataTable table={table} />
        </ListView>
    );
};

export default UserList;
