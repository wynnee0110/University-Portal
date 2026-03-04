import { EditView } from "@/components/refine-ui/views/edit-view";
import { useForm } from "@refinedev/react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useList, useCustomMutation } from "@refinedev/core";
import { BACKEND_BASE_URL } from "@/constants";
import { Subject, User } from "@/types";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    capacity: z.number().min(1, "Capacity must be at least 1"),
    subjectId: z.number().min(1, "Subject is required"),
    teacherId: z.string().min(1, "Teacher is required"),
    status: z.enum(["active", "archived", "draft"]),
    bannerUrl: z.string().optional(),
    bannerCldPubId: z.string().optional(),
    schedules: z.any().optional(),
});

const ClassesEdit = () => {
    const { query: subjectsQuery } = useList<Subject>({ resource: "subjects", pagination: { pageSize: 100 } });
    const { query: teachersQuery } = useList<User>({ resource: "users", filters: [{ field: "role", operator: "eq", value: "teacher" }], pagination: { pageSize: 100 } });

    const form = useForm({
        resolver: zodResolver(schema),
        refineCoreProps: { resource: "classes", action: "edit" },
    });

    const { refineCore: { onFinish, query }, handleSubmit, formState: { isSubmitting }, control, getValues } = form;

    const classId = query?.data?.data?.id;
    const currentCode = query?.data?.data?.inviteCode;

    const mutationResult = useCustomMutation<any>();
    const regenerateInvite = mutationResult.mutate;
    const isRegenerating = (mutationResult.mutation as any)?.isLoading || (mutationResult as any).isLoading;

    const handleRegenerate = async () => {
        if (!classId) return;
        regenerateInvite(
            { url: `${BACKEND_BASE_URL}/classes/${classId}/regenerate-invite`, method: "post", values: {} },
            {
                onSuccess: (data: any) => {
                    toast.success(`Invite code updated: ${data.data.data.inviteCode}`);
                    query?.refetch();
                },
                onError: () => toast.error("Failed to regenerate invite code")
            }
        );
    };

    if (query?.isLoading) return <div className="p-8">Loading...</div>;

    const subjects = subjectsQuery?.data?.data || [];
    const teachers = teachersQuery?.data?.data || [];

    return (
        <EditView>
            <h1 className="page-title">Edit Class</h1>
            <div className="intro-row flex justify-between items-center">
                <p>Update class details, schedule, and capacity.</p>
                {currentCode && (
                    <div className="flex items-center gap-3 bg-muted px-4 py-2 rounded-md border">
                        <span className="text-sm font-medium text-muted-foreground">Invite Code:</span>
                        <span className="font-mono font-bold">{currentCode}</span>
                        <Button variant="outline" size="sm" className="ml-2 gap-2" onClick={handleRegenerate} disabled={isRegenerating}>
                            {isRegenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                            Regenerate
                        </Button>
                    </div>
                )}
            </div>
            <Separator className="my-6" />

            <Card className="class-form-card">
                <CardHeader>
                    <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">Class Configuration</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="mt-7">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onFinish)} className="space-y-5">
                            <FormField control={control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Class Name *</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                            )} />

                            <div className="grid sm:grid-cols-2 gap-4">
                                <FormField control={control} name="subjectId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subject *</FormLabel>
                                        <Select onValueChange={v => field.onChange(Number(v))} value={field.value?.toString() ?? ""}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {subjects.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={control} name="teacherId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Primary Teacher *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value?.toString() ?? ""}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {teachers.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <FormField control={control} name="capacity" render={({ field }) => (
                                    <FormItem><FormLabel>Student Capacity *</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name="status" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value ?? "active"}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="archived">Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={control} name="description" render={({ field }) => (
                                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                            )} />

                            <div className="grid sm:grid-cols-2 gap-4">
                                <FormField control={control} name="bannerUrl" render={({ field }) => (
                                    <FormItem><FormLabel>Banner Image URL</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name="bannerCldPubId" render={({ field }) => (
                                    <FormItem><FormLabel>Cloudinary Public ID</FormLabel><FormControl><Input {...field} value={field.value || ''} placeholder="e.g. classroom/banners/abc" /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>

                            <Button type="submit" size="lg" className="w-full">
                                {isSubmitting ? <><Loader2 className="mr-2 animate-spin h-4 w-4" /> Saving...</> : "Save Changes"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </EditView>
    );
};
export default ClassesEdit;
