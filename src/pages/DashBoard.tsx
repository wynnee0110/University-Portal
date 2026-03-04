import { useState, useEffect } from "react";
import { BACKEND_BASE_URL } from "@/constants";
import { Stats } from "@/types";
import { Users, GraduationCap, Building2, BookOpen, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

const StatCard = ({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: number; color: string;
}) => (
  <Card className="stat-card">
    <CardContent className="stat-card-content">
      <div className="stat-icon-wrap" style={{ background: `${color}18` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value.toLocaleString()}</p>
      </div>
    </CardContent>
  </Card>
);

const DashBoard = () => {
  const [stats, setStats] = useState<Stats | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${BACKEND_BASE_URL}/stats`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setStats(json?.data ?? json);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <h1 className="page-title">Dashboard</h1>
        <p className="state-message">Loading dashboard data...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="dashboard-page">
        <h1 className="page-title">Dashboard</h1>
        <p className="state-message">Failed to load dashboard data. {error}</p>
      </div>
    );
  }

  const { overview, usersByRole, classesByDepartment, capacityStatus, enrollmentTrends, recentActivity } = stats;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your classroom management system</p>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards-grid">
        <StatCard icon={Users} label="Total Users" value={overview.totalUsers} color="#6366f1" />
        <StatCard icon={GraduationCap} label="Total Classes" value={overview.totalClasses} color="#f59e0b" />
        <StatCard icon={Building2} label="Departments" value={overview.totalDepartments} color="#10b981" />
        <StatCard icon={BookOpen} label="Total Subjects" value={overview.totalSubjects} color="#8b5cf6" />
        <StatCard icon={TrendingUp} label="Enrollments" value={overview.totalEnrollments} color="#ec4899" />
      </div>

      {/* Charts Row 1 */}
      <div className="charts-grid">
        {/* Enrollment Trends */}
        <Card className="chart-card">
          <CardHeader>
            <CardTitle className="chart-title">Enrollment Trends (6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={enrollmentTrends}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Classes by Department */}
        <Card className="chart-card">
          <CardHeader>
            <CardTitle className="chart-title">Classes by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={classesByDepartment} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="department" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Capacity Status */}
        <Card className="chart-card">
          <CardHeader>
            <CardTitle className="chart-title">Capacity Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={capacityStatus} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {capacityStatus.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card className="chart-card">
          <CardHeader>
            <CardTitle className="chart-title">User Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={usersByRole} dataKey="count" nameKey="role" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {usersByRole.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="activity-card">
        <CardHeader>
          <CardTitle className="chart-title flex items-center gap-2">
            <Activity size={18} /> Recent Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="activity-list">
            {recentActivity.length === 0 && (
              <p className="state-message">No recent activity</p>
            )}
            {recentActivity.map((item: any) => (
              <div key={item.id} className="activity-item">
                <div>
                  <p className="activity-name">{item.name}</p>
                  <p className="activity-meta">{item.subjectName} · {item.teacherName}</p>
                </div>
                <Badge variant={item.status === "active" ? "default" : "secondary"}>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashBoard;