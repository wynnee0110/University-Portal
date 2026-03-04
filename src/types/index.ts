export type Subject = {
    id: string;
    name: string;
    code: string;
    description: string;
    department: string;
    createdAt: string;
    updatedAt: string;
}



export type ListResponse<T = unknown> = {
    data?: T[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export type CreateResponse<T = unknown> = {
    data?: T;
};

export type GetOneResponse<T = unknown> = {
    data?: T;
};

declare global {
    interface CloudinaryUploadWidgetResults {
        event: string;
        info: {
            secure_url: string;
            public_id: string;
            delete_token?: string;
            resource_type: string;
            original_filename: string;
        };
    }

    interface CloudinaryWidget {
        open: () => void;
    }

    interface Window {
        cloudinary?: {
            createUploadWidget: (
                options: Record<string, unknown>,
                callback: (
                    error: unknown,
                    result: CloudinaryUploadWidgetResults
                ) => void
            ) => CloudinaryWidget;
        };
    }
}

export interface UploadWidgetValue {
    url: string;
    publicId: string;
}

export interface UploadWidgetProps {
    value?: UploadWidgetValue | null;
    onChange?: (value: UploadWidgetValue | null) => void;
    disabled?: boolean;
}

export enum UserRole {
    STUDENT = "student",
    TEACHER = "teacher",
    ADMIN = "admin",
}

export type User = {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    name: string;
    role: UserRole;
    image?: string;
    imageCldPubId?: string;
    department?: string;
};

export type Schedule = {
    day: string;
    startTime: string;
    endTime: string;
};

export type Department = {
    id: number;
    name: string;
    description: string;
};

export type ClassDetails = {
    id: number;
    name: string;
    description: string;
    status: "active" | "inactive";
    capacity: number;
    courseCode: string;
    courseName: string;
    bannerUrl?: string;
    bannerCldPubId?: string;
    subject?: Subject;
    teacher?: User;
    department?: Department;
    schedules: Schedule[];
    inviteCode?: string;
};

export type SignUpPayload = {
    email: string;
    name: string;
    password: string;
    image?: string;
    imageCldPubId?: string;
    role: UserRole;
};

export type Enrollment = {
    studentId: string;
    classId: number;
    student?: User;
};

export type DepartmentDetail = Department & {
    code: string;
    subjectCount?: number;
    subjects?: Pick<Subject, 'id' | 'name' | 'code'>[];
    createdAt?: string;
    updatedAt?: string;
};

export type Stats = {
    overview: {
        totalUsers: number;
        totalClasses: number;
        totalDepartments: number;
        totalEnrollments: number;
        totalSubjects: number;
    };
    usersByRole: { role: string; count: number }[];
    classesByDepartment: { department: string; count: number }[];
    capacityStatus: { label: string; value: number }[];
    enrollmentTrends: { month: string; count: number }[];
    recentActivity: {
        id: number;
        name: string;
        status: string;
        createdAt: string;
        teacherName: string;
        subjectName: string;
    }[];
};