import { EditView } from "@/components/refine-ui/views/edit-view";
import { useForm } from "@refinedev/react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    code: z.string().min(1, "Code is required"),
    description: z.string().optional(),
});

const DepartmentEdit = () => {
    const form = useForm({
        resolver: zodResolver(schema),
        refineCoreProps: { resource: "departments", action: "edit" },
    });

    const { refineCore: { onFinish, query }, handleSubmit, formState: { isSubmitting }, control } = form;

    if (query?.isLoading) return <div className="p-8">Loading...</div>;

    return (
        <EditView>
            <h1 className="page-title">Edit Department</h1>
            <p className="intro-row">Update department details.</p>
            <Separator className="my-6" />

            <Card className="class-form-card">
                <CardHeader>
                    <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">Department Details</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="mt-7">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onFinish)} className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <FormField control={control} name="name" render={({ field }) => (
                                    <FormItem><FormLabel>Department Name *</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name="code" render={({ field }) => (
                                    <FormItem><FormLabel>Department Code *</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <FormField control={control} name="description" render={({ field }) => (
                                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                            )} />
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
export default DepartmentEdit;
