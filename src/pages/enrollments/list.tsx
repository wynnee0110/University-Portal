import { useState, useMemo } from "react";
import { useList, useNotification } from "@refinedev/core";
import { ClassDetails, Enrollment, User } from "@/types";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Users, Loader2, Trash2, Search } from "lucide-react";
import { BACKEND_BASE_URL } from "@/constants";

const EnrollmentsList = () => {
    const { open: notify } = useNotification();
    const [selectedClassId, setSelectedClassId] = useState<string>("");
    const [classSearch, setClassSearch] = useState("");
    const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState<string>("");
    const [studentSearch, setStudentSearch] = useState("");
    const [enrolling, setEnrolling] = useState(false);
    const [unenrollingId, setUnenrollingId] = useState<string | null>(null);

    // ── Fetch all classes for the selector ──────────────────────────────────
    const { query: classesQuery } = useList<ClassDetails>({
        resource: "classes",
        pagination: { pageSize: 200 },
    });
    const allClasses = classesQuery?.data?.data ?? [];

    // Filter classes by search query (client-side)
    const filteredClasses = useMemo(() => {
        const q = classSearch.trim().toLowerCase();
        if (!q) return allClasses;
        return allClasses.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                c.subject?.name?.toLowerCase().includes(q) ||
                c.teacher?.name?.toLowerCase().includes(q)
        );
    }, [allClasses, classSearch]);

    // ── Fetch enrolled students for selected class ───────────────────────────
    const { query: enrollmentsQuery } = useList<Enrollment>({
        resource: "enrollments",
        filters: selectedClassId
            ? [{ field: "classId", operator: "eq", value: selectedClassId }]
            : [],
        queryOptions: { enabled: !!selectedClassId },
        pagination: { pageSize: 100 },
    });
    const enrollments = enrollmentsQuery?.data?.data ?? [];
    const enrollmentsLoading = enrollmentsQuery?.isLoading ?? false;

    // ── Fetch students (role=student) for enroll dialog ─────────────────────
    const { query: studentsQuery } = useList<User>({
        resource: "users",
        filters: [{ field: "role", operator: "eq", value: "student" }],
        pagination: { pageSize: 200 },
        queryOptions: { enabled: enrollDialogOpen },
    });
    const allStudents = studentsQuery?.data?.data ?? [];

    // Students not yet enrolled, optionally filtered by the search input
    const enrolledIds = new Set(enrollments.map((e) => e.studentId));
    const availableStudents = useMemo(() => {
        const q = studentSearch.trim().toLowerCase();
        return allStudents
            .filter((s) => !enrolledIds.has(s.id))
            .filter(
                (s) =>
                    !q ||
                    s.name.toLowerCase().includes(q) ||
                    s.email.toLowerCase().includes(q)
            );
    }, [allStudents, enrolledIds, studentSearch]);

    const selectedClass = allClasses.find((c) => String(c.id) === selectedClassId);

    // ── Enroll ───────────────────────────────────────────────────────────────
    const handleEnroll = async () => {
        if (!selectedClassId || !selectedStudentId) return;
        setEnrolling(true);
        try {
            const res = await fetch(`${BACKEND_BASE_URL}/enrollments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ classId: Number(selectedClassId), studentId: selectedStudentId }),
            });
            const json = await res.json();
            if (!res.ok) {
                notify?.({ type: "error", message: json.error ?? "Failed to enroll student" });
            } else {
                notify?.({ type: "success", message: "Student enrolled successfully" });
                setEnrollDialogOpen(false);
                setSelectedStudentId("");
                setStudentSearch("");
                enrollmentsQuery?.refetch?.();
            }
        } catch {
            notify?.({ type: "error", message: "Network error while enrolling" });
        } finally {
            setEnrolling(false);
        }
    };

    // ── Unenroll ─────────────────────────────────────────────────────────────
    const handleUnenroll = async (classId: number, studentId: string) => {
        setUnenrollingId(studentId);
        try {
            const res = await fetch(`${BACKEND_BASE_URL}/enrollments/${classId}/${studentId}`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (!res.ok) {
                notify?.({ type: "error", message: json.error ?? "Failed to unenroll student" });
            } else {
                notify?.({ type: "success", message: "Student unenrolled" });
                enrollmentsQuery?.refetch?.();
            }
        } catch {
            notify?.({ type: "error", message: "Network error while unenrolling" });
        } finally {
            setUnenrollingId(null);
        }
    };

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Enrollments</h1>

            <div className="intro-row">
                <p>Manage student enrollments per class.</p>
            </div>

            {/* Class selector + search */}
            <Card className="mb-6 border border-border bg-card shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Users size={16} /> Select a Class
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-3">
                    {/* Search input */}
                    <div className="relative flex-1 sm:max-w-xs">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search classes…"
                            value={classSearch}
                            onChange={(e) => setClassSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Dropdown */}
                    <Select
                        value={selectedClassId}
                        onValueChange={(val) => { setSelectedClassId(val); setClassSearch(""); }}
                    >
                        <SelectTrigger className="w-full sm:w-[360px]">
                            <SelectValue placeholder="Choose a class…" />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredClasses.length === 0 ? (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    No classes match "{classSearch}"
                                </div>
                            ) : (
                                filteredClasses.map((cls) => (
                                    <SelectItem key={cls.id} value={String(cls.id)}>
                                        {cls.name}
                                        {cls.subject?.name && (
                                            <span className="ml-2 text-muted-foreground text-xs">
                                                · {cls.subject.name}
                                            </span>
                                        )}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Enrollment table */}
            {selectedClassId && (
                <Card className="border border-border bg-card shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <div>
                            <CardTitle className="text-base font-semibold">
                                {selectedClass?.name ?? "Class"} — Enrolled Students
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {enrollments.length} / {selectedClass?.capacity ?? "?"} capacity
                            </p>
                        </div>
                        <Button
                            size="sm"
                            className="gap-2"
                            onClick={() => { setEnrollDialogOpen(true); setStudentSearch(""); }}
                            disabled={!selectedClassId}
                        >
                            <UserPlus size={15} /> Enroll Student
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12"></TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead className="w-24"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {enrollmentsLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                                <Loader2 className="mx-auto animate-spin" size={20} />
                                            </TableCell>
                                        </TableRow>
                                    ) : enrollments.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                                No students enrolled in this class yet.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        enrollments.map((enrollment) => {
                                            const student = enrollment.student;
                                            const initials = student?.name
                                                ?.split(" ").map((n) => n[0]).join("").toUpperCase() ?? "?";
                                            return (
                                                <TableRow key={enrollment.studentId}>
                                                    <TableCell>
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={student?.image ?? ""} alt={student?.name} />
                                                            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                                                        </Avatar>
                                                    </TableCell>
                                                    <TableCell className="font-medium">{student?.name ?? "—"}</TableCell>
                                                    <TableCell className="text-muted-foreground">{student?.email ?? "—"}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive gap-1"
                                                            disabled={unenrollingId === enrollment.studentId}
                                                            onClick={() => handleUnenroll(enrollment.classId, enrollment.studentId)}
                                                        >
                                                            {unenrollingId === enrollment.studentId
                                                                ? <Loader2 size={14} className="animate-spin" />
                                                                : <Trash2 size={14} />
                                                            }
                                                            Unenroll
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* No class selected */}
            {!selectedClassId && (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
                    <Users size={40} className="opacity-30" />
                    <p className="text-sm">Select a class above to view and manage enrollments.</p>
                </div>
            )}

            {/* Enroll Student Dialog */}
            <Dialog open={enrollDialogOpen} onOpenChange={(open) => {
                setEnrollDialogOpen(open);
                if (!open) { setSelectedStudentId(""); setStudentSearch(""); }
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Enroll a Student</DialogTitle>
                    </DialogHeader>
                    <div className="py-2 space-y-3">
                        {/* Student search */}
                        <div className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email…"
                                value={studentSearch}
                                onChange={(e) => setStudentSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Student select */}
                        <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a student…" />
                            </SelectTrigger>
                            <SelectContent>
                                {studentsQuery?.isLoading ? (
                                    <div className="py-4 flex justify-center">
                                        <Loader2 size={16} className="animate-spin text-muted-foreground" />
                                    </div>
                                ) : availableStudents.length === 0 ? (
                                    <div className="py-4 text-center text-sm text-muted-foreground">
                                        {studentSearch ? `No students match "${studentSearch}"` : "All students are already enrolled"}
                                    </div>
                                ) : (
                                    availableStudents.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.name}
                                            <span className="ml-2 text-muted-foreground text-xs">· {s.email}</span>
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEnrollDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEnroll}
                            disabled={!selectedStudentId || enrolling}
                            className="gap-2"
                        >
                            {enrolling && <Loader2 size={14} className="animate-spin" />}
                            Enroll
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ListView>
    );
};

export default EnrollmentsList;
