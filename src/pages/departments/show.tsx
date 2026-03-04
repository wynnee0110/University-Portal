import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { useShow, useList } from "@refinedev/core";
import { DepartmentDetail, Subject } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, FileText, Calendar, BookOpen } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DepartmentShow = () => {
    const { query: { data, isLoading } } = useShow<DepartmentDetail>();
    const record = data?.data;

    const subjectsQuery = useList<Subject>({
        resource: "subjects",
        filters: [{ field: "department", operator: "eq", value: record?.id }],
        queryOptions: { enabled: !!record?.id },
        pagination: { pageSize: 100 } // Get all for display
    }) as any;
    const subjectsData = subjectsQuery?.data;

    if (isLoading || !record) return <div className="p-8">Loading...</div>;

    return (
        <ShowView>
            <ShowViewHeader
                resource="departments"
                title={record.name}
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-full border-border bg-card shadow-sm border">
                    <CardContent className="p-6 md:p-8 space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <Badge variant="outline" className="text-sm px-3 py-1 gap-2"><Code size={14} /> {record.code}</Badge>
                            <Badge variant="secondary" className="text-sm px-3 py-1 gap-2"><BookOpen size={14} /> {record.subjectCount || 0} Subjects</Badge>
                        </div>
                        <div className="flex items-start gap-3 text-muted-foreground mt-4">
                            <FileText size={18} className="mt-1 flex-shrink-0" />
                            <p className="leading-relaxed whitespace-pre-wrap">{record.description || "No description provided."}</p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                            <Calendar size={16} />
                            <p>Created on {new Date(record.createdAt ?? "").toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Associated Subjects Table */}
                <Card className="col-span-full border-border bg-card shadow-sm border mt-6">
                    <CardContent className="p-6 md:p-8">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><BookOpen size={18} /> Subjects in this Department</h3>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Name</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {!subjectsData?.data || subjectsData.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center text-muted-foreground h-24">
                                                No subjects found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        subjectsData?.data?.map((subject: any) => (
                                            <TableRow key={subject.id}>
                                                <TableCell><Badge variant="outline">{subject.code}</Badge></TableCell>
                                                <TableCell>{subject.name}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ShowView>
    );
};
export default DepartmentShow;
