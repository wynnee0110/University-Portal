import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { useBack, useList } from "@refinedev/core";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "@refinedev/react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { DepartmentDetail } from "@/types";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  departmentId: z.number().min(1, "Department is required"),
});

const SubjectsCreate = () => {
  const back = useBack();
  const { query: deptsQuery } = useList<DepartmentDetail>({ resource: "departments", pagination: { pageSize: 100 } });
  const departments = deptsQuery?.data?.data || [];

  const form = useForm({
    resolver: zodResolver(schema),
    refineCoreProps: { resource: "subjects", action: "create" },
  });

  const { refineCore: { onFinish }, handleSubmit, formState: { isSubmitting }, control } = form;

  return (
    <CreateView>
      <h1 className="page-title">Create a Subject</h1>
      <div className="intro-row">
        <p>Provide the details for the new subject.</p>
        <Button onClick={() => back()}>Go Back</Button>
      </div>
      <Separator />

      <Card className="class-form-card mt-4">
        <CardHeader>
          <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">Subject Details</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="mt-7">
          <Form {...form}>
            <form onSubmit={handleSubmit(onFinish)} className="space-y-5">
              <FormField control={control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Subject Name *</FormLabel><FormControl><Input placeholder="e.g. Intro to Biology" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField control={control} name="code" render={({ field }) => (
                  <FormItem><FormLabel>Subject Code *</FormLabel><FormControl><Input placeholder="e.g. BIO101" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={control} name="departmentId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department *</FormLabel>
                    <Select onValueChange={v => field.onChange(Number(v))} value={field.value?.toString() ?? ""}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {departments.map((d) => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Optional details..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" size="lg" className="w-full">
                {isSubmitting ? <><Loader2 className="mr-2 animate-spin h-4 w-4" /> Creating...</> : "Create Subject"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </CreateView>
  );
};
export default SubjectsCreate;