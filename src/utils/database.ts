/**
 * SQLite数据库管理
 * 用于流量记录、设备信息、测速记录的持久化存储
 */

import SQLite from 'react-native-sqlite-storage';
import { TrafficRecord, ClientDevice, SpeedTestRecord } from '../types';

SQLite.enablePromise(true);

const DB_NAME = 'LenovoWiFiManager.db';
// const DB_VERSION = '1.0';
// const DB_DISPLAY_NAME = 'Lenovo WiFi Manager Database';
// const DB_SIZE = 10 * 1024 * 1024; // 10MB

class Database {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    this.db = await SQLite.openDatabase({
      name: DB_NAME,
      location: 'default',
    });

    await this.createTables();
    console.log('数据库初始化完成');
  }

  private async createTables(): Promise<void> {
    if (!this.db) return;

    // 流量记录表
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS traffic_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        date_str TEXT NOT NULL,
        hour INTEGER,
        upload_mb REAL DEFAULT 0,
        download_mb REAL DEFAULT 0,
        client_mac TEXT
      )
    `);

    // 设备信息表
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS devices (
        mac TEXT PRIMARY KEY,
        custom_name TEXT,
        device_type TEXT,
        first_seen DATETIME,
        is_blocked INTEGER DEFAULT 0,
        speed_limit INTEGER DEFAULT 0
      )
    `);

    // 测速记录表
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS speed_tests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        download_speed REAL,
        upload_speed REAL,
        ping_ms INTEGER,
        jitter_ms INTEGER,
        packet_loss REAL
      )
    `);

    // 创建索引
    await this.db.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_traffic_date ON traffic_logs(date_str)
    `);
    await this.db.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_traffic_mac ON traffic_logs(client_mac)
    `);
  }

  // ==================== 流量记录操作 ====================

  async saveTrafficLog(
    dateStr: string,
    hour: number,
    uploadMb: number,
    downloadMb: number,
    clientMac?: string
  ): Promise<void> {
    if (!this.db) return;

    await this.db.executeSql(
      `INSERT INTO traffic_logs (date_str, hour, upload_mb, download_mb, client_mac) 
       VALUES (?, ?, ?, ?, ?)`,
      [dateStr, hour, uploadMb, downloadMb, clientMac || null]
    );
  }

  async getTrafficByDate(dateStr: string): Promise<TrafficRecord | null> {
    if (!this.db) return null;

    const [result] = await this.db.executeSql(
      `SELECT hour, upload_mb, download_mb FROM traffic_logs 
       WHERE date_str = ? ORDER BY hour`,
      [dateStr]
    );

    if (result.rows.length === 0) return null;

    const hourlyData = [];
    let totalUpload = 0;
    let totalDownload = 0;

    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      hourlyData.push({
        hour: row.hour,
        upload: row.upload_mb,
        download: row.download_mb,
      });
      totalUpload += row.upload_mb;
      totalDownload += row.download_mb;
    }

    return {
      date: dateStr,
      hourlyData,
      totalUpload,
      totalDownload,
    };
  }

  async getTrafficByDateRange(startDate: string, endDate: string): Promise<TrafficRecord[]> {
    if (!this.db) return [];

    const [result] = await this.db.executeSql(
      `SELECT date_str, SUM(upload_mb) as total_upload, SUM(download_mb) as total_download 
       FROM traffic_logs 
       WHERE date_str BETWEEN ? AND ? 
       GROUP BY date_str 
       ORDER BY date_str`,
      [startDate, endDate]
    );

    const records: TrafficRecord[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      records.push({
        date: row.date_str,
        hourlyData: [],
        totalUpload: row.total_upload,
        totalDownload: row.total_download,
      });
    }

    return records;
  }

  async getClientTrafficByDate(dateStr: string): Promise<Array<{ mac: string; upload: number; download: number }>> {
    if (!this.db) return [];

    const [result] = await this.db.executeSql(
      `SELECT client_mac, SUM(upload_mb) as upload, SUM(download_mb) as download 
       FROM traffic_logs 
       WHERE date_str = ? AND client_mac IS NOT NULL 
       GROUP BY client_mac`,
      [dateStr]
    );

    const traffic = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      traffic.push({
        mac: row.client_mac,
        upload: row.upload,
        download: row.download,
      });
    }

    return traffic;
  }

  async cleanOldTrafficData(days: number = 90): Promise<void> {
    if (!this.db) return;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const dateStr = cutoffDate.toISOString().split('T')[0];

    await this.db.executeSql(
      `DELETE FROM traffic_logs WHERE date_str < ?`,
      [dateStr]
    );
  }

  // ==================== 设备信息操作 ====================

  async saveDevice(device: Partial<ClientDevice>): Promise<void> {
    if (!this.db) return;

    await this.db.executeSql(
      `INSERT OR REPLACE INTO devices (mac, custom_name, device_type, first_seen, is_blocked, speed_limit) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        device.macAddress,
        device.customName || null,
        device.deviceType || 'unknown',
        device.firstSeen || new Date().toISOString(),
        device.isBlocked ? 1 : 0,
        device.speedLimit || 0,
      ]
    );
  }

  async getDevice(mac: string): Promise<Partial<ClientDevice> | null> {
    if (!this.db) return null;

    const [result] = await this.db.executeSql(
      `SELECT * FROM devices WHERE mac = ?`,
      [mac]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows.item(0);
    return {
      macAddress: row.mac,
      customName: row.custom_name,
      deviceType: row.device_type,
      firstSeen: row.first_seen,
      isBlocked: row.is_blocked === 1,
      speedLimit: row.speed_limit,
    };
  }

  async getAllDevices(): Promise<Partial<ClientDevice>[]> {
    if (!this.db) return [];

    const [result] = await this.db.executeSql(`SELECT * FROM devices`);

    const devices = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      devices.push({
        macAddress: row.mac,
        customName: row.custom_name,
        deviceType: row.device_type,
        firstSeen: row.first_seen,
        isBlocked: row.is_blocked === 1,
        speedLimit: row.speed_limit,
      });
    }

    return devices;
  }

  async updateDeviceName(mac: string, customName: string): Promise<void> {
    if (!this.db) return;

    await this.db.executeSql(
      `UPDATE devices SET custom_name = ? WHERE mac = ?`,
      [customName, mac]
    );
  }

  // ==================== 测速记录操作 ====================

  async saveSpeedTest(record: SpeedTestRecord): Promise<void> {
    if (!this.db) return;

    await this.db.executeSql(
      `INSERT INTO speed_tests (download_speed, upload_speed, ping_ms, jitter_ms, packet_loss) 
       VALUES (?, ?, ?, ?, ?)`,
      [record.downloadSpeed, record.uploadSpeed, record.pingMs, record.jitterMs, record.packetLoss]
    );
  }

  async getSpeedTestHistory(limit: number = 50): Promise<SpeedTestRecord[]> {
    if (!this.db) return [];

    const [result] = await this.db.executeSql(
      `SELECT * FROM speed_tests ORDER BY timestamp DESC LIMIT ?`,
      [limit]
    );

    const records = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      records.push({
        id: row.id,
        timestamp: row.timestamp,
        downloadSpeed: row.download_speed,
        uploadSpeed: row.upload_speed,
        pingMs: row.ping_ms,
        jitterMs: row.jitter_ms,
        packetLoss: row.packet_loss,
      });
    }

    return records;
  }

  async clearSpeedTestHistory(): Promise<void> {
    if (!this.db) return;

    await this.db.executeSql(`DELETE FROM speed_tests`);
  }

  // ==================== 数据库管理 ====================

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }

  async clearAllData(): Promise<void> {
    if (!this.db) return;

    await this.db.executeSql(`DELETE FROM traffic_logs`);
    await this.db.executeSql(`DELETE FROM devices`);
    await this.db.executeSql(`DELETE FROM speed_tests`);
  }
}

export const database = new Database();
export default database;
