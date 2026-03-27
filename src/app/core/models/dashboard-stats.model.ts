export interface DashboardActivity {
    type: string;
    user: string;
    message: string;
    time: string;
    icon: string;
    critical: boolean;
}

export interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    totalModules: number;
    totalPuzzles: number;
    totalQuizzes: number;
    totalXp: number;
    recentActivities: DashboardActivity[];
    userGrowth: { [month: string]: number };
}
