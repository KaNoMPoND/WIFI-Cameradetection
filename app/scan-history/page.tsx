'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

interface ScanRecord {
  id: string;
  date: string;
  time: string;
  deviceCount: number;
  vulnerabilityCount: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  status: 'Completed' | 'In Progress';
}

type SortField = 'id' | 'date' | 'time' | 'deviceCount' | 'vulnerabilityCount' | 'riskLevel' | 'status';
type SortDirection = 'asc' | 'desc' | null;

export default function ScanHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'high-risk' | 'last-7-days'>('all');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  const [scanRecords, setScanRecords] = useState<ScanRecord[]>([
    {
      id: 'SC-001',
      date: '15/01/2025',
      time: '14:30',
      deviceCount: 8,
      vulnerabilityCount: 12,
      riskLevel: 'High',
      status: 'Completed'
    },
    {
      id: 'SC-002',
      date: '18/01/2025',
      time: '09:15',
      deviceCount: 5,
      vulnerabilityCount: 3,
      riskLevel: 'Medium',
      status: 'Completed'
    },
    {
      id: 'SC-003',
      date: '20/01/2025',
      time: '16:45',
      deviceCount: 10,
      vulnerabilityCount: 0,
      riskLevel: 'Low',
      status: 'Completed'
    },
    {
      id: 'SC-004',
      date: '22/01/2025',
      time: '11:30',
      deviceCount: 12,
      vulnerabilityCount: 8,
      riskLevel: 'High',
      status: 'Completed'
    },
    {
      id: 'SC-005',
      date: '10/01/2025',
      time: '08:20',
      deviceCount: 6,
      vulnerabilityCount: 15,
      riskLevel: 'High',
      status: 'Completed'
    },
    {
      id: 'SC-006',
      date: '05/01/2025',
      time: '13:45',
      deviceCount: 3,
      vulnerabilityCount: 2,
      riskLevel: 'Low',
      status: 'Completed'
    }
  ]);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and search logic
  const filteredRecords = scanRecords.filter(record => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.date.includes(searchTerm) ||
      record.time.includes(searchTerm) ||
      record.deviceCount.toString().includes(searchTerm) ||
      record.vulnerabilityCount.toString().includes(searchTerm) ||
      record.riskLevel.includes(searchTerm);

    // Date filter for "Last 7 Days"
    const matchesDateFilter = activeFilter !== 'last-7-days' || 
      (() => {
        const recordDate = new Date(record.date.split('/').reverse().join('-'));
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return recordDate >= sevenDaysAgo;
      })();

    // Risk filter for "High Risk"
    const matchesRiskFilter = activeFilter !== 'high-risk' || record.riskLevel === 'High';

    return matchesSearch && matchesDateFilter && matchesRiskFilter;
  });

  // Apply sorting to filtered records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    // Handle different data types
    switch (sortField) {
      case 'date':
        // Convert date strings to Date objects for comparison
        aValue = new Date(a.date.split('/').reverse().join('-'));
        bValue = new Date(b.date.split('/').reverse().join('-'));
        break;
      case 'deviceCount':
      case 'vulnerabilityCount':
        // Numbers are already numbers
        break;
      case 'riskLevel':
        // Custom order for risk levels: High > Medium > Low
        const riskOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        aValue = riskOrder[a.riskLevel];
        bValue = riskOrder[b.riskLevel];
        break;
      case 'id':
      case 'time':
      case 'status':
        // String comparison
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
        break;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getRiskBadgeClass = (risk: string) => {
    switch(risk) {
      case 'High':
        return 'bg-red-500/20 text-red-400 border border-red-500';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500';
      case 'Low':
        return 'bg-green-500/20 text-green-400 border border-green-500';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500';
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    if (sortDirection === 'asc') {
      return (
        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    } else if (sortDirection === 'desc') {
      return (
        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
    
    return null;
  };

  return (
    <main className="min-h-screen bg-[#141526] text-white">
      <Navbar />
      
      <div className="max-w-6xl mx-auto pt-24 px-4 pb-12">
        <div className="bg-[rgba(35,37,57,0.95)] rounded-3xl p-8 mb-8">
          <h1 className="text-2xl font-bold mb-6">Scan History</h1>
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeFilter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-[#1c1e30] hover:bg-[#2a2d43]'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveFilter('high-risk')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeFilter === 'high-risk' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-[#1c1e30] hover:bg-[#2a2d43]'
                }`}
              >
                High Risk
              </button>
              <button 
                onClick={() => setActiveFilter('last-7-days')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeFilter === 'last-7-days' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-[#1c1e30] hover:bg-[#2a2d43]'
                }`}
              >
                Last 7 Days
              </button>
            </div>
            <div>
              <input 
                type="text" 
                placeholder="Search" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#1c1e30] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {sortedRecords.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#2a2d43]">
                    <th 
                      className="py-3 px-4 text-left font-medium cursor-pointer hover:bg-[#1c1e30] transition-colors"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>ID</span>
                        {getSortIcon('id')}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 text-left font-medium cursor-pointer hover:bg-[#1c1e30] transition-colors"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Date</span>
                        {getSortIcon('date')}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 text-left font-medium cursor-pointer hover:bg-[#1c1e30] transition-colors"
                      onClick={() => handleSort('time')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Time</span>
                        {getSortIcon('time')}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 text-left font-medium cursor-pointer hover:bg-[#1c1e30] transition-colors"
                      onClick={() => handleSort('deviceCount')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Devices</span>
                        {getSortIcon('deviceCount')}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 text-left font-medium cursor-pointer hover:bg-[#1c1e30] transition-colors"
                      onClick={() => handleSort('vulnerabilityCount')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Vulnerabilities</span>
                        {getSortIcon('vulnerabilityCount')}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 text-left font-medium cursor-pointer hover:bg-[#1c1e30] transition-colors"
                      onClick={() => handleSort('riskLevel')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Risk</span>
                        {getSortIcon('riskLevel')}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 text-left font-medium cursor-pointer hover:bg-[#1c1e30] transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Status</span>
                        {getSortIcon('status')}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRecords.map((record) => (
                    <tr key={record.id} className="border-b border-[#2a2d43] hover:bg-[#1c1e30]">
                      <td className="py-4 px-4">{record.id}</td>
                      <td className="py-4 px-4">{record.date}</td>
                      <td className="py-4 px-4">{record.time}</td>
                      <td className="py-4 px-4">{record.deviceCount}</td>
                      <td className="py-4 px-4">{record.vulnerabilityCount}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs ${getRiskBadgeClass(record.riskLevel)}`}>
                          {record.riskLevel}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500">
                          {record.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Link href={`/report?id=${record.id}`} className="text-blue-500 hover:text-blue-400 mr-4">
                          View Report
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">
                  {searchTerm ? 'No search results found' : 'No data found'}
                </div>
                <div className="text-gray-500 text-sm">
                  {searchTerm ? `No items found matching "${searchTerm}"` : 'No scan data available in the system'}
                </div>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-4 text-blue-500 hover:text-blue-400 underline"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Showing {sortedRecords.length > 0 ? '1' : '0'}-{sortedRecords.length} of {sortedRecords.length} entries
              {searchTerm && (
                <span className="ml-2 text-blue-400">
                  (Search: "{searchTerm}")
                </span>
              )}
              {activeFilter !== 'all' && (
                <span className="ml-2 text-blue-400">
                  (Filter: {
                    activeFilter === 'high-risk' ? 'High Risk' : 
                    activeFilter === 'last-7-days' ? 'Last 7 Days' : ''
                  })
                </span>
              )}
              {sortField && sortDirection && (
                <span className="ml-2 text-blue-400">
                  (Sorted by: {sortField} {sortDirection === 'asc' ? '↑' : '↓'})
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <button className="bg-[#1c1e30] px-3 py-1 rounded-lg hover:bg-[#2a2d43] transition-colors disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors">
                1
              </button>
              <button className="bg-[#1c1e30] px-3 py-1 rounded-lg hover:bg-[#2a2d43] transition-colors disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 