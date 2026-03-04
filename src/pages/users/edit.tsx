import { EditView } from "@/components/refine-ui/views/edit-view";
import { useForm } from "@refinedev/react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    role: z.enum(["admin", "teacher", "student"]),
    image: z.string().optional(),
    imageCldPubId: z.string().optional(),
});

const UserEdit = () => {
    const form = useForm({
        resolver: zodResolver(schema),
        refineCoreProps: { resource: "users", action: "edit" },
    });

    const { refineCore: { onFinish, query }, handleSubmit, formState: { isSubmitting }, control } = form;

    if (query?.isLoading) return <div className="p-8">Loading...</div>;

    return (
        <EditView>
            <h1 className="page-title">Edit User</h1>
            <p className="intro-row">Update user profile and roles.</p>
            <Separator className="my-6" />

            <Card className="class-form-card">
                <CardHeader>
                    <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">User Details</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="mt-7">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onFinish)} className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <FormField control={control} name="name" render={({ field }) => (
                                    <FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name="role" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="teacher">Teacher</SelectItem>
                                                <SelectItem value="student">Student</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <FormField control={control} name="image" render={({ field }) => (
                                <FormItem><FormLabel>Profile Image URL</FormLabel><FormControl><Input {...field} value={field.value || ''} placeholder="https://..." /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={control} name="imageCldPubId" render={({ field }) => (
                                <FormItem><FormLabel>Cloudinary Public ID</FormLabel><FormControl><Input {...field} value={field.value || ''} placeholder="e.g. classroom/users/abc1234" /></FormControl><FormMessage /></FormItem>
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
export default UserEdit;
