import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { useShow } from "@refinedev/core";
import { Subject } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Code, FileText, Calendar } from "lucide-react";

export const SubjectsShow = () => {
    const { query: { data, isLoading } } = useShow<Subject & { department?: { name: string } }>();
    const record = data?.data;

    if (isLoading || !record) return <div className="p-8">Loading...</div>;

    return (
        <ShowView>
            <ShowViewHeader
                resource="subjects"
                title={record.name}
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-full border-border bg-card shadow-sm border">
                    <CardContent className="p-6 md:p-8 space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <Badge variant="outline" className="text-sm px-3 py-1 gap-2"><Code size={14} /> {record.code}</Badge>
                            {record.department && (
                                <Badge variant="secondary" className="text-sm px-3 py-1 gap-2"><Building2 size={14} /> {record.department.name}</Badge>
                            )}
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
            </div>
        </ShowView>
    );
};
export default SubjectsShow;
