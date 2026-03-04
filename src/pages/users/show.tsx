import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { useShow } from "@refinedev/core";
import { User } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserShow = () => {
    const { query: { data, isLoading } } = useShow<User>();
    const record = data?.data;

    if (isLoading || !record) return <div className="p-8">Loading...</div>;

    return (
        <ShowView>
            <ShowViewHeader
                resource="users"
                title="User Profile"
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-full border-border bg-card shadow-sm border">
                    <CardContent className="p-6 md:p-8 flex flex-col items-center sm:flex-row sm:items-start gap-8">
                        <Avatar className="h-32 w-32 shadow-xl border-4 border-background">
                            {record.image && <AvatarImage src={record.image} alt={record.name} className="object-cover" />}
                            <AvatarFallback className="text-4xl text-muted-foreground">{record.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-4 text-center sm:text-left">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">{record.name}</h2>
                                <Badge variant="outline" className="mt-2 font-mono uppercase bg-muted/50 text-muted-foreground" >
                                    {record.role}
                                </Badge>
                            </div>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <Mail size={16} />
                                    <span>{record.email}</span>
                                </div>
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <Calendar size={16} />
                                    <span>Joined {new Date(record.createdAt ?? "").toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ShowView>
    );
};
export default UserShow;
