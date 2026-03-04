import { CreateView } from "@/components/refine-ui/views/create-view";
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

const DepartmentCreate = () => {
    const form = useForm({
        resolver: zodResolver(schema),
        refineCoreProps: { resource: "departments", action: "create" },
    });

    const { refineCore: { onFinish }, handleSubmit, formState: { isSubmitting }, control } = form;

    return (
        <CreateView>
            <h1 className="page-title">Create Department</h1>
            <p className="intro-row">Provide details for the new department.</p>
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
                                    <FormItem><FormLabel>Department Name *</FormLabel><FormControl><Input placeholder="e.g. Science Department" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name="code" render={({ field }) => (
                                    <FormItem><FormLabel>Department Code *</FormLabel><FormControl><Input placeholder="e.g. SCI" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <FormField control={control} name="description" render={({ field }) => (
                                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Optional details..." {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <Button type="submit" size="lg" className="w-full">
                                {isSubmitting ? <><Loader2 className="mr-2 animate-spin h-4 w-4" /> Creating...</> : "Create Department"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </CreateView>
    );
};
export default DepartmentCreate;
