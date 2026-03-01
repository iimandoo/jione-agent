interface PageLog {
  id: number;
  url: string;
  path: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  timestamp: Date;
}

let logs: PageLog[] = [];
let nextId = 1;

export const memoryDB = {
  addLog: (data: Omit<PageLog, "id" | "timestamp">) => {
    const log: PageLog = {
      id: nextId++,
      ...data,
      timestamp: new Date(),
    };
    logs.push(log);
    return log;
  },
  getLogs: (limit: number = 100) => {
    return logs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  },
  getStats: () => {
    const stats: Record<string, { count: number; lastVisit: Date }> = {};
    logs.forEach((log) => {
      if (!stats[log.path])
        stats[log.path] = { count: 0, lastVisit: log.timestamp };
      stats[log.path].count++;
      if (log.timestamp > stats[log.path].lastVisit) {
        stats[log.path].lastVisit = log.timestamp;
      }
    });
    return stats;
  },
  clearLogs: () => {
    logs = [];
    nextId = 1;
  },
};
